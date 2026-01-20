import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class Interior {
  @ApiProperty({ description: '브랜드명' })
  @IsString()
  brandNm: string;

  @ApiProperty({ description: '화폐단위코드명' })
  @IsString()
  crrncyUnitCdNm: string;

  @ApiProperty({ description: '가맹사업기준년도', required: false })
  @IsOptional()
  @IsString()
  jngBizCrtraYr?: string;

  @ApiProperty({ description: '브랜드관리번호' })
  @IsString()
  brandMnno: string;

  @ApiProperty({ description: '가맹본부관리번호', required: false })
  @IsOptional()
  @IsString()
  jnghdqrtrsMnno?: string;

  @ApiProperty({ description: '업종대분류명' })
  @IsString()
  indutyLclasNm: string;

  @ApiProperty({ description: '업종중분류명' })
  @IsString()
  indutyMlsfcNm: string;

  @ApiProperty({
    description: '단위면적인테리어금액범위값 (편차 5%)',
    required: false,
  })
  @IsOptional()
  @IsString()
  unitArIntrrAmtScopeVal?: string;

  @ApiProperty({ description: '점포기준면적', required: false })
  @IsOptional()
  @IsNumber()
  storCrtraAr?: number;

  @ApiProperty({ description: '인테리어금액범위값 (편차 5%)', required: false })
  @IsOptional()
  @IsString()
  intrrAmtScopeVal?: string;
}
