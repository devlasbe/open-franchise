# Swagger API 문서화 스킬

NestJS 프로젝트에서 Swagger를 사용한 API 문서화 가이드입니다.

## Swagger 접근

- **UI**: `http://localhost:3001/swagger`
- **JSON Schema**: `http://localhost:3001/swagger-json`

## 컨트롤러 레벨 데코레이터

### @Controller + @ApiTags (선택)

```typescript
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('brands')  // Swagger UI에서 그룹핑 (선택)
@Controller('brand')
export class BrandController {}
```

> 현재 프로젝트에서는 `@ApiTags`를 생략하고 컨트롤러 경로로 자동 그룹핑됩니다.

## 메서드 레벨 데코레이터

### 기본 구성

```typescript
import { Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiExtraModels } from '@nestjs/swagger';
import { GetXxxReq, GetXxxRes } from './dto/xxx.dto';

@Get()
@ApiExtraModels(GetXxxReq)  // Request DTO 스키마 등록
@ApiOkResponse({
  description: '응답 설명',
  type: GetXxxRes,
})
findAll(@Query() query: GetXxxReq) {
  return this.xxxService.findAll(query);
}
```

### 인증이 필요한 엔드포인트

```typescript
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/auth/guards/AdminAuthGuard';

@Get('admin')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('access-token')  // 인증 필요 표시
@ApiOkResponse({
  description: '관리자 전용 데이터',
  type: GetXxxRes,
})
findAdmin() {
  return this.xxxService.findAdmin();
}
```

### Body가 있는 엔드포인트

```typescript
import { Post, Body } from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';

@Post()
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('access-token')
@ApiBody({ type: CreateXxxDto })  // Body 스키마 명시
@ApiOkResponse({ description: '생성 완료' })
create(@Body() dto: CreateXxxDto) {
  return this.xxxService.create(dto);
}
```

### Path 파라미터가 있는 엔드포인트

```typescript
import { Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';

@Get(':id')
@ApiParam({ name: 'id', description: '리소스 ID', example: 'brand-123' })
@ApiOkResponse({
  description: '상세 조회',
  type: GetXxxRes,
})
findOne(@Param('id') id: string) {
  return this.xxxService.findOne(id);
}
```

## 실제 컨트롤러 예시

### brand.controller.ts

```typescript
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  AddRejectedBrandDto,
  GetBrandListReq,
  GetBrandListRes,
  GetBrandRes,
  GetRejectedBrandListRes,
} from './dto/brand.dto';
import { AdminAuthGuard } from 'src/auth/guards/AdminAuthGuard';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  @ApiExtraModels(GetBrandListReq)
  @ApiOkResponse({
    description: '브랜드 리스트',
    type: GetBrandListRes,
  })
  findAll(@Query() query: GetBrandListReq) {
    return this.brandService.findByFilter(query);
  }

  @Get('rejection')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiExtraModels(GetBrandListReq)
  @ApiOkResponse({
    description: '차단된 브랜드 리스트',
    type: GetRejectedBrandListRes,
  })
  findRejected(@Query() query: GetBrandListReq) {
    return this.brandService.findAllRejected(query);
  }

  @Post('rejection')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiBody({ type: AddRejectedBrandDto })
  @ApiOkResponse({ description: '브랜드 차단 추가' })
  addRejected(@Body() dto: AddRejectedBrandDto) {
    return this.brandService.addRejected(dto.brandNm);
  }

  @Delete('rejection/:brandNm')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ description: '브랜드 차단 해제' })
  removeRejected(@Param('brandNm') brandNm: string) {
    return this.brandService.removeRejected(brandNm);
  }

  @Get(':name')
  @ApiOkResponse({
    description: '브랜드 검색',
    type: GetBrandRes,
  })
  findByName(@Param('name') name: string) {
    return this.brandService.findOne(name);
  }
}
```

### interiors.controller.ts (간단한 예시)

```typescript
import { Controller, Get, Query } from '@nestjs/common';
import { InteriorsService } from './interiors.service';
import { ApiExtraModels, ApiOkResponse } from '@nestjs/swagger';
import { GetInteriorReq, GetInteriorRes } from './dto/interior.dto';

@Controller('interiors')
export class InteriorsController {
  constructor(private readonly interiorsService: InteriorsService) {}

  @Get()
  @ApiOkResponse({
    description: '인테리어금액 검색',
    type: GetInteriorRes,
  })
  @ApiExtraModels(GetInteriorReq)
  findOne(@Query() query: GetInteriorReq) {
    return this.interiorsService.findOne(query.brandMnno);
  }
}
```

