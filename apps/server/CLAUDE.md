# Open Franchise Server (NestJS)

NestJS 기반 백엔드 API 서버입니다.

## 기술 스택

NestJS 10 | TypeScript 5.1 | PostgreSQL + Prisma 7 | Passport.js (JWT) | Swagger

## 명령어

```bash
pnpm start:dev       # 개발 서버 (포트 3001)
pnpm prisma:generate # Prisma Client 생성
pnpm migrate:dev     # DB 마이그레이션
```

## 프로젝트 설정

- API 프리픽스: `/franchise/*`
- Swagger UI: http://localhost:3001/swagger
- 인증: `accessToken` 쿠키 (HttpOnly, 24시간)

## 코딩 규칙

### 필수

1. **모든 API에 DTO 필수** - Request/Response DTO 모두 작성
2. **Entity 필수** - 모든 모듈에 Entity 클래스 작성
3. **Swagger 데코레이터 필수** - `@ApiProperty`, `@ApiOperation` 등
4. **class-validator 필수** - `@IsString`, `@IsNotEmpty` 등
5. **반환 타입 명시** - `Promise<T>` 형태로

### 모듈 구조

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

### 데코레이터 순서

```typescript
@Get()                           // 1. HTTP 메서드
@UseGuards(AdminAuthGuard)       // 2. 가드
@ApiBearerAuth('access-token')   // 3. 인증
@ApiExtraModels(GetXxxReq)       // 4. 추가 모델
@ApiBody({ type: CreateXxxDto }) // 5. Body 스키마
@ApiOkResponse({...})            // 6. 응답 스키마
```

### 금지 사항

- 컨트롤러에서 직접 Prisma 호출 (서비스 사용)
- 하드코딩된 설정값 (ConfigService 사용)
- Swagger/class-validator 데코레이터 누락
- 인라인 타입으로 API 파라미터 정의

## 스킬

| 스킬       | 경로                          |
| ---------- | ----------------------------- |
| DTO        | `.claude/skills/dto/`         |
| Swagger    | `.claude/skills/swagger/`     |
| 새 모듈    | `.claude/skills/new-module/`  |
