import { ApiProperty } from '@nestjs/swagger';

export class BlockedIp {
  @ApiProperty({ description: 'ID' })
  id: string;

  @ApiProperty({ description: 'IP 패턴 (CIDR 지원)' })
  ipPattern: string;

  @ApiProperty({ description: '차단 사유', required: false })
  reason: string | null;

  @ApiProperty({ description: '차단한 관리자 ID' })
  blockedBy: string;

  @ApiProperty({ description: '차단 일시' })
  blockedAt: Date;

  @ApiProperty({ description: '만료 일시', required: false })
  expiresAt: Date | null;

  @ApiProperty({ description: '활성화 여부' })
  isActive: boolean;
}
