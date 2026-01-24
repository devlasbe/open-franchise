# NestJS 코딩 규칙

## ⚠️ 필수 규칙

### 1. 모든 API에 DTO 필수

```typescript
// ❌ 금지
@Post()
async create(@Body() data: { name: string }) { ... }

// ✅ 올바른 방법
@Post()
async create(@Body() dto: CreateBrandDto): Promise<BrandResponseDto> { ... }
```

### 2. 반환 타입 명시

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
├── dto/
│   └── [module].dto.ts
└── entities/
    └── [module].entity.ts
```

## 스킬 참조

상세한 작성 가이드는 스킬 문서를 참조하세요:

| 스킬 | 파일 | 설명 |
|------|------|------|
| DTO 작성 | `.claude/skills/dto/SKILL.md` | Request/Response DTO 템플릿, TypeUtil 활용법 |
| Entity 작성 | `.claude/skills/entity/SKILL.md` | Entity 클래스 정의, 필드 패턴 |
| Swagger 문서화 | `.claude/skills/swagger/SKILL.md` | 컨트롤러 데코레이터, API 문서화 |

## 데코레이터 순서

```typescript
@Get()                           // 1. HTTP 메서드
@UseGuards(AdminAuthGuard)       // 2. 가드 (필요시)
@ApiBearerAuth('access-token')   // 3. 인증 (필요시)
@ApiExtraModels(GetXxxReq)       // 4. 추가 모델 등록
@ApiBody({ type: CreateXxxDto }) // 5. Body 스키마 (필요시)
@ApiOkResponse({...})            // 6. 응답 스키마
```

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
- 하드코딩된 설정값 (ConfigService 사용)
- Swagger 데코레이터 누락
- class-validator 누락
- 반환 타입 생략
- 인라인 타입으로 API 파라미터 정의
