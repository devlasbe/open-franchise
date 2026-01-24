import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';
import { TypeUtil } from 'src/common/utils/type.util';
import { BlockedIp } from '../entities/blocked-ip.entity';
import { PagenationRequest } from 'src/common/dto/pagenation.dto';

export class CreateBlockedIpReq {
  @IsString()
  @ApiProperty({ description: 'IP 패턴 (CIDR 지원)', example: '192.168.1.0/24' })
  ipPattern: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '차단 사유', required: false, example: '스팸 댓글' })
  reason?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ description: '만료 일시 (ISO 8601)', required: false })
  expiresAt?: string;
}

export class UpdateBlockedIpReq {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'IP 패턴 (CIDR 지원)', required: false })
  ipPattern?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '차단 사유', required: false })
  reason?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ description: '만료 일시 (ISO 8601)', required: false })
  expiresAt?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: '활성화 여부', required: false })
  isActive?: boolean;
}

export class GetBlockedIpListReq extends PagenationRequest {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'IP 패턴 검색', required: false })
  ipPattern?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: '활성화 여부 필터', required: false })
  isActive?: boolean;
}

export class GetBlockedIpRes extends TypeUtil.getSuccessResponse(BlockedIp) {}
export class GetBlockedIpListRes extends TypeUtil.getSuccessResponseList(BlockedIp) {}
