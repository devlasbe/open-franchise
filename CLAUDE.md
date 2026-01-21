# Open Franchise Monorepo

공정거래위원회 가맹사업 정보를 제공하는 풀스택 웹 애플리케이션입니다.

## 프로젝트 구조

```
open-franchise/
├── apps/
│   ├── server/          # NestJS 백엔드 (REST API, Prisma, PostgreSQL)
│   └── web/             # Next.js 프론트엔드 (App Router, Tailwind, shadcn/ui)
├── .claude/
│   ├── rules/           # 코딩 규칙 (lint, git, nestjs, nextjs)
│   └── skills/          # 스킬 (dto, swagger, frontend-design 등)
└── .github/workflows/   # CI/CD
```

## 에이전트 워크플로우

| 단계 | 에이전트        | 역할           | 호출 시점                  |
| ---- | --------------- | -------------- | -------------------------- |
| 1    | `planner`       | 작업 계획 수립 | 모든 작업 시작 전 **필수** |
| 2    | `code-expert`   | 코드 구현      | 계획 승인 후               |
| 3    | `code-reviewer` | 품질 개선      | 구현 완료 후 **자동**      |

## 주요 명령어

```bash
pnpm install              # 의존성 설치
pnpm dev                  # 개발 서버 (web:3000, server:3001)
pnpm build                # 전체 빌드
pnpm lint                 # 린트 검사
pnpm prisma:migrate:dev   # DB 마이그레이션
```

## 앱 개요

- **apps/server**: REST API 서버. Swagger 문서 `/swagger`, JWT 인증
- **apps/web**: 프론트엔드. Server Components 우선, API 타입 자동 생성 (`pnpm swagger`)

## 코딩 컨벤션

- TypeScript 필수, `any` 금지, `type` 선호
- 네이밍: 파일 camelCase, 컴포넌트 PascalCase, 상수 UPPER_SNAKE_CASE
- 포맷팅/린트: `.claude/rules/lint.md` 참조

## 참고

- 앱별 상세: 각 프로젝트의 `CLAUDE.md`
- 코딩 규칙: `.claude/rules/`
- 스킬: `.claude/skills/`
