# Lint 규칙

## 필수 검증

모든 코드 변경 후 lint 검사를 실행합니다.

```bash
pnpm lint
```

## ESLint 규칙

### Server (NestJS)

- TypeScript ESLint 권장 규칙 적용
- Prettier 자동 포맷팅
- `any` 타입 경고 (점진적 제거 권장)

### Web (Next.js)

- Next.js Core Web Vitals 규칙
- TypeScript 엄격 모드
- Prettier 자동 포맷팅

## Prettier 설정

루트 `.prettierrc` 기준 (모든 앱 공통):

| 옵션 | 값 | 설명 |
|------|-----|------|
| singleQuote | true | 작은따옴표 사용 |
| trailingComma | "all" | 후행 쉼표 항상 사용 |
| tabWidth | 2 | 탭 너비 2칸 |
| semi | true | 세미콜론 사용 |
| printWidth | 100 | 줄 최대 길이 |

## 명령어

```bash
# ESLint 검사
pnpm lint

# ESLint 자동 수정
pnpm lint:fix

# Prettier 포맷팅
pnpm format

# Prettier 검사만
pnpm format:check
```

## 에이전트 검증

코드 작성 에이전트는 작업 완료 후 반드시 `pnpm lint`를 실행하여 검증해야 합니다.
lint 오류가 있으면 수정 후 작업을 완료합니다.
