# 백엔드 DTO 작성 스킬

NestJS 프로젝트에서 DTO(Data Transfer Object)를 작성하는 가이드입니다.

## 필수 규칙

1. **모든 API 엔드포인트는 반드시 DTO를 사용해야 합니다**
2. **`any` 타입 사용 절대 금지**
3. **Swagger 데코레이터 필수 적용**
4. **class-validator를 통한 유효성 검사 필수**

## DTO 종류

| DTO 타입 | 용도 | 접미사 |
|----------|------|--------|
| Request DTO | 클라이언트 요청 데이터 | `CreateXxxDto`, `UpdateXxxDto`, `FindXxxDto` |
| Response DTO | API 응답 데이터 | `XxxResponseDto` |
| Query DTO | GET 요청 쿼리 파라미터 | `XxxQueryDto`, `FindXxxDto` |

## 요청 DTO 템플릿

### Create DTO

```typescript
// dto/create-[entity].dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsEmail,
  IsBoolean,
  IsArray,
  IsDate,
  Min,
  Max,
  MinLength,
  MaxLength,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class Create[Entity]Dto {
  @ApiProperty({
    description: '필드 설명',
    example: '예시 값',
  })
  @IsString({ message: '문자열이어야 합니다' })
  @IsNotEmpty({ message: '필수 입력 항목입니다' })
  @MinLength(2, { message: '최소 2자 이상이어야 합니다' })
  @MaxLength(100, { message: '최대 100자까지 입력 가능합니다' })
  name: string;

  @ApiPropertyOptional({
    description: '선택적 필드',
    example: '선택 값',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '숫자 필드',
    example: 1000,
    minimum: 0,
  })
  @IsNumber({}, { message: '숫자여야 합니다' })
  @Min(0, { message: '0 이상이어야 합니다' })
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    description: '이메일',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '올바른 이메일 형식이어야 합니다' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: '카테고리',
    enum: ['FOOD', 'RETAIL', 'SERVICE'],
    example: 'FOOD',
  })
  @IsEnum(['FOOD', 'RETAIL', 'SERVICE'], { message: '유효한 카테고리가 아닙니다' })
  category: 'FOOD' | 'RETAIL' | 'SERVICE';
}
```

### Update DTO (PartialType 활용)

```typescript
// dto/update-[entity].dto.ts
import { PartialType } from '@nestjs/swagger';
import { Create[Entity]Dto } from './create-[entity].dto';

export class Update[Entity]Dto extends PartialType(Create[Entity]Dto) {}
```

### Query DTO (페이지네이션)

```typescript
// dto/find-[entity].dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class Find[Entity]Dto {
  @ApiPropertyOptional({
    description: '검색 키워드',
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  keyword?: string;

  @ApiPropertyOptional({
    description: '카테고리 필터',
    enum: ['FOOD', 'RETAIL', 'SERVICE'],
  })
  @IsEnum(['FOOD', 'RETAIL', 'SERVICE'])
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: '페이지 번호',
    default: 1,
    minimum: 1,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: '페이지당 항목 수',
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: '정렬 필드',
    default: 'createdAt',
  })
  @IsString()
  @IsOptional()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: '정렬 방향',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsEnum(['asc', 'desc'])
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
```

## 응답 DTO 템플릿

```typescript
// dto/[entity]-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class [Entity]ResponseDto {
  @ApiProperty({
    description: '고유 ID',
    example: 'uuid-1234-5678',
  })
  id: string;

  @ApiProperty({
    description: '이름',
    example: '브랜드명',
  })
  name: string;

  @ApiPropertyOptional({
    description: '설명',
    example: '브랜드 설명',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: '생성일시',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정일시',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

// 목록 응답 (페이지네이션 포함)
export class [Entity]ListResponseDto {
  @ApiProperty({
    description: '데이터 목록',
    type: [[Entity]ResponseDto],
  })
  items: [Entity]ResponseDto[];

  @ApiProperty({
    description: '전체 항목 수',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: '현재 페이지',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: '페이지당 항목 수',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: '전체 페이지 수',
    example: 10,
  })
  totalPages: number;
}
```

## 중첩 DTO

```typescript
// dto/create-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested, IsArray, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @ApiProperty({ description: '상품 ID' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: '수량', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: '주문 항목 목록',
    type: [OrderItemDto],
  })
  @IsArray()
  @ArrayMinSize(1, { message: '최소 1개 이상의 항목이 필요합니다' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
```

## 컨트롤러에서 사용

```typescript
@Controller('brands')
@ApiTags('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @ApiOperation({ summary: '브랜드 생성' })
  @ApiResponse({ status: 201, type: BrandResponseDto })
  @ApiResponse({ status: 400, description: '유효성 검사 실패' })
  async create(@Body() dto: CreateBrandDto): Promise<BrandResponseDto> {
    return this.brandService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '브랜드 목록 조회' })
  @ApiResponse({ status: 200, type: BrandListResponseDto })
  async findAll(@Query() query: FindBrandDto): Promise<BrandListResponseDto> {
    return this.brandService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '브랜드 상세 조회' })
  @ApiParam({ name: 'id', description: '브랜드 ID' })
  @ApiResponse({ status: 200, type: BrandResponseDto })
  @ApiResponse({ status: 404, description: '브랜드를 찾을 수 없음' })
  async findOne(@Param('id') id: string): Promise<BrandResponseDto> {
    return this.brandService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '브랜드 수정' })
  @ApiResponse({ status: 200, type: BrandResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBrandDto,
  ): Promise<BrandResponseDto> {
    return this.brandService.update(id, dto);
  }
}
```

## 체크리스트

- [ ] 모든 필드에 `@ApiProperty` 또는 `@ApiPropertyOptional` 적용
- [ ] 필수 필드에 `@IsNotEmpty` 적용
- [ ] 타입별 적절한 validator 적용 (`@IsString`, `@IsNumber`, `@IsEmail` 등)
- [ ] 숫자 필드에 `@Type(() => Number)` 적용 (Query DTO)
- [ ] description과 example 작성
- [ ] 에러 메시지 한글로 작성
- [ ] **`any` 타입 절대 사용 금지**
