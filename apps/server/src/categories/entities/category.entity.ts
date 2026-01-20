import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class Category {
  @ApiProperty({ description: '업종대분류명' })
  @IsString()
  indutyLclasNm: string;

  @ApiProperty({ description: '업종중분류명' })
  @IsString()
  indutyMlsfcNm: string;
}
