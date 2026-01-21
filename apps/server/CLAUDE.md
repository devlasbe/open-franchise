# Open Franchise Server (NestJS)

NestJS 기반 백엔드 API 서버입니다.

## ⚠️ 필수 준수 사항

> **이 규칙들은 반드시 지켜야 합니다. 예외 없음.**

### 1. `any` 타입 절대 금지

```typescript
// ❌ 금지
function process(data: any) { ... }
const result: any = await fetchData();

// ✅ 올바른 방법
function process(data: BrandResponseDto) { ... }
const result: BrandResponseDto = await fetchData();

// 타입을 모를 경우 unknown 사용 후 타입 가드
function process(data: unknown) {
  if (isBrandData(data)) {
    // data는 이제 Brand 타입
  }
}
```

### 2. 모든 API 엔드포인트에 DTO 필수

```typescript
// ❌ 금지 - 인라인 타입이나 any 사용
@Post()
async create(@Body() data: { name: string }) { ... }

@Get()
async findAll(@Query('limit') limit: number) { ... }

// ✅ 올바른 방법 - DTO 클래스 사용
@Post()
async create(@Body() dto: CreateBrandDto): Promise<BrandResponseDto> { ... }

@Get()
async findAll(@Query() query: FindBrandDto): Promise<BrandListResponseDto> { ... }
```

### 3. DTO 필수 구성 요소

모든 DTO는 다음을 포함해야 합니다:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({ description: '브랜드명', example: '치킨마루' })  // Swagger 문서화
  @IsString({ message: '문자열이어야 합니다' })                   // 유효성 검사
  @IsNotEmpty({ message: '필수 입력 항목입니다' })                // 필수 검사
  name: string;  // 명시적 타입
}
```

### 4. 서비스 메서드 반환 타입 명시

```typescript
// ❌ 금지
async findAll(query: FindBrandDto) {
  return this.prisma.brand.findMany();
}

// ✅ 올바른 방법
async findAll(query: FindBrandDto): Promise<Brand[]> {
  return this.prisma.brand.findMany();
}
```

## 기술 스택

- **Framework**: NestJS 10
- **Language**: TypeScript 5.1
- **Database**: PostgreSQL + Prisma 7
- **Authentication**: Passport.js (JWT + Local)
- **Documentation**: Swagger (OpenAPI)
- **Deployment**: Docker + PM2

## 디렉토리 구조

```
apps/server/
├── src/
│   ├── auth/                    # 인증 모듈
│   │   ├── strategies/          # Passport 전략 (jwt, local, admin)
│   │   ├── guards/              # 인증 가드
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── brands/                  # 브랜드 모듈
│   ├── statistics/              # 통계 모듈
│   ├── startups/                # 창업 비용 모듈
│   ├── categories/              # 카테고리 모듈
│   ├── interiors/               # 인테리어 모듈
│   ├── heads/                   # 가맹본부 모듈
│   ├── openApis/                # 공공 API 연동 모듈
│   ├── users/                   # 사용자 모듈
│   ├── prisma/                  # Prisma 서비스
│   ├── common/                  # 공통 기능
│   │   ├── interceptors/        # 응답 인터셉터
│   │   ├── dto/                 # 공통 DTO
│   │   └── utils/               # 유틸리티
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   ├── schema.prisma            # DB 스키마
│   └── migrations/              # 마이그레이션 기록
└── test/                        # 테스트
```

## 명령어

```bash
pnpm start:dev       # 개발 서버 (watch 모드, 포트 3001)
pnpm build           # 빌드
pnpm start:prod      # 프로덕션 서버
pnpm lint            # ESLint 검사 및 자동 수정

# Prisma
pnpm prisma:generate # Prisma Client 생성
pnpm migrate:dev     # 마이그레이션 (개발)
pnpm migrate:prod    # 마이그레이션 (프로덕션)

# PM2
pnpm pm2:dev         # PM2 개발 모드
pnpm pm2:prod        # PM2 프로덕션 모드
```

## 모듈 작성 패턴

### 기본 모듈 구조

```typescript
// brands/brand.module.ts
import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';

@Module({
  imports: [],                    // 의존 모듈
  controllers: [BrandController],
  providers: [BrandService],
  exports: [BrandService],        // 다른 모듈에서 사용 시
})
export class BrandModule {}
```

### 컨트롤러

```typescript
// brands/brand.controller.ts
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BrandService } from './brand.service';
import { BrandResponseDto } from './dto/brand.dto';

