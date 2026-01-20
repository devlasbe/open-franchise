import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateFranchiseDto {
  //브랜드명
  @IsString()
  brandNm: string;

  // 법인명
  @IsString()
  corpNm: string;

  // 업종대분류명
  @IsString()
  indutyLclasNm: string;

  // 업종중분류명
  @IsString()
  indutyMlsfcNm: string;
}

export class CreateStatisticsDto {
  //브랜드명
  @IsString()
  brandNm: string;

  //기준년도
  @IsString()
  yr: string;

  // 가맹점수
  @IsNumber()
  @Type(() => Number)
  frcsCnt: number;

  // 신규가맹점등록수
  @IsNumber()
  @Type(() => Number)
  newFrcsRgsCnt: number;

  //계약종료수
  @IsNumber()
  @Type(() => Number)
  ctrtEndCnt: number;

  // 계약해지수
  @IsNumber()
  @Type(() => Number)
  ctrtCncltnCnt: number;

  // 명의변경수
  @IsNumber()
  @Type(() => Number)
  nmChgCnt: number;

  // 평균매출금액
  @IsNumber()
  @Type(() => Number)
  avrgSlsAmt: number;

  // 면적단위평균매출금액
  @IsNumber()
  @Type(() => Number)
  arUnitAvrgSlsAmt: number;
}
