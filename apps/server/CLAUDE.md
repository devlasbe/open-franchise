# Open Franchise Server (NestJS)

NestJS 기반 백엔드 API 서버입니다.

## ⚠️ 필수 준수 사항

> **이 규칙들은 반드시 지켜야 합니다. 예외 없음.**

1. **`any` 타입 절대 금지** - `unknown` + 타입 가드 사용
2. **모든 API에 DTO 필수** - Request/Response DTO 모두 작성
3. **Swagger 데코레이터 필수** - `@ApiProperty`, `@ApiOperation` 등
4. **class-validator 필수** - `@IsString`, `@IsNotEmpty` 등
5. **서비스 메서드 반환 타입 명시** - `Promise<T>` 형태로

상세 코딩 규칙은 `.claude/rules/nestjs.md`를 참조하세요.

## 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| Framework | NestJS | 10 |
| Language | TypeScript | 5.1 |
| Database | PostgreSQL + Prisma | 7 |
| Auth | Passport.js (JWT + Local) | - |
| Docs | Swagger (OpenAPI) | - |
| Deploy | Docker + PM2 | - |

## 디렉토리 구조

```
apps/server/src/
├── auth/           # 인증 (strategies/, guards/)
├── brands/         # 브랜드
├── statistics/     # 통계
├── startups/       # 창업 비용
├── categories/     # 카테고리
├── interiors/      # 인테리어
├── heads/          # 가맹본부
├── openApis/       # 공공 API 연동
├── users/          # 사용자
├── prisma/         # Prisma 서비스
├── common/         # 공통 (인터셉터, DTO, 유틸)
└── app.module.ts
```

## 명령어

```bash
# 개발
pnpm start:dev       # 개발 서버 (포트 3001)
pnpm build           # 빌드
pnpm start:prod      # 프로덕션 서버
pnpm lint            # ESLint

# Prisma
pnpm prisma:generate # Client 생성
pnpm migrate:dev     # 마이그레이션 (개발)
pnpm migrate:prod    # 마이그레이션 (프로덕션)
```

## 환경 변수

```env
DATABASE_URL=postgresql://user:password@localhost:5432/open_franchise
JWT_SECRET=your-secure-secret-key
NODE_ENV=development
PORT=3001
```

## 프로젝트 설정

| 설정 | 값 |
|------|-----|
| API 프리픽스 | `/franchise/*` |
| 인증 쿠키 | `accessToken` (HttpOnly, 24시간) |
| ValidationPipe | `transform: true`, `whitelist: true` |
| CORS | `credentials: true` |
| Prisma | `relationMode = "prisma"` |

## Swagger

- **UI**: http://localhost:3001/swagger
- **JSON**: http://localhost:3001/swagger-json

## 응답 형식

```json
// 성공
{ "request": "/franchise/brands", "payload": {...}, "count": 10 }

// 에러
{ "statusCode": 404, "message": "Brand not found", "handler": "BrandController.findOne" }
```

## 인증 전략

| 전략 | 용도 |
|------|------|
| LocalStrategy | 이메일/비밀번호 로그인 |
| JwtStrategy | JWT 토큰 검증 (쿠키) |
| AdminStrategy | 관리자 권한 확인 |

## 관련 가이드

| 가이드 | 경로 |
|--------|------|
| NestJS 코딩 규칙 | `.claude/rules/nestjs.md` |
| DTO 작성 | `.claude/commands/dto.md` |
| Swagger 문서화 | `.claude/commands/swagger.md` |
| 새 모듈 생성 | `.claude/commands/new-module.md` |
