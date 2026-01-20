import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { TypeUtil } from 'src/common/utils/type.util';
import { Interior } from '../entities/interior.entity';

export class GetInteriorReq {
  @ApiProperty({ description: '브랜드관리번호' })
  @IsString()
  brandMnno: string;
}

export class GetInteriorRes extends TypeUtil.getSuccessResponse(Interior) {}
