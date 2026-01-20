import { ApiProperty } from '@nestjs/swagger';

export class Startup {
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

  @ApiProperty({ description: '가맹금액' })
  jngBzmnJngAmt: number;

  @ApiProperty({ description: '교육금액' })
  jngBzmnEduAmt: number;

  @ApiProperty({ description: '기타금액' })
  jngBzmnEtcAmt: number;

  @ApiProperty({ description: '보증금액' })
  jngBzmnAssrncAmt: number;

  @ApiProperty({ description: '합계금액' })
  smtnAmt: number;
}
