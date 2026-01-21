# NestJS 코딩 규칙

## ⚠️ 필수 규칙

### 1. `any` 타입 절대 금지

```typescript
// ❌ 금지
function process(data: any) { ... }

// ✅ 올바른 방법
function process(data: BrandResponseDto) { ... }

// 타입을 모를 경우
function process(data: unknown) {
  if (isBrandData(data)) { /* 타입 가드 후 사용 */ }
}
```

### 2. 모든 API에 DTO 필수

```typescript
// ❌ 금지
@Post()
async create(@Body() data: { name: string }) { ... }

// ✅ 올바른 방법
@Post()
async create(@Body() dto: CreateBrandDto): Promise<BrandResponseDto> { ... }
```

### 3. 반환 타입 명시

```typescript
// ❌ 금지
async findAll(query: FindBrandDto) { return this.prisma.brand.findMany(); }

// ✅ 올바른 방법
async findAll(query: FindBrandDto): Promise<Brand[]> { return this.prisma.brand.findMany(); }
```

## 모듈 구조

```
module/
├── module.module.ts
├── module.controller.ts
├── module.service.ts
└── dto/
    ├── create-module.dto.ts
    ├── update-module.dto.ts
    └── module-response.dto.ts
```

상세 템플릿: `.claude/commands/new-module.md`

## 데코레이터 순서

1. `@ApiTags()` (클래스)
2. `@Controller()` (클래스)
3. `@UseGuards()` (메서드/클래스)
4. `@Get()`, `@Post()` 등 (메서드)
5. `@ApiOperation()`, `@ApiResponse()` (메서드)

## DTO 작성 규칙

모든 DTO 필드에 필수:
- `@ApiProperty()` - Swagger 문서화
- `@IsString()`, `@IsNumber()` 등 - 타입 검증
- `@IsNotEmpty()`, `@IsOptional()` - 필수/선택 여부

```typescript
export class CreateBrandDto {
  @ApiProperty({ description: '브랜드명', example: '치킨마루' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
```

상세 가이드: `.claude/commands/dto.md`

## Swagger 문서화

모든 API 엔드포인트에 필수:
- `@ApiTags()` - 그룹핑
- `@ApiOperation()` - 설명
- `@ApiResponse()` - 성공/에러 응답

상세 가이드: `.claude/commands/swagger.md`

## 예외 처리

```typescript
import { NotFoundException, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';

throw new NotFoundException('Brand not found');      // 404
throw new BadRequestException('Invalid category');  // 400
throw new UnauthorizedException('Please login');    // 401
throw new ForbiddenException('Admin only');         // 403
```

## Prisma 사용

```typescript
@Injectable()
export class MyService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Brand[]> {
    return this.prisma.brand.findMany();
  }

  async findOne(id: string): Promise<Brand> {
    const item = await this.prisma.brand.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Brand #${id} not found`);
    return item;
  }
}
```

## 금지 사항

- 컨트롤러에서 직접 Prisma 호출 (서비스 사용)
- `any` 타입 사용
- 하드코딩된 설정값 (ConfigService 사용)
- Swagger 데코레이터 누락
- class-validator 누락
- 반환 타입 생략
