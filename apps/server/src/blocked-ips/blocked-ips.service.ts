import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBlockedIpReq, GetBlockedIpListReq, UpdateBlockedIpReq } from './dto/blocked-ip.dto';
import { BlockedIp } from '@prisma/client';
import { IpUtil, PaginationUtil } from 'src/common/utils';

@Injectable()
export class BlockedIpsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(adminId: string, dto: CreateBlockedIpReq): Promise<BlockedIp> {
    return this.prisma.blockedIp.create({
      data: {
        ipPattern: dto.ipPattern,
        reason: dto.reason,
        blockedBy: adminId,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
    });
  }

  async findAll({
    pageNo,
    pageSize,
    ipPattern,
    isActive,
  }: GetBlockedIpListReq): Promise<BlockedIp[]> {
    const { skip, take } = PaginationUtil.getSkipTake({ pageNo, pageSize });
    return this.prisma.blockedIp.findMany({
      skip,
      take,
      where: {
        ...(ipPattern && { ipPattern: { contains: ipPattern } }),
        ...(isActive !== undefined && { isActive }),
      },
      orderBy: { blockedAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<BlockedIp> {
    const blockedIp = await this.prisma.blockedIp.findUnique({
      where: { id },
    });
    if (!blockedIp) {
      throw new NotFoundException(`BlockedIp #${id} not found`);
    }
    return blockedIp;
  }

  async update(id: string, dto: UpdateBlockedIpReq): Promise<BlockedIp> {
    await this.findOne(id);

    return this.prisma.blockedIp.update({
      where: { id },
      data: {
        ipPattern: dto.ipPattern,
        reason: dto.reason,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
        isActive: dto.isActive,
      },
    });
  }

  async remove(id: string): Promise<BlockedIp> {
    await this.findOne(id);
    return this.prisma.blockedIp.delete({ where: { id } });
  }

  async isIpBlocked(ipAddress: string): Promise<boolean> {
    const now = new Date();

    // 정확한 IP 일치 검사
    const exactMatch = await this.prisma.blockedIp.findFirst({
      where: {
        ipPattern: ipAddress,
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
    });

    if (exactMatch) return true;

    // CIDR 패턴 검사
    const cidrPatterns = await this.prisma.blockedIp.findMany({
      where: {
        ipPattern: { contains: '/' },
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
    });

    for (const pattern of cidrPatterns) {
      if (IpUtil.isIpInCidr(ipAddress, pattern.ipPattern)) {
        return true;
      }
    }

    return false;
  }
}
