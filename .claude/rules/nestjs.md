# NestJS 코딩 규칙

## 모듈 구조

### 표준 모듈 구성

```
module/
├── module.module.ts      # 모듈 정의
├── module.controller.ts  # HTTP 요청 처리
├── module.service.ts     # 비즈니스 로직
├── dto/
│   ├── create-module.dto.ts
│   └── update-module.dto.ts
├── entities/
│   └── module.entity.ts
└── module.spec.ts        # 테스트
```

### 모듈 정의

```typescript
@Module({
  imports: [OtherModule],         // 의존 모듈
  controllers: [MyController],
  providers: [MyService],
  exports: [MyService],           // 외부 공개 시
})
export class MyModule {}
```

## 컨트롤러

### 기본 패턴

```typescript
@ApiTags('brands')
@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  @ApiOperation({ summary: '목록 조회' })
  async findAll(@Query() query: FindBrandDto) {
    return this.brandService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '단건 조회' })
  @ApiParam({ name: 'id', description: '브랜드 ID' })
  async findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @Post()
  @UseGuards(AdminAuthGuard)
  @ApiOperation({ summary: '생성' })
  async create(@Body() dto: CreateBrandDto) {
    return this.brandService.create(dto);
  }
}
```

### 데코레이터 순서

1. `@ApiTags()` (클래스)
2. `@Controller()` (클래스)
3. `@UseGuards()` (메서드/클래스)
4. `@Get()`, `@Post()` 등 (메서드)
5. `@ApiOperation()`, `@ApiResponse()` (메서드)

## 서비스

### 기본 패턴

```typescript
@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: FindBrandDto) {
    const { category, limit = 10, offset = 0 } = query;

    return this.prisma.brand.findMany({
      where: category ? { category } : undefined,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }

    return brand;
  }
}
```

### 트랜잭션

```typescript
async createWithRelations(dto: CreateDto) {
  return this.prisma.$transaction(async (tx) => {
    const brand = await tx.brand.create({ data: dto.brand });
    await tx.statistic.createMany({
      data: dto.statistics.map(s => ({ ...s, brandId: brand.id })),
    });
    return brand;
  });
}
```

## DTO

### 요청 DTO

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateBrandDto {
  @ApiProperty({ description: '브랜드명', example: '치킨마루' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: '설명' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: '가맹비', minimum: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  fee?: number;
}
```

### 쿼리 DTO

```typescript
export class FindBrandDto {
  @ApiPropertyOptional({ description: '카테고리' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ default: 10, maximum: 100 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number = 0;
}
```

## 예외 처리

### 내장 예외 사용

```typescript
import {
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';

// 404 - 리소스 없음
throw new NotFoundException('Brand not found');

// 400 - 잘못된 요청
throw new BadRequestException('Invalid category');

// 401 - 인증 필요
throw new UnauthorizedException('Please login');

// 403 - 권한 없음
throw new ForbiddenException('Admin only');

// 409 - 충돌
throw new ConflictException('Brand already exists');
```

## 인증/인가

### 가드 적용

```typescript
// 컨트롤러 전체
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {}

// 특정 메서드만
@Controller('brands')
export class BrandController {
  @Get()
  findAll() {}  // 공개

  @Post()
  @UseGuards(AdminAuthGuard)
  create() {}  // 관리자만
}
```

### 현재 사용자 접근

```typescript
@Get('profile')
@UseGuards(JwtAuthGuard)
getProfile(@Request() req) {
  return req.user;  // { id, email, role }
}
```

## Swagger 문서화

### 필수 데코레이터

```typescript
@ApiTags('brands')  // 그룹핑
@ApiOperation({ summary: '브랜드 목록 조회' })  // 설명
@ApiResponse({ status: 200, type: [BrandDto] })  // 응답
@ApiResponse({ status: 404, description: 'Not found' })  // 에러
```

### DTO 문서화

```typescript
export class BrandDto {
  @ApiProperty({ description: 'ID', example: 'brand-123' })
  id: string;

  @ApiProperty({ description: '브랜드명', example: '치킨마루' })
  name: string;

  @ApiPropertyOptional({ description: '설명', nullable: true })
  description?: string;
}
```

## Prisma 사용

### 서비스에서 사용

```typescript
@Injectable()
export class MyService {
  constructor(private readonly prisma: PrismaService) {}

  // 조회
  findAll() {
    return this.prisma.brand.findMany();
  }

  // 조건 조회
  findByCategory(category: string) {
    return this.prisma.brand.findMany({
      where: { category },
      include: { statistics: true },
    });
  }

  // 생성
  create(data: CreateDto) {
    return this.prisma.brand.create({ data });
  }

  // 수정
  update(id: string, data: UpdateDto) {
    return this.prisma.brand.update({
      where: { id },
      data,
    });
  }

  // 삭제
  delete(id: string) {
    return this.prisma.brand.delete({ where: { id } });
  }
}
```

## 테스트

### 단위 테스트

```typescript
describe('BrandService', () => {
  let service: BrandService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BrandService,
        {
          provide: PrismaService,
          useValue: {
            brand: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get(BrandService);
    prisma = module.get(PrismaService);
  });

  it('should find all brands', async () => {
    const mockBrands = [{ id: '1', name: 'Brand' }];
    jest.spyOn(prisma.brand, 'findMany').mockResolvedValue(mockBrands);

    const result = await service.findAll({});
    expect(result).toEqual(mockBrands);
  });
});
```

## 금지 사항

- 컨트롤러에서 직접 Prisma 호출 금지 (서비스 사용)
- `any` 타입 남발 금지
- 하드코딩된 설정값 금지 (ConfigService 사용)
- 동기 코드에서 비동기 호출 금지
- 예외를 삼키지 말 것 (로깅 후 재던지기)
