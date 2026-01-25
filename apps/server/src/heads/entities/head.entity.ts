import { ApiProperty } from '@nestjs/swagger';

export class Head {
  @ApiProperty({ description: '홈페이지주소', required: false })
  hmpgUrladr?: string;

  @ApiProperty({ description: '지역명' })
  areaNm: string;

  @ApiProperty({ description: '가맹사업기준년도' })
  jngBizCrtraYr: string;

  @ApiProperty({ description: '가맹본부관리번호' })
  jnghdqrtrsMnno: string;

  @ApiProperty({ description: '가맹본부 상호명' })
  jnghdqrtrsConmNm: string;

  @ApiProperty({ description: '사업자등록번호' })
  brno: string;

  @ApiProperty({ description: '법인등록번호', required: false })
  crno?: string;

  @ApiProperty({ description: '개인법인구분코드 (10: 개인, 11: 법인)' })
  indvdlCorpSeCd: string;

  @ApiProperty({ description: '사업자등록일자' })
  bzmnRgsDate: string;

  @ApiProperty({ description: '법인등기일자' })
  corpRgDate: string;

  @ApiProperty({ description: '가맹본부대표전화번호', required: false })
  jnghdqrtrsRprsTelno?: string;

  @ApiProperty({ description: '가맹본부대표팩스번호', required: false })
  jnghdqrtrsRprsFxno?: string;

  @ApiProperty({ description: '가맹본부대표자명' })
  jnghdqrtrsRprsvNm: string;

  @ApiProperty({ description: '가맹본부구우편번호', required: false })
  jnghdqrtrsOzip?: string;

  @ApiProperty({ description: '소재지주소', required: false })
  lctnAddr?: string;

  @ApiProperty({ description: '소재지상세주소', required: false })
  lctnDaddr?: string;

  @ApiProperty({ description: '브랜드수' })
  brandCnt: number;

  @ApiProperty({ description: '계열회사수' })
  affltsCnt: number;

  @ApiProperty({ description: '가맹기관명' })
  jngInstNm: string;

  @ApiProperty({ description: '기업규모명' })
  entScaleNm: string;
}
