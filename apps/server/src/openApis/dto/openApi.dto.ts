import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { Interior } from 'src/interiors/entities/interior.entity';

export class OpenApiRequestDto {
  // 페이지 번호
  @IsNumber()
  pageNo: number;

  // 한 페이지 결과 수
  @IsNumber()
  numOfRows: number;

  // 년도
  @IsNumber()
  yr: number;
}

export class OpenApiResponseDto<T> {
  resultCode: string;
  resultMsg: string;
  @Type(() => Number)
  @IsNumber()
  numOfRows: string;
  @Type(() => Number)
  @IsNumber()
  pageNo: string;
  @Type(() => Number)
  @IsNumber()
  totalCount: number;
  items: T[];
}

interface StatisticItem {
  // 브랜드명
  brandNm: string;
  // 법인명
  corpNm: string;
  // 업종대분류명
  indutyLclasNm: string;
  // 업종중분류명
  indutyMlsfcNm: string;

  //기준년도
  yr: string;
  // 가맹점수
  frcsCnt: number;
  // 신규가맹점등록수
  newFrcsRgsCnt: number;
  // 계약종료수
  ctrtEndCnt: number;
  // 계약해지수
  ctrtCncltnCnt: number;
  // 명의변경수
  nmChgCnt: number;
  // 평균매출금액
  avrgSlsAmt: number;
  // 면적단위평균매출금액
  arUnitAvrgSlsAmt: number;
}

export class StatisticResponseDto extends OpenApiResponseDto<StatisticItem> {}

interface StartupItem {
  // 브랜드명
  brandNm: string;
  // 법인명
  corpNm: string;
  // 업종대분류명
  // 기준년도
  yr: string;
  indutyLclasNm: string;
  // 업종중분류명
  indutyMlsfcNm: string;
  // 가맹금액
  jngBzmnJngAmt: number;
  // 교육금액
  jngBzmnEduAmt: number;
  // 기타금액
  jngBzmnEtcAmt: number;
  // 보증금액
  jngBzmnAssrncAmt: number;
  // 합계금액
  smtnAmt: number;
}

export class StartupResponseDto extends OpenApiResponseDto<StartupItem> {}

export class InteriorResponseDto extends OpenApiResponseDto<Interior> {}
