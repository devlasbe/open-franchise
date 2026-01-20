import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Statistic } from 'src/statistics/entities/statistic.entity';

export class Brand {
  @ApiProperty({ description: '브랜드관리번호' })
  @IsString()
  brandMnno: string;

  @ApiProperty({ description: '가맹본부관리번호' })
  @IsString()
  jnghdqrtrsMnno: string;

  @ApiProperty({ description: '사업자등록번호' })
  @IsString()
  brno: string;

  @ApiProperty({ description: '법인등록번호' })
  @IsString()
  @IsOptional()
  crno: string;

  @ApiProperty({ description: '가맹본부대표자명' })
  @IsString()
  jnghdqrtrsRprsvNm: string;

  @ApiProperty({ description: '브랜드명' })
  @IsString()
  brandNm: string;

  @ApiProperty({ description: '업종대분류명' })
  @IsString()
  indutyLclasNm: string;

  @ApiProperty({ description: '업종중분류명' })
  @IsString()
  indutyMlsfcNm: string;

  @ApiProperty({ description: '주요상품명' })
  @IsString()
  @IsOptional()
  majrGdsNm: string;

  @ApiProperty({ description: '가맹사업개시일자' })
  @IsString()
  @IsOptional()
  jngBizStrtDate: string;

  @ApiProperty({ description: '가맹사업기준년도' })
  @IsString()
  jngBizCrtraYr: string;

  @ApiProperty({ description: '가맹 사업 현황' })
  statistics: Statistic[];
}
