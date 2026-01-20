import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PagenationRequest } from 'src/common/dto/pagenation.dto';
import { TypeUtil } from 'src/common/utils/type.util';
import { Brand } from '../entities/brand.entity';
import { Head } from 'src/heads/entities/head.entity';

export class GetBrandListReq extends PagenationRequest {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: '브랜드 명', required: false, example: '놀부' })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '카테고리', required: false })
  category?: string;
}

class BrandRes {
  @ApiProperty({ description: '브랜드 데이터' })
  brand: Brand;
  @ApiProperty({ description: '본사 데이터' })
  head: Head;
  @ApiProperty({ description: '브랜드 차단 여부' })
  isRejectedBrand: boolean;
}
export class GetBrandRes extends TypeUtil.getSuccessResponse(BrandRes) {}
export class GetBrandListRes extends TypeUtil.getSuccessResponseList(Brand) {}

export class AddRejectedBrandDto {
  @IsString()
  @ApiProperty({ description: '브랜드 명', example: '나쁜브랜드' })
  brandNm: string;
}

export class RejectedBrand {
  @ApiProperty({ description: '브랜드 명' })
  brandNm: string;
}

export class GetRejectedBrandListRes extends TypeUtil.getSuccessResponseList(
  RejectedBrand,
) {}
