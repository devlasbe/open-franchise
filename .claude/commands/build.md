---
description: 프로덕션 빌드 실행
---

# 빌드

프로덕션 빌드를 실행합니다.

## 실행 명령어

### 전체 빌드

```bash
pnpm build
```

### 개별 앱 빌드

**웹 (Next.js):**

```bash
pnpm build:web
```

**서버 (NestJS):**

```bash
pnpm build:server
```

## 빌드 결과물

- **웹**: `apps/web/.next/` (standalone 모드)
- **서버**: `apps/server/dist/`

## 프로덕션 실행

**웹:**

```bash
cd apps/web
node .next/standalone/server.js
```

**서버:**

```bash
cd apps/server
node dist/src/main
# 또는
pnpm start:prod
```

## Docker 빌드

```bash
# 웹
docker build -t open-franchise-web ./apps/web

# 서버
docker build -t open-franchise-server ./apps/server
```
