# Backend Agent Guidelines

## 기술 스택

- **Framework**: NestJS v10
- **Language**: TypeScript
- **Database**: PostgreSQL (Prisma ORM v7.0.1)
- **Authentication**: Passport (JWT, Local Strategy)
- **API Documentation**: Swagger
- **Package Manager**: pnpm (v10.6.5)
- **Validation**: class-validator, class-transformer

## 프로젝트 구조

```
src/
├── app.module.ts          # 루트 모듈
├── main.ts                # 애플리케이션 진입점
├── auth/                  # 인증 모듈 (JWT, Local, Admin)
├── users/                 # 사용자 관리
├── brands/                # 브랜드 정보
├── categories/            # 카테고리
├── statistics/            # 통계 데이터
├── startups/              # 창업 정보
├── interiors/             # 인테리어 정보
├── heads/                 # 본부 정보
├── openApis/              # 외부 API 연동
├── prisma/                # Prisma 서비스
└── common/                # 공통 유틸리티, 인터셉터, DTO
```

## 주요 모듈

### 인증 (Auth)

- JWT 기반 인증
- Local Strategy (이메일/비밀번호)
- Admin 전용 가드
- Guard: `JwtAuthGuard`, `LocalAuthGuard`, `AdminAuthGuard`

### 데이터베이스

- Prisma ORM 사용
- PostgreSQL 데이터베이스
- 스키마: `prisma/schema.prisma`
- 마이그레이션: `pnpm migrate`

### API 구조

- 글로벌 프리픽스: `/franchise`
- Swagger 문서: `/swagger`
- 글로벌 인터셉터: ErrorResponse, SuccessResponse
- ValidationPipe: 자동 변환 및 검증

## 개발 가이드라인

### 패키지 매니저

- **반드시 pnpm 사용** (`npm`, `yarn` 사용 금지)
- 설치: `pnpm install`
- 실행: `pnpm start:dev`

### 코드 스타일

- NestJS 모듈 패턴 준수
- 각 모듈은 `controller`, `service`, `module`, `dto`, `entities` 구조
- DTO는 `class-validator` 데코레이터 사용
- Prisma Service는 `PrismaModule`을 통해 주입

### 데이터베이스 작업

- 스키마 변경 후: `pnpm migrate`
- Prisma 클라이언트 재생성: `pnpm prisma:generate`
- Prisma Studio: `npx prisma studio`

### 인증 처리

- 보호된 엔드포인트: `@UseGuards(JwtAuthGuard)`
- Admin 전용: `@UseGuards(AdminAuthGuard)`
- JWT 토큰은 Bearer 방식으로 전달

### API 응답 형식

- 성공: `SuccessResponseInterceptor`로 자동 래핑
- 에러: `ErrorResponseInterceptor`로 자동 처리
- Validation 에러는 자동으로 400 응답

### Swagger 문서 작성

#### 컨트롤러 레벨 데코레이터

- **@ApiOkResponse** (필수): 모든 엔드포인트에 적용

  - `description`: 엔드포인트 기능 설명 (한국어)
  - `type`: 응답 DTO 타입 지정

  ```typescript
  @ApiOkResponse({
    description: '브랜드 리스트',
    type: GetBrandListRes,
  })
  ```

- **@ApiOperation** (선택): 엔드포인트 상세 설명이 필요한 경우

  - `summary`: 간단한 요약
  - `description`: 상세 설명

  ```typescript
  @ApiOperation({
    summary: '사용자 조회',
    description: '사용자 정보를 조회합니다.',
  })
  ```

- **@ApiResponse** (선택): 에러 응답 정의

  - `status`: HTTP 상태 코드
  - `description`: 에러 설명
  - `type`: 에러 응답 타입 (선택)

  ```typescript
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없음',
  })
  ```

- **@ApiBearerAuth('access-token')** (필수): 인증이 필요한 엔드포인트

  - Guard가 적용된 엔드포인트에 반드시 추가

  ```typescript
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('access-token')
  ```

- **@ApiBody** (필수): POST/PUT 요청 바디 타입 지정

  ```typescript
  @ApiBody({ type: LoginRequestDto })
  ```

- **@ApiParam** (선택): 경로 파라미터 설명

  ```typescript
  @ApiParam({ name: 'name', type: String, description: '브랜드 명' })
  ```

- **@ApiExtraModels** (필수): 쿼리 파라미터 DTO가 복잡한 경우
  - Query DTO를 사용하는 GET 엔드포인트에 추가
  ```typescript
  @ApiExtraModels(GetBrandListReq)
  ```

#### DTO 레벨 데코레이터

- **@ApiProperty** (필수): 모든 DTO 필드에 적용
  - `description`: 필드 설명 (한국어, 필수)
  - `required`: 필수 여부 (기본값: true)
  - `example`: 예시 값 (선택, 복잡한 타입일 경우 권장)
  ```typescript
  @ApiProperty({ description: '브랜드 명', required: false, example: '놀부' })
  name?: string;
  ```

#### 응답 DTO 패턴

- 단일 응답: `TypeUtil.getSuccessResponse(EntityType)`
- 리스트 응답: `TypeUtil.getSuccessResponseList(EntityType)`
- **모든 성공 응답은 반드시 TypeUtil을 상속받아야 함 (단순 메시지 포함)**

```typescript
export class GetBrandRes extends TypeUtil.getSuccessResponse(BrandRes) {}
export class GetBrandListRes extends TypeUtil.getSuccessResponseList(Brand) {}
```

#### Swagger 설정

- Swagger 경로: `/swagger`
- Bearer Auth 이름: `'access-token'` (고정)
- 모든 엔드포인트는 `/franchise` 프리픽스 하위에 문서화됨

## 주요 명령어

```bash
# 개발 서버 실행
pnpm start:dev

# 빌드
pnpm build

# 프로덕션 실행
pnpm start:prod

# 마이그레이션
pnpm migrate

# Prisma 클라이언트 생성
pnpm prisma:generate

# 린트
pnpm lint
```

## 환경 변수

- `PORT`: 서버 포트 (기본값: 3000)
- `JWT_SECRET`: JWT 시크릿 키
- `DATABASE_URL`: PostgreSQL 연결 문자열

## 주의사항

1. **패키지 매니저는 반드시 pnpm 사용**
2. Prisma 스키마 변경 시 마이그레이션 필수
3. 모든 엔드포인트는 `/franchise` 프리픽스 사용
4. DTO는 class-validator로 검증 필수
5. 인증이 필요한 엔드포인트는 Guard 적용 필수
6. **모든 엔드포인트는 @ApiOkResponse 필수 적용**
7. **쿼리 파라미터 DTO 사용 시 @ApiExtraModels 필수 적용**
8. **인증이 필요한 엔드포인트는 @ApiBearerAuth('access-token') 필수 적용**
9. **모든 DTO 필드는 @ApiProperty로 description 필수 작성**
