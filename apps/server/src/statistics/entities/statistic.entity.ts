import { ApiProperty } from '@nestjs/swagger';
import { Brand } from 'src/brands/entities/brand.entity';
import { Startup } from 'src/startups/entities/startup.entity';

export class Statistic {
  @ApiProperty({ description: '브랜드명' })
  brandNm: string;

  @ApiProperty({ description: '법인명' })
  corpNm: string;

  @ApiProperty({ description: '기준년도' })
  yr: string;

  @ApiProperty({ description: '업종대분류명' })
  indutyLclasNm: string;

  @ApiProperty({ description: '업종중분류명' })
  indutyMlsfcNm: string;

  @ApiProperty({ description: '가맹점수' })
  frcsCnt: number;

  @ApiProperty({ description: '신규가맹점등록수' })
  newFrcsRgsCnt: number;

  @ApiProperty({ description: '계약종료수' })
  ctrtEndCnt: number;

  @ApiProperty({ description: '계약해지수' })
  ctrtCncltnCnt: number;

  @ApiProperty({ description: '명의변경수' })
  nmChgCnt: number;

  @ApiProperty({ description: '평균매출금액' })
  avrgSlsAmt: number;

  @ApiProperty({ description: '면적단위평균매출금액' })
  arUnitAvrgSlsAmt: number;

  @ApiProperty({ description: '브랜드 정보', nullable: true })
  brand?: Brand;

  @ApiProperty({ description: '창업금액', nullable: true })
  startup?: Startup;
}
