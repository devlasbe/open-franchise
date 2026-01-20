import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class Head {
  @ApiProperty({ description: '홈페이지주소', required: false })
  @IsString()
  @IsOptional()
  hmpgUrladr?: string;

  @ApiProperty({ description: '지역명' })
  @IsString()
  areaNm: string;

  @ApiProperty({ description: '가맹사업기준년도' })
  @IsString()
  jngBizCrtraYr: string;

  @ApiProperty({ description: '가맹본부관리번호' })
  @IsString()
  jnghdqrtrsMnno: string;

  @ApiProperty({ description: '가맹본부 상호명' })
  @IsString()
  jnghdqrtrsConmNm: string;

  @ApiProperty({ description: '사업자등록번호' })
  @IsString()
  brno: string;

  @ApiProperty({ description: '법인등록번호', required: false })
  @IsString()
  crno?: string;

  @ApiProperty({ description: '개인법인구분코드 (10: 개인, 11: 법인)' })
  @IsString()
  indvdlCorpSeCd: string;

  @ApiProperty({ description: '사업자등록일자' })
  @IsString()
  bzmnRgsDate: string;

  @ApiProperty({ description: '법인등기일자' })
  @IsString()
  corpRgDate: string;

  @ApiProperty({ description: '가맹본부대표전화번호', required: false })
  @IsString()
  jnghdqrtrsRprsTelno?: string;

  @ApiProperty({ description: '가맹본부대표팩스번호', required: false })
  @IsString()
  jnghdqrtrsRprsFxno?: string;

  @ApiProperty({ description: '가맹본부대표자명' })
  @IsString()
  jnghdqrtrsRprsvNm: string;

  @ApiProperty({ description: '가맹본부구우편번호', required: false })
  @IsString()
  jnghdqrtrsOzip?: string;

  @ApiProperty({ description: '소재지주소', required: false })
  @IsString()
  lctnAddr?: string;

  @ApiProperty({ description: '소재지상세주소', required: false })
  @IsString()
  lctnDaddr?: string;

  @ApiProperty({ description: '브랜드수' })
  @IsNumber()
  brandCnt: number;

  @ApiProperty({ description: '계열회사수' })
  @IsNumber()
  affltsCnt: number;

  @ApiProperty({ description: '가맹기관명' })
  @IsString()
  jngInstNm: string;

  @ApiProperty({ description: '기업규모명' })
  @IsString()
  entScaleNm: string;
}
