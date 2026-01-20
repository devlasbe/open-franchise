import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PagenationRequest {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ description: '페이지 번호', example: 1 })
  pageNo: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ description: '가져올 데이터 수', example: 10 })
  pageSize: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '정렬할 컬럼명', required: false })
  orderCol?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '정렬 방법',
    example: 'asc | desc',
    required: false,
  })
  orderSort?: 'asc' | 'desc';
}
