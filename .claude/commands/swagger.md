---
description: Swagger API 문서화 가이드
---

# Swagger API 문서화 스킬

NestJS 프로젝트에서 Swagger를 사용한 API 문서화 가이드입니다.

## Swagger 접근

- **UI**: `http://localhost:3001/swagger`
- **JSON Schema**: `http://localhost:3001/swagger-json`

## 필수 데코레이터

### 컨트롤러 레벨

```typescript
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('brands')  // Swagger UI에서 그룹핑
@Controller('brands')
export class BrandController {}
```

### 메서드 레벨

```typescript
import { Get, Post, Param, Query, Body } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller('brands')
@ApiTags('brands')
export class BrandController {
  @Get()
  @ApiOperation({
    summary: '브랜드 목록 조회',
    description: '필터 조건에 따라 브랜드 목록을 조회합니다.',
  })
  @ApiQuery({ name: 'category', required: false, description: '카테고리 필터' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: '조회 개수' })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: BrandListResponseDto,
  })
  async findAll(@Query() query: FindBrandDto): Promise<BrandListResponseDto> {
    return this.brandService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '브랜드 상세 조회' })
  @ApiParam({
    name: 'id',
    description: '브랜드 ID',
    example: 'brand-123',
  })
  @ApiResponse({ status: 200, description: '성공', type: BrandResponseDto })
  @ApiResponse({ status: 404, description: '브랜드를 찾을 수 없음' })
  async findOne(@Param('id') id: string): Promise<BrandResponseDto> {
    return this.brandService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()  // JWT 인증 필요 표시
  @ApiOperation({ summary: '브랜드 생성' })
  @ApiBody({ type: CreateBrandDto })
  @ApiResponse({ status: 201, description: '생성 완료', type: BrandResponseDto })
  @ApiResponse({ status: 400, description: '유효성 검사 실패' })
  @ApiResponse({ status: 401, description: '인증 필요' })
  async create(@Body() dto: CreateBrandDto): Promise<BrandResponseDto> {
    return this.brandService.create(dto);
  }
}
```

## DTO Swagger 데코레이터

### 기본 필드

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BrandResponseDto {
  @ApiProperty({
    description: '브랜드 고유 ID',
    example: 'brand-12345',
  })
  id: string;

  @ApiProperty({
    description: '브랜드명',
    example: '치킨마루',
    minLength: 2,
    maxLength: 100,
  })
  name: string;

  @ApiPropertyOptional({
    description: '브랜드 설명',
    example: '맛있는 치킨 프랜차이즈',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: '가맹비',
    example: 10000000,
    minimum: 0,
  })
  franchiseFee: number;

  @ApiProperty({
    description: '카테고리',
    enum: ['FOOD', 'RETAIL', 'SERVICE'],
    example: 'FOOD',
  })
  category: string;

  @ApiProperty({
    description: '활성화 여부',
    example: true,
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: '생성일시',
    example: '2024-01-01T00:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;
}
```

### 배열 필드

```typescript
export class BrandListResponseDto {
  @ApiProperty({
    description: '브랜드 목록',
    type: [BrandResponseDto],
    isArray: true,
  })
  items: BrandResponseDto[];

  @ApiProperty({
    description: '전체 개수',
    example: 100,
  })
  total: number;
}
```

### 중첩 객체

```typescript
class AddressDto {
  @ApiProperty({ description: '시/도', example: '서울특별시' })
  city: string;

  @ApiProperty({ description: '상세 주소', example: '강남구 테헤란로 123' })
  street: string;
}

export class BrandDetailResponseDto {
  @ApiProperty({ description: '브랜드명' })
  name: string;

  @ApiProperty({
    description: '본사 주소',
    type: AddressDto,
  })
  headquarters: AddressDto;

  @ApiProperty({
    description: '지점 목록',
    type: [AddressDto],
  })
  branches: AddressDto[];
}
```

### Enum 타입

```typescript
export enum BrandCategory {
  FOOD = 'FOOD',
  RETAIL = 'RETAIL',
  SERVICE = 'SERVICE',
}

export class CreateBrandDto {
  @ApiProperty({
    description: '카테고리',
    enum: BrandCategory,
    enumName: 'BrandCategory',
    example: BrandCategory.FOOD,
  })
  @IsEnum(BrandCategory)
  category: BrandCategory;
}
```

## 고급 패턴

### 제네릭 응답 DTO

```typescript
// common/dto/paginated-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  items: T[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}

// 사용 시 - ApiExtraModels 필요
import { ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

@ApiExtraModels(PaginatedResponseDto, BrandResponseDto)
@Controller('brands')
export class BrandController {
  @Get()
  @ApiResponse({
    status: 200,
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResponseDto) },
        {
          properties: {
            items: {
              type: 'array',
              items: { $ref: getSchemaPath(BrandResponseDto) },
            },
          },
        },
      ],
    },
  })
  async findAll(@Query() query: FindBrandDto) {
    // ...
  }
}
```

### 다중 응답 타입

```typescript
@Get(':id')
@ApiResponse({
  status: 200,
  description: '성공',
  type: BrandResponseDto,
})
@ApiResponse({
  status: 400,
  description: '잘못된 요청',
  schema: {
    type: 'object',
    properties: {
      statusCode: { type: 'number', example: 400 },
      message: { type: 'string', example: 'Invalid brand ID' },
      error: { type: 'string', example: 'Bad Request' },
    },
  },
})
@ApiResponse({
  status: 404,
  description: '브랜드를 찾을 수 없음',
})
async findOne(@Param('id') id: string) {
  // ...
}
```

### 파일 업로드

```typescript
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Post('upload')
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
        description: '업로드할 이미지 파일',
      },
      name: {
        type: 'string',
        description: '파일 이름',
      },
    },
  },
})
@UseInterceptors(FileInterceptor('file'))
async uploadFile(@UploadedFile() file: Express.Multer.File) {
  // ...
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

### 생성 명령어 설정 (web/package.json)

```json
{
  "scripts": {
    "swagger": "npx swagger-typescript-api generate -p http://localhost:3001/swagger-json -o ./types -n apiTypes.ts --no-client"
  }
}
```

### 옵션 설명

| 옵션 | 설명 |
|------|------|
| `-p` | Swagger JSON 경로 |
| `-o` | 출력 디렉토리 |
| `-n` | 출력 파일명 |
| `--no-client` | API 클라이언트 생성 제외 (타입만 생성) |

## 체크리스트

- [ ] 모든 컨트롤러에 `@ApiTags` 적용
- [ ] 모든 엔드포인트에 `@ApiOperation` 적용
- [ ] 모든 엔드포인트에 `@ApiResponse` (성공/에러) 적용
- [ ] 인증 필요 엔드포인트에 `@ApiBearerAuth` 적용
- [ ] 모든 DTO 필드에 `@ApiProperty` 적용
- [ ] example 값 작성 (실제 데이터와 유사하게)
- [ ] description 한글로 작성
- [ ] 타입 변경 후 `pnpm swagger` 실행하여 프론트엔드 타입 갱신
