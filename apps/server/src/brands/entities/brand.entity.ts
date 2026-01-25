import { ApiProperty } from '@nestjs/swagger';
import { Statistic } from 'src/statistics/entities/statistic.entity';

export class Brand {
  @ApiProperty({ description: '브랜드관리번호' })
  brandMnno: string;

  @ApiProperty({ description: '가맹본부관리번호' })
  jnghdqrtrsMnno: string;

  @ApiProperty({ description: '사업자등록번호' })
  brno: string;

  @ApiProperty({ description: '법인등록번호', required: false })
  crno: string;

  @ApiProperty({ description: '가맹본부대표자명' })
  jnghdqrtrsRprsvNm: string;

  @ApiProperty({ description: '브랜드명' })
  brandNm: string;

  @ApiProperty({ description: '업종대분류명' })
  indutyLclasNm: string;

  @ApiProperty({ description: '업종중분류명' })
  indutyMlsfcNm: string;

  @ApiProperty({ description: '주요상품명', required: false })
  majrGdsNm: string;

  @ApiProperty({ description: '가맹사업개시일자', required: false })
  jngBizStrtDate: string;

  @ApiProperty({ description: '가맹사업기준년도' })
  jngBizCrtraYr: string;

  @ApiProperty({ description: '가맹 사업 현황' })
  statistics: Statistic[];
}
