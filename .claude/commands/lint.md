---
description: 코드 린트 및 포맷팅 실행
---

# 린트 및 포맷팅

코드 품질 검사 및 자동 수정을 실행합니다.

## 전체 린트

```bash
pnpm lint
```

## 개별 앱 린트

**웹 (Next.js):**

```bash
pnpm --filter @open-franchise/web lint
```

**서버 (NestJS):**

```bash
pnpm --filter @open-franchise/server lint
```

## 자동 수정

서버 린트는 기본적으로 `--fix` 옵션이 포함되어 있습니다.

웹의 경우:

```bash
cd apps/web
npx next lint --fix
```

## Prettier 포맷팅

**전체:**

```bash
npx prettier --write "**/*.{ts,tsx,js,json}"
```

**특정 파일:**

```bash
npx prettier --write apps/web/components/Header.tsx
```

## 설정 파일 위치

- **ESLint (웹)**: `apps/web/.eslintrc.json`
- **ESLint (서버)**: `apps/server/.eslintrc.js`
- **Prettier (웹)**: `apps/web/.prettierrc`
- **Prettier (서버)**: `apps/server/.prettierrc`

## 공통 규칙

- Single quotes 사용
- Trailing comma 사용
- Tab width: 2
- Semicolon 사용
