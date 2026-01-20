import { TypeUtil } from 'src/common/utils/type.util';
import { Statistic } from '../entities/statistic.entity';
import { PagenationRequest } from 'src/common/dto/pagenation.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetStatisticListRes extends TypeUtil.getSuccessResponseList(
  Statistic,
) {}

export class GetStatisticByFilterReq extends PagenationRequest {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '브랜드명',
    example: '씨유(CU)',
    required: false,
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '카테고리', example: '치킨', required: false })
  category: string;
}
