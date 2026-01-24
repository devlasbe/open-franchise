import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { TypeUtil } from 'src/common/utils/type.util';
import { AdminComment, Comment, CommentWithReplies } from '../entities/comment.entity';
import { PagenationRequest } from 'src/common/dto/pagenation.dto';
import { BlockedIp } from 'src/blocked-ips/entities/blocked-ip.entity';

export class CreateCommentReq {
  @IsString()
  @IsOptional()
  @MaxLength(20)
  @ApiProperty({ description: '닉네임 (빈값 시 익명)', required: false, example: '프랜차이즈맨' })
  nickname?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({ description: '비밀번호 (삭제 시 필요)', example: '1234' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  @ApiProperty({ description: '댓글 내용', example: '이 브랜드 어떤가요?' })
  content: string;
}

export class CreateReplyReq extends CreateCommentReq {}

export class DeleteCommentReq {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '비밀번호', example: '1234' })
  password: string;
}

export class GetCommentsReq extends PagenationRequest {}

export class GetAdminCommentsReq extends PagenationRequest {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: '브랜드명 검색', required: false })
  brandNm?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'IP 주소 검색', required: false })
  ipAddress?: string;
}

class CommentListPayload {
  @ApiProperty({ description: '댓글 목록', type: [CommentWithReplies] })
  comments: CommentWithReplies[];

  @ApiProperty({ description: '전체 댓글 수' })
  totalCount: number;

  @ApiProperty({ description: '전체 페이지 수' })
  totalPages: number;

  @ApiProperty({ description: '현재 페이지' })
  currentPage: number;
}

export class GetCommentsRes extends TypeUtil.getSuccessResponse(CommentListPayload) {}
export class GetCommentRes extends TypeUtil.getSuccessResponse(Comment) {}
export class GetAdminCommentsRes extends TypeUtil.getSuccessResponseList(AdminComment) {}

export class BlockCommentIpReq {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  @ApiProperty({ description: '차단 사유', required: false })
  reason?: string;
}

export class BlockCommentIpRes extends TypeUtil.getSuccessResponse(BlockedIp) {}
