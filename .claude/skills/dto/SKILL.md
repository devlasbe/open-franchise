# DTO 작성 스킬

NestJS 프로젝트에서 DTO(Data Transfer Object)를 작성하는 가이드입니다.

## 필수 규칙

1. **모든 API 엔드포인트는 반드시 DTO를 사용**
2. **Swagger 데코레이터 필수 적용** (`@ApiProperty`)
3. **class-validator를 통한 유효성 검사 필수**
4. **반환 타입 명시**

## DTO 네이밍 컨벤션

| DTO 타입 | 용도 | 접미사 | 예시 |
|----------|------|--------|------|
| Request DTO | 요청 데이터 | `GetXxxReq`, `CreateXxxReq` | `GetBrandListReq` |
| Response DTO | 응답 데이터 | `GetXxxRes`, `XxxRes` | `GetBrandRes` |
| Query DTO | GET 쿼리 파라미터 | `GetXxxReq` | `GetInteriorReq` |

## 파일 구조

```
module/
└── dto/
    └── [module].dto.ts    # 모든 DTO를 한 파일에 작성
```

## Request DTO 템플릿

### 기본 요청 DTO

```typescript
// dto/[module].dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GetXxxReq {
  @ApiProperty({ description: '필드 설명', example: '예시값' })
  @IsString()
  fieldName: string;

  @ApiProperty({ description: '선택 필드', required: false })
  @IsString()
  @IsOptional()
  optionalField?: string;

  @ApiProperty({ description: '숫자 필드', example: 100 })
  @IsNumber()
  @Type(() => Number)  // Query DTO에서 필수
  numericField: number;
}
```

### 페이지네이션 요청 DTO (PagenationRequest 상속)

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PagenationRequest } from 'src/common/dto/pagenation.dto';

export class GetBrandListReq extends PagenationRequest {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: '브랜드 명', required: false, example: '놀부' })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '카테고리', required: false })
  category?: string;
}
```

### PagenationRequest 구조

```typescript
// src/common/dto/pagenation.dto.ts
export class PagenationRequest {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ description: '페이지 번호', example: 1 })
  pageNo: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ description: '가져올 데이터 수', example: 10 })
  pageSize: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '정렬할 컬럼명', required: false })
  orderCol?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '정렬 방법', example: 'asc | desc', required: false })
  orderSort?: 'asc' | 'desc';
}
```

## Response DTO 템플릿

### TypeUtil을 활용한 응답 DTO

프로젝트에서는 `TypeUtil`을 사용해 일관된 응답 형식을 제공합니다.

```typescript
import { TypeUtil } from 'src/common/utils/type.util';
import { XxxEntity } from '../entities/xxx.entity';

// 단일 객체 응답
export class GetXxxRes extends TypeUtil.getSuccessResponse(XxxEntity) {}

// 배열 응답
export class GetXxxListRes extends TypeUtil.getSuccessResponseList(XxxEntity) {}
```

### 커스텀 응답 DTO (중첩 데이터)

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { TypeUtil } from 'src/common/utils/type.util';
import { Brand } from '../entities/brand.entity';
import { Head } from 'src/heads/entities/head.entity';

class BrandDetailRes {
  @ApiProperty({ description: '브랜드 데이터' })
  brand: Brand;

  @ApiProperty({ description: '본사 데이터' })
  head: Head;

  @ApiProperty({ description: '브랜드 차단 여부' })
  isRejectedBrand: boolean;
}

export class GetBrandRes extends TypeUtil.getSuccessResponse(BrandDetailRes) {}
```

## 실제 예시

### interior.dto.ts

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { TypeUtil } from 'src/common/utils/type.util';
import { Interior } from '../entities/interior.entity';

export class GetInteriorReq {
  @ApiProperty({ description: '브랜드관리번호' })
  @IsString()
  brandMnno: string;
}

export class GetInteriorRes extends TypeUtil.getSuccessResponse(Interior) {}
```

### brand.dto.ts

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PagenationRequest } from 'src/common/dto/pagenation.dto';
import { TypeUtil } from 'src/common/utils/type.util';
import { Brand } from '../entities/brand.entity';
import { Head } from 'src/heads/entities/head.entity';

// Request DTO
export class GetBrandListReq extends PagenationRequest {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: '브랜드 명', required: false, example: '놀부' })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '카테고리', required: false })
  category?: string;
}

// 커스텀 응답 타입
class BrandRes {
  @ApiProperty({ description: '브랜드 데이터' })
  brand: Brand;
  @ApiProperty({ description: '본사 데이터' })
  head: Head;
  @ApiProperty({ description: '브랜드 차단 여부' })
  isRejectedBrand: boolean;
}

// Response DTO
export class GetBrandRes extends TypeUtil.getSuccessResponse(BrandRes) {}
export class GetBrandListRes extends TypeUtil.getSuccessResponseList(Brand) {}

// Body DTO
export class AddRejectedBrandDto {
  @IsString()
  @ApiProperty({ description: '브랜드 명', example: '나쁜브랜드' })
  brandNm: string;
}
```

## 데코레이터 순서

권장하는 데코레이터 작성 순서:

```typescript
@IsString()           // 1. 타입 검증
@IsOptional()         // 2. 필수/선택 여부
@Type(() => Number)   // 3. 타입 변환 (Query DTO)
@ApiProperty({...})   // 4. Swagger 문서화
fieldName: string;
```

## class-validator 데코레이터 가이드

| 데코레이터 | 용도 |
|-----------|------|
| `@IsString()` | 문자열 검증 |
| `@IsNumber()` | 숫자 검증 |
| `@IsOptional()` | 선택 필드 (nullable) |
| `@IsNotEmpty()` | 빈 값 불가 |
| `@IsEmail()` | 이메일 형식 |
| `@IsEnum(Enum)` | 열거형 값 검증 |
| `@Min(n)`, `@Max(n)` | 숫자 범위 |
| `@MinLength(n)`, `@MaxLength(n)` | 문자열 길이 |
| `@Type(() => Number)` | Query 파라미터 숫자 변환 |

## 체크리스트

- [ ] 모든 필드에 `@ApiProperty` 적용
- [ ] 타입별 적절한 validator 적용
- [ ] 선택 필드에 `@IsOptional` + `?` 적용
- [ ] 숫자 Query 파라미터에 `@Type(() => Number)` 적용
- [ ] description 한글로 작성
- [ ] Response DTO는 `TypeUtil` 활용
