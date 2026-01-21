# 개발 서버 실행

개발 서버를 실행합니다.

## 실행 명령어

### 전체 앱 실행 (병렬)

```bash
pnpm dev
```

### 개별 앱 실행

**웹 (Next.js) - 포트 3000:**

```bash
pnpm dev:web
```

**서버 (NestJS) - 포트 3001:**

```bash
pnpm dev:server
```

## 환경 확인

- 웹: http://localhost:3000
- 서버: http://localhost:3001
- Swagger: http://localhost:3001/swagger

## 주의사항

- 서버 실행 전 `DATABASE_URL` 환경 변수 설정 필요
- Prisma 클라이언트가 없으면 먼저 `pnpm prisma:generate` 실행
