# Entity 작성 스킬

NestJS 프로젝트에서 Entity 클래스를 작성하는 가이드입니다.

## Entity란?

Entity는 도메인 객체의 데이터 구조를 정의하는 클래스입니다. 이 프로젝트에서는 Prisma 스키마와 별개로 **API 응답용 타입 정의** 및 **Swagger 문서화**를 위해 사용합니다.

## 파일 구조

```
module/
└── entities/
    └── [module].entity.ts    # Entity 정의
```

## 필수 데코레이터

모든 Entity 필드에는 다음 데코레이터가 필요합니다:

1. **`@ApiProperty`** - Swagger 문서화
2. **`@IsString()`, `@IsNumber()` 등** - 타입 검증

## Entity 템플릿

### 기본 Entity

```typescript
// entities/[module].entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ModuleName {
  @ApiProperty({ description: '고유 식별자' })
  @IsString()
  id: string;

  @ApiProperty({ description: '이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '숫자 필드', required: false })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ description: '선택 문자열', required: false })
  @IsOptional()
  @IsString()
  optionalField?: string;
}
```

### 공공 API 응답 기반 Entity

공정거래위원회 API 응답의 필드명을 그대로 사용합니다.

```typescript
// entities/interior.entity.ts
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
```

### 관계가 있는 Entity

```typescript
// entities/brand.entity.ts
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
```

## 필드 타입별 작성 패턴

### 필수 문자열 필드

```typescript
@ApiProperty({ description: '브랜드명' })
@IsString()
brandNm: string;
```

### 선택 문자열 필드

```typescript
@ApiProperty({ description: '설명', required: false })
@IsOptional()
@IsString()
description?: string;
```

### 필수 숫자 필드

```typescript
@ApiProperty({ description: '가맹비', example: 10000000 })
@IsNumber()
franchiseFee: number;
```

### 선택 숫자 필드

```typescript
@ApiProperty({ description: '점포기준면적', required: false })
@IsOptional()
@IsNumber()
storCrtraAr?: number;
```

### 배열 필드

```typescript
@ApiProperty({ description: '가맹 사업 현황', type: [Statistic] })
statistics: Statistic[];
```

### 중첩 객체 필드

```typescript
@ApiProperty({ description: '본사 정보', type: Head })
head: Head;
```

## 데코레이터 순서

권장하는 데코레이터 작성 순서:

```typescript
@ApiProperty({...})   // 1. Swagger 문서화
@IsOptional()         // 2. 선택 여부 (필요시)
@IsString()           // 3. 타입 검증
fieldName: string;
```

## Prisma 스키마와의 관계

Entity는 Prisma 스키마와 1:1 매핑될 필요가 없습니다. API 응답에 맞게 자유롭게 구성할 수 있습니다.

```typescript
// Prisma 스키마
model Brand {
  id        String   @id @default(uuid())
  brandMnno String   @unique
  brandNm   String
  // ... DB 필드
}

// Entity (API 응답용)
export class Brand {
  @ApiProperty({ description: '브랜드관리번호' })
  @IsString()
  brandMnno: string;  // id 대신 brandMnno 사용

  @ApiProperty({ description: '브랜드명' })
  @IsString()
  brandNm: string;

  // statistics는 DB에 없지만 API 응답에 포함
  @ApiProperty({ description: '가맹 사업 현황' })
  statistics: Statistic[];
}
```

## DTO에서 Entity 활용

Entity는 Response DTO 생성 시 `TypeUtil`과 함께 사용됩니다.

```typescript
// dto/[module].dto.ts
import { TypeUtil } from 'src/common/utils/type.util';
import { Interior } from '../entities/interior.entity';

// Entity를 감싸서 응답 DTO 생성
export class GetInteriorRes extends TypeUtil.getSuccessResponse(Interior) {}
export class GetInteriorListRes extends TypeUtil.getSuccessResponseList(Interior) {}
```

## 체크리스트

- [ ] 모든 필드에 `@ApiProperty` 적용
- [ ] 모든 필드에 타입 검증 데코레이터 적용 (`@IsString`, `@IsNumber` 등)
- [ ] 선택 필드에 `@IsOptional` + `?` 적용
- [ ] `required: false` 옵션 추가 (선택 필드)
- [ ] description 한글로 작성
- [ ] 공공 API 필드명 그대로 유지 (camelCase 변환 X)
