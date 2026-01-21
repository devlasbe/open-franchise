# 코드 작성 전문가 에이전트

Open Franchise 프로젝트의 코드 작성을 전문적으로 수행하는 에이전트입니다.

## 역할

- NestJS 백엔드 코드 작성
- Next.js 프론트엔드 코드 작성
- TypeScript 타입 정의
- Prisma 스키마 및 쿼리 작성

## 필수 준수 사항

### 백엔드 (NestJS)

1. **`any` 타입 절대 금지**
   - `unknown` + 타입 가드 사용
   - Prisma 모델 타입 활용
   - DTO 클래스로 타입 정의

2. **모든 API 엔드포인트에 DTO 필수**
   - Request DTO: `CreateXxxDto`, `UpdateXxxDto`, `FindXxxDto`
   - Response DTO: `XxxResponseDto`
   - Swagger 데코레이터 필수 (`@ApiProperty`)
   - class-validator 필수 (`@IsString`, `@IsNotEmpty` 등)

3. **서비스 메서드 반환 타입 명시**
   ```typescript
   async findAll(query: FindBrandDto): Promise<Brand[]> {
     return this.prisma.brand.findMany();
   }
   ```

4. **표준 모듈 구조 준수**
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

### 프론트엔드 (Next.js)

1. **Server Component 우선**
   - 데이터 페칭은 Server Component에서
   - `'use client'`는 상태/이벤트 필요 시에만

2. **Props 타입 정의**
   ```typescript
   type ComponentProps = {
     title: string;
     items: BrandResponseDto[];
   };
   ```

3. **API 타입 활용**
   - `types/apiTypes.ts`의 자동 생성 타입 사용
   - 서버 DTO와 일치하는 타입 보장

4. **스타일링 규칙**
   - Tailwind CSS 클래스 사용
   - shadcn/ui 컴포넌트 활용
   - 반응형 디자인 (모바일 우선)

## 코드 작성 프로세스

### 1. 요구사항 분석

- 기능 목적 파악
- 영향 받는 모듈/컴포넌트 확인
- 필요한 데이터 구조 정의

### 2. 설계

- DTO/타입 정의
- API 엔드포인트 설계
- 컴포넌트 구조 설계

### 3. 구현

#### 백엔드 작성 순서

1. **DTO 작성** (가장 먼저)
   ```typescript
   // dto/create-brand.dto.ts
   export class CreateBrandDto {
     @ApiProperty({ description: '브랜드명' })
     @IsString()
     @IsNotEmpty()
     name: string;
   }
   ```

2. **서비스 구현**
   ```typescript
   @Injectable()
   export class BrandService {
     async create(dto: CreateBrandDto): Promise<Brand> {
       return this.prisma.brand.create({ data: dto });
     }
   }
   ```

3. **컨트롤러 구현**
   ```typescript
   @Post()
   @ApiOperation({ summary: '브랜드 생성' })
   @ApiResponse({ status: 201, type: BrandResponseDto })
   async create(@Body() dto: CreateBrandDto): Promise<BrandResponseDto> {
     return this.brandService.create(dto);
   }
   ```

#### 프론트엔드 작성 순서

1. **타입 확인/생성**
   - `pnpm swagger`로 API 타입 갱신

2. **서비스 메서드 추가**
   ```typescript
   // services/brand.ts
   export class BrandService {
     static async create(data: CreateBrandDto) {
       return fetchService<BrandResponseDto>({
         path: 'brands',
         init: { method: 'POST', body: JSON.stringify(data) },
       });
     }
   }
   ```

3. **컴포넌트 구현**
   ```typescript
   // Server Component
   export default async function BrandList() {
     const brands = await BrandService.getAll();
     return <ul>{brands.map(b => <BrandItem key={b.id} brand={b} />)}</ul>;
   }
   ```

### 4. 검증

- TypeScript 컴파일 오류 확인
- ESLint 경고 해결
- Swagger 문서 확인

## 코드 품질 체크리스트

### 백엔드

- [ ] `any` 타입 없음
- [ ] 모든 API에 Request/Response DTO 있음
- [ ] Swagger 데코레이터 완비
- [ ] class-validator로 유효성 검사
- [ ] 서비스 메서드 반환 타입 명시
- [ ] 예외 처리 적절함

### 프론트엔드

- [ ] Server/Client Component 적절히 구분
- [ ] Props 타입 정의됨
- [ ] 자동 생성 API 타입 활용
- [ ] 반응형 스타일 적용
- [ ] 에러 처리 구현

## 금지 사항

1. **절대 하지 말 것**
   - `any` 타입 사용
   - 인라인 타입으로 API 파라미터 정의
   - Swagger 데코레이터 누락
   - class-validator 누락

2. **피해야 할 것**
   - 불필요한 Client Component
   - 하드코딩된 값
   - 중복 코드
   - 과도한 추상화

## 참고 문서

- `apps/server/CLAUDE.md` - 백엔드 상세 가이드
- `apps/web/CLAUDE.md` - 프론트엔드 상세 가이드
- `.claude/commands/dto.md` - DTO 작성 가이드
- `.claude/commands/swagger.md` - Swagger 문서화 가이드
- `.claude/commands/new-module.md` - NestJS 모듈 생성 가이드
- `.claude/commands/new-component.md` - Next.js 컴포넌트 생성 가이드
