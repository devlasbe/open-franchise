import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BlockedIpsService } from 'src/blocked-ips/blocked-ips.service';
import {
  BlockCommentIpReq,
  CreateCommentReq,
  CreateReplyReq,
  DeleteCommentReq,
  GetAdminCommentsReq,
  GetCommentsReq,
} from './dto/comment.dto';
import { BlockedIp } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Comment } from '@prisma/client';
import { PaginationUtil } from 'src/common/utils';

const SALT_ROUNDS = 10;

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly blockedIpsService: BlockedIpsService,
  ) {}

  async create(brandNm: string, dto: CreateCommentReq, ipAddress: string, userAgent?: string) {
    // IP 차단 여부 확인
    const isBlocked = await this.blockedIpsService.isIpBlocked(ipAddress);
    if (isBlocked) {
      throw new ForbiddenException('차단된 IP입니다.');
    }

    // 브랜드 존재 여부 확인
    const brand = await this.prisma.brand.findUnique({ where: { brandNm } });
    if (!brand) {
      throw new NotFoundException(`브랜드 '${brandNm}'을(를) 찾을 수 없습니다.`);
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    return this.prisma.comment.create({
      data: {
        brandNm,
        nickname: dto.nickname || null,
        password: hashedPassword,
        content: dto.content,
        ipAddress,
        userAgent,
      },
    });
  }

  async createReply(commentId: string, dto: CreateReplyReq, ipAddress: string, userAgent?: string) {
    // IP 차단 여부 확인
    const isBlocked = await this.blockedIpsService.isIpBlocked(ipAddress);
    if (isBlocked) {
      throw new ForbiddenException('차단된 IP입니다.');
    }

    // 부모 댓글 확인
    const parentComment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!parentComment) {
      throw new NotFoundException('원본 댓글을 찾을 수 없습니다.');
    }

    if (parentComment.isDeleted) {
      throw new BadRequestException('삭제된 댓글에는 답글을 달 수 없습니다.');
    }

    // 1depth 제한: 대댓글의 대댓글 불가
    if (parentComment.parentId) {
      throw new BadRequestException('대댓글에는 답글을 달 수 없습니다.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    return this.prisma.comment.create({
      data: {
        brandNm: parentComment.brandNm,
        parentId: commentId,
        nickname: dto.nickname || null,
        password: hashedPassword,
        content: dto.content,
        ipAddress,
        userAgent,
      },
    });
  }

  async findAll(brandNm: string, { pageNo, pageSize }: GetCommentsReq) {
    // 루트 댓글만 조회 (parentId가 null인 것)
    const where = {
      brandNm,
      parentId: null,
    };
    const { skip, take } = PaginationUtil.getSkipTake({ pageNo, pageSize });

    const [comments, totalCount] = await Promise.all([
      this.prisma.comment.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          replies: {
            orderBy: { createdAt: 'asc' },
          },
        },
      }),
      this.prisma.comment.count({ where }),
    ]);

    // 민감 정보 제거
    const sanitizedComments = comments.map((comment) => this.sanitizeComment(comment));

    const { totalPages, currentPage } = PaginationUtil.createResult(sanitizedComments, totalCount, {
      pageNo,
      pageSize,
    });

    return {
      comments: sanitizedComments,
      totalCount,
      totalPages,
      currentPage,
    };
  }

  async delete(id: string, dto: DeleteCommentReq) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    if (comment.isDeleted) {
      throw new BadRequestException('이미 삭제된 댓글입니다.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, comment.password);
    if (!isPasswordValid) {
      throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
    }

    // Soft delete
    return this.prisma.comment.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  // 관리자용 API
  async findAllAdmin({ pageNo, pageSize, brandNm, ipAddress }: GetAdminCommentsReq) {
    const { skip, take } = PaginationUtil.getSkipTake({ pageNo, pageSize });
    return this.prisma.comment.findMany({
      where: {
        ...(brandNm && { brandNm: { contains: brandNm, mode: 'insensitive' as const } }),
        ...(ipAddress && { ipAddress: { contains: ipAddress } }),
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async forceDelete(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    // Soft delete
    return this.prisma.comment.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async blockCommentIp(
    commentId: string,
    adminId: string,
    dto: BlockCommentIpReq,
  ): Promise<BlockedIp> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    const existingBlock = await this.prisma.blockedIp.findFirst({
      where: { ipPattern: comment.ipAddress, isActive: true },
    });

    if (existingBlock) {
      throw new ConflictException('이미 차단된 IP입니다.');
    }

    return this.prisma.blockedIp.create({
      data: {
        ipPattern: comment.ipAddress,
        reason: dto.reason || `댓글에서 차단 (ID: ${commentId})`,
        blockedBy: adminId,
      },
    });
  }

  private sanitizeComment(comment: Comment & { replies?: Comment[] }) {
    const { password, ipAddress, userAgent, replies, ...rest } = comment;

    return {
      ...rest,
      content: rest.isDeleted ? '삭제된 댓글입니다.' : rest.content,
      nickname: rest.isDeleted ? null : rest.nickname,
      replies: replies?.map((reply) => this.sanitizeComment(reply)) || [],
    };
  }
}