## 데코레이터 순서

권장하는 Swagger 데코레이터 작성 순서:

```typescript
@Get()                           // 1. HTTP 메서드
@UseGuards(AdminAuthGuard)       // 2. 가드 (필요시)
@ApiBearerAuth('access-token')   // 3. 인증 (필요시)
@ApiExtraModels(GetXxxReq)       // 4. 추가 모델 등록
@ApiBody({ type: CreateXxxDto }) // 5. Body 스키마 (필요시)
@ApiOkResponse({...})            // 6. 응답 스키마
findAll(@Query() query: GetXxxReq) {
  // ...
}
```

## DTO에서 Swagger 활용

### @ApiProperty 옵션

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class ExampleDto {
  // 기본 필드
  @ApiProperty({ description: '필드 설명' })
  name: string;

  // 예시 포함
  @ApiProperty({ description: '브랜드명', example: '치킨마루' })
  brandName: string;

  // 선택 필드
  @ApiProperty({ description: '설명', required: false })
  description?: string;

  // 숫자 범위
  @ApiProperty({ description: '가맹비', minimum: 0, example: 10000000 })
  franchiseFee: number;

  // Enum
  @ApiProperty({
    description: '카테고리',
    enum: ['FOOD', 'RETAIL', 'SERVICE'],
    example: 'FOOD',
  })
  category: string;

  // 배열
  @ApiProperty({ description: '태그 목록', type: [String] })
  tags: string[];

  // 중첩 객체
  @ApiProperty({ description: '상세 정보', type: DetailDto })
  detail: DetailDto;
}
```

## TypeUtil을 활용한 응답 타입

Swagger가 제네릭 타입을 인식하지 못하는 문제를 해결하기 위해 `TypeUtil`을 사용합니다.

```typescript
// src/common/utils/type.util.ts
export class TypeUtil {
  // 단일 객체 응답
  static getSuccessResponse<T extends Constructor>(Base: T) { ... }
  
  // 배열 응답
  static getSuccessResponseList<T extends Constructor>(Base: T) { ... }
}

// 사용법
export class GetXxxRes extends TypeUtil.getSuccessResponse(XxxEntity) {}
export class GetXxxListRes extends TypeUtil.getSuccessResponseList(XxxEntity) {}
```

### 응답 구조

```typescript
// SuccessResponse<T>
{
  payload: T,       // 응답 데이터
  request: string,  // 호출된 URI
}

// SuccessResponseList<T>
{
  payload: T[],     // 응답 데이터 배열
  request: string,  // 호출된 URI
  count: number,    // payload 배열의 length
}
```

## 프론트엔드 타입 자동 생성

서버의 Swagger 스키마에서 TypeScript 타입을 자동 생성합니다.

```bash
# 서버 실행 상태에서 (포트 3001)
cd apps/web
pnpm swagger
```

생성 결과: `apps/web/types/apiTypes.ts`

**중요**: Swagger 스키마가 정확해야 프론트엔드 타입도 정확하게 생성됩니다.

## 주요 Swagger 데코레이터 정리

| 데코레이터 | 용도 | 레벨 |
|-----------|------|------|
| `@ApiTags()` | API 그룹핑 | 컨트롤러 |
| `@ApiExtraModels()` | 추가 스키마 등록 | 메서드 |
| `@ApiOkResponse()` | 200 응답 정의 | 메서드 |
| `@ApiBody()` | Body 스키마 | 메서드 |
| `@ApiParam()` | Path 파라미터 | 메서드 |
| `@ApiQuery()` | Query 파라미터 | 메서드 |
| `@ApiBearerAuth()` | JWT 인증 표시 | 메서드 |
| `@ApiProperty()` | DTO 필드 정의 | 속성 |

## 체크리스트

- [ ] 모든 엔드포인트에 `@ApiOkResponse` 적용
- [ ] Request DTO에 `@ApiExtraModels` 적용
- [ ] Body가 있으면 `@ApiBody` 적용
- [ ] 인증 필요 시 `@ApiBearerAuth('access-token')` 적용
- [ ] 모든 DTO 필드에 `@ApiProperty` 적용
- [ ] description 한글로 작성
- [ ] 타입 변경 후 `pnpm swagger` 실행하여 프론트엔드 타입 갱신
