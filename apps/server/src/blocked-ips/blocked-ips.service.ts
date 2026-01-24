import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBlockedIpReq, GetBlockedIpListReq, UpdateBlockedIpReq } from './dto/blocked-ip.dto';
import { BlockedIp } from '@prisma/client';

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
    return this.prisma.blockedIp.findMany({
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
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
      if (this.isIpInCidr(ipAddress, pattern.ipPattern)) {
        return true;
      }
    }

    return false;
  }

  private isIpInCidr(ip: string, cidr: string): boolean {
    const [range, bits] = cidr.split('/');
    const mask = parseInt(bits, 10);

    if (isNaN(mask) || mask < 0 || mask > 32) return false;

    const ipLong = this.ipToLong(ip);
    const rangeLong = this.ipToLong(range);

    if (ipLong === null || rangeLong === null) return false;

    const maskLong = mask === 0 ? 0 : -1 << (32 - mask);
    return (ipLong & maskLong) === (rangeLong & maskLong);
  }

  private ipToLong(ip: string): number | null {
    const parts = ip.split('.');
    if (parts.length !== 4) return null;

    let result = 0;
    for (const part of parts) {
      const num = parseInt(part, 10);
      if (isNaN(num) || num < 0 || num > 255) return null;
      result = result * 256 + num;
    }
    return result >>> 0;
  }
}
