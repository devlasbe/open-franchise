# Open Franchise Monorepo

공정거래위원회 가맹사업 정보를 제공하는 풀스택 웹 애플리케이션입니다.

## 프로젝트 구조

```
open-franchise/
├── apps/
│   ├── server/          # NestJS 백엔드 API 서버
│   └── web/             # Next.js 프론트엔드 앱
├── .claude/
│   ├── rules/           # Claude 코딩 규칙
│   └── commands/        # 재사용 가능한 명령어
└── .github/workflows/   # CI/CD 파이프라인
```

## 작업 규칙

### 계획 수립 필수

**모든 작업은 반드시 `.claude/agents/planner.md` 서브 에이전트를 먼저 호출하여 계획을 수립한 후 진행해야 합니다.**

1. 작업 시작 전 planner 에이전트 호출
2. 계획 검토 및 승인
3. 승인된 계획에 따라 구현 진행

이를 통해 체계적인 구현과 일관된 코드 품질을 보장합니다.

## 기술 스택

| 영역 | 기술 |
|------|------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | NestJS 10, Prisma 7, PostgreSQL, Passport.js (JWT) |
| **Monorepo** | pnpm Workspaces |
| **Testing** | Playwright (E2E), Jest (Unit) |
| **배포** | Docker, PM2, GitHub Actions |

## 패키지 매니저

**pnpm 10.6.5** 사용. 워크스페이스 기반 모노레포 구조.

```bash
# 전체 의존성 설치
pnpm install

# 개발 서버 실행 (병렬)
pnpm dev

# 개별 앱 실행
pnpm dev:web      # Next.js (포트 3000)
pnpm dev:server   # NestJS (포트 3001)

# 빌드
pnpm build        # 전체 빌드
pnpm build:web    # 웹만 빌드
pnpm build:server # 서버만 빌드

# 린트
pnpm lint
```

## 주요 명령어

### Prisma (데이터베이스)

```bash
# 클라이언트 생성
pnpm prisma:generate

# 마이그레이션 (개발)
pnpm prisma:migrate:dev
```

### 테스트

```bash
# E2E 테스트 (web)
pnpm --filter @open-franchise/web test:e2e
```

## 프로젝트 개요

### apps/server (NestJS)

백엔드 API 서버로 가맹사업 데이터를 처리합니다.

- **역할**: REST API 제공, 인증/인가, 공공 데이터 연동
- **API 경로**: `/franchise/*`
- **문서화**: Swagger (`/swagger`)
- **데이터베이스**: PostgreSQL + Prisma ORM
- **인증**: JWT 토큰 (HttpOnly Cookie)

주요 도메인:
- `brands` - 프랜차이즈 브랜드 정보
- `statistics` - 매출/가맹점 통계
- `startups` - 창업 비용 정보
- `categories` - 업종 분류
- `auth` - 사용자 인증

### apps/web (Next.js)

프론트엔드 웹 애플리케이션입니다.

- **역할**: 사용자 인터페이스, SEO 최적화
- **라우팅**: App Router (Server Components 우선)
- **스타일링**: Tailwind CSS + shadcn/ui
- **상태 관리**: React Context API
- **API 호출**: Custom Fetch Service

주요 페이지:
- `/` - 홈 (브랜드 랭킹)
- `/search` - 브랜드 검색
- `/brand/[name]` - 브랜드 상세
- `/admin` - 관리자 대시보드
- `/login` - 로그인

## 공통 코딩 컨벤션

### TypeScript

- 모든 코드는 TypeScript로 작성
- **`any` 타입 사용 금지** - `unknown` + 타입 가드 또는 구체적인 타입 사용
- 명시적 타입 선언 권장
- 인터페이스보다 `type` 키워드 선호

### 포맷팅 (Prettier)

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": true
}
```

### 네이밍 규칙

- **파일명**: camelCase (`brandService.ts`, `useAuth.ts`)
- **컴포넌트**: PascalCase (`SearchInput.tsx`, `Header.tsx`)
- **변수/함수**: camelCase (`getBrandList`, `isLoggedIn`)
- **상수**: UPPER_SNAKE_CASE (`API_URL`, `JWT_SECRET`)
- **타입/인터페이스**: PascalCase (`BrandDto`, `UserWithoutPassword`)

### 커밋 메시지

```
<type>: <subject>

<body>
```

타입:
- `feat` - 새로운 기능
- `fix` - 버그 수정
- `refactor` - 리팩토링
- `chore` - 빌드/설정 변경
- `docs` - 문서 수정
- `test` - 테스트 추가/수정

## 환경 변수

### Server (.env)

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NODE_ENV=development|production
PORT=3001
```

### Web (.env.local)

```env
NEXT_PUBLIC_API_URL_DEV=http://localhost:3001
NEXT_PUBLIC_API_URL_PROD=https://api.example.com
```

## API 타입 자동 생성

서버의 Swagger 스키마에서 프론트엔드 타입을 자동 생성합니다.

```bash
# 서버 실행 후
cd apps/web
pnpm swagger
```

생성된 타입: `apps/web/types/apiTypes.ts`

## Docker 배포

```bash
# 서버 빌드 및 실행
docker build -t open-franchise-server ./apps/server
docker run -p 3001:3000 open-franchise-server

# 웹 빌드 및 실행
docker build -t open-franchise-web ./apps/web
docker run -p 3000:3000 open-franchise-web
```

## 참고 사항

- 각 앱별 상세 가이드는 해당 프로젝트의 `CLAUDE.md`를 참조하세요
- `.claude/rules/`에서 코딩 규칙을 확인하세요
- `.claude/commands/`에서 재사용 가능한 명령어를 확인하세요
