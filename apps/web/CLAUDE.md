# Open Franchise Web (Next.js)

Next.js 14 기반 프론트엔드 애플리케이션입니다.

## 기술 스택

| 영역 | 기술 |
|------|------|
| Framework | Next.js 14.2 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 3.4 + shadcn/ui |
| State | React Context API |
| Testing | Playwright (E2E) |

## 디렉토리 구조

```
apps/web/
├── app/                    # App Router 페이지
│   ├── brand/[name]/       # 브랜드 상세 + 댓글
│   ├── admin/              # 관리자 페이지
│   └── login/              # 로그인
├── components/ui/          # shadcn/ui 컴포넌트
├── services/               # API 서비스 클래스
├── hooks/                  # 커스텀 훅
├── context/                # React Context (Auth)
├── constants/              # 환경 상수
├── types/                  # TypeScript 타입
└── utils/                  # fetchService 등
```

## 명령어

```bash
pnpm dev          # 개발 서버 (포트 3000)
pnpm build        # 프로덕션 빌드
pnpm lint         # ESLint 검사
pnpm test:e2e     # Playwright 테스트
pnpm swagger      # API 타입 자동 생성
```

## 필수 규칙

> 상세 코딩 규칙: `.claude/rules/nextjs.md`

1. **Server Component 우선** - 상태/이벤트 필요시만 `'use client'`
2. **타입 안전성** - `apiTypes.ts` 자동 생성 타입 활용
3. **모바일 반응형 필수** - 모든 화면/컴포넌트에 적용

## API 호출

### 서비스 클래스

| 서비스 | 설명 |
|--------|------|
| `BrandService` | 브랜드 조회/검색 |
| `StatisticService` | 통계 데이터 |
| `AuthService` | 인증/로그인 |
| `AdminService` | 관리자 기능 |
| `CommentService` | 댓글 CRUD |

### fetchService 사용

```typescript
// Server Component
const data = await BrandService.getBrandByName('브랜드명');

// Client Component
const data = await fetchService<T>({
  path: 'endpoint',
  init: { method: 'GET' },
  isClient: true,
});
```

## 상태 관리

```typescript
const { user, isLoggedIn, isAdmin, logout } = useAuth();
```

## 모바일 반응형 (필수)

> **모든 화면과 컴포넌트는 반드시 모바일 반응형을 고려해야 합니다.**

### 브레이크포인트

| 접두사 | 최소 너비 | 용도 |
|--------|----------|------|
| (없음) | 0px | 모바일 기본 |
| `sm:` | 640px | 큰 모바일 |
| `md:` | 768px | 태블릿 |
| `lg:` | 1024px | 데스크톱 |

### Dual Layout (테이블 → 카드)

```typescript
{/* 모바일: 카드 */}
<div className="md:hidden space-y-3">
  {items.map((item) => (
    <Card key={item.id}>
      <CardContent className="p-4">
        <div className="flex justify-between">
          <span>{item.title}</span>
          <Badge>{item.status}</Badge>
        </div>
      </CardContent>
    </Card>
  ))}
</div>

{/* 데스크톱: 테이블 */}
<div className="hidden md:block">
  <Table>...</Table>
</div>
```

### 반응형 폼

```typescript
<div className="flex flex-col sm:flex-row gap-4">
  <Input className="w-full sm:w-48" />
  <Button className="w-full sm:w-auto">검색</Button>
</div>
```

## 커스텀 폰트 사이즈

| 클래스 | 크기 |
|--------|------|
| `text-h1` | 32px |
| `text-h2` | 24px |
| `text-body` | 14px |
| `text-caption` | 12px |
