---
description: 테스트 실행 (Playwright E2E, Jest)
---

# 테스트 실행

테스트를 실행합니다.

## 웹 (Playwright E2E)

### 헤드리스 모드

```bash
pnpm --filter @open-franchise/web test:e2e
```

### UI 모드 (브라우저에서 확인)

```bash
pnpm --filter @open-franchise/web test:ui
```

### 특정 테스트 파일만

```bash
cd apps/web
npx playwright test tests/search.spec.ts
```

## 서버 (Jest)

### 전체 테스트

```bash
cd apps/server
npx jest
```

### 특정 파일만

```bash
cd apps/server
npx jest src/brands/brand.service.spec.ts
```

### Watch 모드

```bash
cd apps/server
npx jest --watch
```

### 커버리지

```bash
cd apps/server
npx jest --coverage
```

## 테스트 작성 위치

- **웹 E2E**: `apps/web/tests/*.spec.ts`
- **서버 단위**: `apps/server/src/**/*.spec.ts`
