# Open Franchise Web (Next.js)

Next.js 14 기반 프론트엔드 애플리케이션입니다.

## 기술 스택

Next.js 14.2 (App Router) | TypeScript 5 | Tailwind CSS 3.4 + shadcn/ui | Playwright

## 명령어

```bash
pnpm dev          # 개발 서버 (포트 3000)
pnpm swagger      # API 타입 자동 생성
pnpm test:e2e     # Playwright 테스트
```

## 코딩 규칙

### 필수

1. **Server Component 우선** - 상태/이벤트 필요시만 `'use client'`
2. **타입 안전성** - `apiTypes.ts` 자동 생성 타입 활용
3. **모바일 반응형 필수** - 모든 화면/컴포넌트에 적용
4. **Nested 폴더 구조** - 공통이 아니면 해당 페이지 폴더 내 배치

### 타입 정의

모든 타입은 `xxxType` postfix 필수:

```typescript
type CardPropsType = { title: string; children: React.ReactNode };
type ButtonPropsType = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};
```

### Client Component 사용 조건

- `useState`, `useEffect` 등 훅 사용
- 이벤트 핸들러 (`onClick`, `onChange` 등)
- 브라우저 API 접근 (`window`, `localStorage` 등)

### Tailwind 클래스 순서

레이아웃 → 박스 모델 → 타이포그래피 → 비주얼 → 기타

```typescript
<div className="flex items-center w-full px-4 text-lg bg-white border-b transition-all">
```

### 반응형 브레이크포인트

| 접두사 | 최소 너비 | 용도      |
| ------ | --------- | --------- |
| (없음) | 0px       | 모바일    |
| `sm:`  | 640px     | 큰 모바일 |
| `md:`  | 768px     | 태블릿    |
| `lg:`  | 1024px    | 데스크톱  |

### 금지 사항

- Server Component에서 `useState`, `useEffect` 사용
- 불필요한 `'use client'` 남발
- 모바일 반응형 미고려
- `xxxType` postfix 누락
- `interface` 사용 (`type` 키워드만 사용)

## 스킬

| 스킬              | 경로                              |
| ----------------- | --------------------------------- |
| 프론트엔드 디자인 | `.claude/skills/frontend-design/` |