@ApiTags('brands')
@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  @ApiOperation({ summary: '브랜드 목록 조회' })
  @ApiResponse({ status: 200, type: [BrandResponseDto] })
  async findAll(
    @Query('category') category?: string,
    @Query('limit') limit?: number,
  ) {
    return this.brandService.findAll({ category, limit });
  }

  @Get(':name')
  @ApiOperation({ summary: '브랜드 상세 조회' })
  @ApiResponse({ status: 200, type: BrandResponseDto })
  async findOne(@Param('name') name: string) {
    return this.brandService.findByName(name);
  }
}
```

### 서비스

```typescript
// brands/brand.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { category?: string; limit?: number }) {
    const { category, limit } = params;

    return this.prisma.brand.findMany({
      where: category ? { category } : undefined,
      take: limit,
      orderBy: { brandNm: 'asc' },
    });
  }

  async findByName(name: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { brandNm: name },
    });

    if (!brand) {
      throw new NotFoundException(`Brand ${name} not found`);
    }

    return brand;
  }
}
```

## DTO 작성

### 요청 DTO

```typescript
// brands/dto/create-brand.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({ description: '브랜드명' })
  @IsString()
  @IsNotEmpty()
  brandNm: string;

  @ApiProperty({ description: '카테고리', required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ description: '가맹비', required: false })
  @IsNumber()
  @IsOptional()
  franchiseFee?: number;
}
```

### 응답 DTO

```typescript
// brands/dto/brand-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class BrandResponseDto {
  @ApiProperty({ description: '브랜드명' })
  brandNm: string;

  @ApiProperty({ description: '카테고리' })
  category: string;

  @ApiProperty({ description: '가맹비' })
  franchiseFee: number;

  @ApiProperty({ description: '가맹점 수' })
  franchiseCount: number;
}
```

## 인증/인가

### 가드 사용

```typescript
import { UseGuards, Get, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/JwtAuthGuard';
import { AdminAuthGuard } from '../auth/guards/AdminAuthGuard';

@Controller('admin')
export class AdminController {
  // JWT 인증 필요
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // 관리자 권한 필요
  @UseGuards(AdminAuthGuard)
  @Get('dashboard')
  getDashboard() {
    return { message: 'Admin only' };
  }
}
```

### 인증 전략

- **LocalStrategy**: 이메일/비밀번호 로그인
- **JwtStrategy**: JWT 토큰 검증 (쿠키에서 추출)
- **AdminStrategy**: 관리자 권한 확인

### 토큰 쿠키 설정

```typescript
// auth/auth.service.ts
setCookie(res: Response, token: string) {
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24시간
  });
}
```

## Prisma 사용

### 서비스 주입

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MyService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.brand.findMany();
  }
}
```

### 쿼리 예시

```typescript
// 조건부 필터링
const brands = await this.prisma.brand.findMany({
  where: {
    category,
    franchiseCount: { gte: 10 },
  },
  include: {
    statistics: true,
    head: true,
  },
  orderBy: { franchiseCount: 'desc' },
  take: limit,
  skip: offset,
});

// 트랜잭션
const result = await this.prisma.$transaction([
  this.prisma.brand.create({ data: brandData }),
  this.prisma.statistic.createMany({ data: statisticData }),
]);
```

### 마이그레이션

```bash
# 스키마 변경 후 마이그레이션 생성
pnpm migrate:dev --name add_new_field

# 프로덕션 배포
pnpm migrate:prod
```

## Swagger 문서화

### 접근

- **UI**: `http://localhost:3001/swagger`
- **JSON**: `http://localhost:3001/swagger-json`

### 데코레이터

```typescript
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('brands')
@Controller('brands')
export class BrandController {
  @Get(':name')
  @ApiOperation({ summary: '브랜드 조회' })
  @ApiParam({ name: 'name', description: '브랜드명' })
  @ApiResponse({ status: 200, type: BrandResponseDto })
  @ApiResponse({ status: 404, description: '브랜드를 찾을 수 없음' })
  async findOne(@Param('name') name: string) {
    // ...
  }

  @Get()
  @ApiBearerAuth()  // 인증 필요 표시
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('category') category?: string,
    @Query('limit') limit?: number,
  ) {
    // ...
  }
}
```

## 응답 인터셉터

### 성공 응답

모든 성공 응답은 자동으로 다음 형식으로 래핑됩니다:

```json
{
  "request": "/franchise/brands",
  "payload": { ... },
  "count": 10
}
```

### 에러 응답

에러 발생 시:

```json
{
  "statusCode": 404,
  "message": "Brand not found",
  "handler": "BrandController.findOne",
  "response": { ... }
}
```

## 예외 처리

```typescript
import {
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

// 404 Not Found
throw new NotFoundException('Brand not found');

// 400 Bad Request
throw new BadRequestException('Invalid category');

// 401 Unauthorized
throw new UnauthorizedException('Login required');

// 403 Forbidden
throw new ForbiddenException('Admin only');
```

## 환경 변수

```env
# .env
DATABASE_URL=postgresql://user:password@localhost:5432/open_franchise
JWT_SECRET=your-secure-secret-key
NODE_ENV=development
PORT=3001
```

사용:

```typescript
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MyService {
  constructor(private configService: ConfigService) {}

  getSecret() {
    return this.configService.get<string>('JWT_SECRET');
  }
}
```

## 테스트

### 단위 테스트

```typescript
// brands/brand.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { BrandService } from './brand.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BrandService', () => {
  let service: BrandService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandService,
        {
          provide: PrismaService,
          useValue: {
            brand: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BrandService>(BrandService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return brands', async () => {
    const mockBrands = [{ brandNm: '치킨마루' }];
    jest.spyOn(prisma.brand, 'findMany').mockResolvedValue(mockBrands);

    const result = await service.findAll({});
    expect(result).toEqual(mockBrands);
  });
});
```

## 주의사항

### 필수 (위반 시 코드 리뷰 거부)

1. **`any` 타입 절대 금지** - `unknown` + 타입 가드 사용
2. **모든 API에 DTO 필수** - Request/Response DTO 모두 작성
3. **Swagger 데코레이터 필수** - `@ApiProperty`, `@ApiOperation` 등
4. **class-validator 필수** - `@IsString`, `@IsNotEmpty` 등

### 프로젝트 설정

1. **글로벌 프리픽스**: 모든 API 경로는 `/franchise`로 시작
2. **인증 쿠키**: JWT는 `accessToken` 쿠키에 저장
3. **ValidationPipe**: 전역 적용 (`transform: true`, `whitelist: true`)
4. **Prisma 관계**: `relationMode = "prisma"` 사용 (FK 없음)
5. **CORS**: `credentials: true`로 설정됨

## DTO 작성 가이드

상세한 DTO 작성 방법은 `.claude/commands/dto.md`를 참조하세요.

```bash
# DTO 스킬 실행
/dto
```
