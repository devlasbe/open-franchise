# Open Franchise Web (Next.js)

Next.js 14 기반 프론트엔드 애플리케이션입니다.

## 기술 스택

- **Framework**: Next.js 14.2 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 3.4 + shadcn/ui (New York style)
- **State**: React Context API
- **Charts**: Recharts
- **Icons**: Lucide React
- **Testing**: Playwright (E2E)

## 디렉토리 구조

```
apps/web/
├── app/                    # App Router 페이지
│   ├── layout.tsx         # 루트 레이아웃 (AuthProvider)
│   ├── page.tsx           # 홈 페이지
│   ├── search/            # 검색 페이지
│   ├── brand/[name]/      # 브랜드 상세 (동적 라우트)
│   ├── admin/             # 관리자 페이지
│   └── login/             # 로그인 페이지
├── components/
│   ├── ui/                # shadcn/ui 컴포넌트
│   ├── chart/             # 차트 컴포넌트
│   ├── header/            # 헤더
│   ├── footer/            # 푸터
│   └── errorBoundary/     # 에러 처리
├── services/              # API 서비스 클래스
├── hooks/                 # 커스텀 훅
├── context/               # React Context
├── lib/                   # 유틸리티
├── types/                 # TypeScript 타입
├── utils/                 # 헬퍼 함수
└── tests/                 # E2E 테스트
```

## 명령어

```bash
pnpm dev          # 개발 서버 (포트 3000)
pnpm build        # 프로덕션 빌드
pnpm start        # 프로덕션 서버
pnpm lint         # ESLint 검사
pnpm test:e2e     # Playwright E2E 테스트
pnpm test:ui      # Playwright UI 모드
pnpm swagger      # API 타입 자동 생성
```

## 컴포넌트 작성 패턴

### Server Component (기본)

데이터 페칭이 필요한 컴포넌트는 async Server Component로 작성합니다.

```typescript
// components/Rank.tsx
type RankProps = {
  category: string;
  title: string;
};

export default async function Rank({ category, title }: RankProps) {
  const data = await StatisticService.getStatisticByFilter({
    category,
    limit: 10,
  });

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-h2 font-bold">{title}</h2>
      {/* 렌더링 */}
    </div>
  );
}
```

### Client Component

상태 관리나 이벤트 핸들러가 필요한 경우 `'use client'` 디렉티브를 사용합니다.

```typescript
// components/SearchInput.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchInput() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    router.push(`/search?name=${name}`);
  };

  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      className="w-full px-4 py-2 border rounded-lg"
    />
  );
}
```

### Props 타입 정의

```typescript
// 간단한 Props: type 사용
type ButtonProps = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
};

// HTML 속성 확장
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};
```

## API 호출 패턴

### 서비스 클래스

`services/` 디렉토리에 도메인별 서비스 클래스를 정의합니다.

```typescript
// services/brand.ts
import { fetchService } from '@/lib/fetchService';
import { BrandResponseDto } from '@/types/apiTypes';

export class BrandService {
  static async getBrandByName(name: string) {
    return await fetchService<BrandResponseDto>({
      path: `brands/${name}`,
      init: { method: 'GET' },
    });
  }

  static async searchBrands(params: { name?: string; category?: string }) {
    const query = new URLSearchParams(params).toString();
    return await fetchService<BrandResponseDto[]>({
      path: `brands/search?${query}`,
      init: { method: 'GET' },
    });
  }
}
```

### fetchService 사용

```typescript
// lib/fetchService.ts
// Server Component와 Client Component 모두에서 사용 가능

// Server Component에서
const data = await BrandService.getBrandByName('치킨마루');

// Client Component에서
const data = await fetchService<BrandResponseDto>({
  path: 'brands/치킨마루',
  init: { method: 'GET' },
  isClient: true,  // 클라이언트 사이드 호출
});
```

### 클라이언트 API 호출 (인증 필요)

```typescript
// 로그인
await AuthService.login({
  email: 'user@example.com',
  password: 'password',
});

// 인증된 요청 (쿠키 자동 포함)
const profile = await AuthService.getProfile();
```

## 상태 관리

### AuthContext

```typescript
// hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// 사용
const { user, isLoggedIn, isAdmin, logout } = useAuth();
```

## 스타일링

### Tailwind CSS 클래스

```typescript
// 반응형 디자인
<div className="px-4 sm:px-8 md:px-16 lg:px-24">

// 플렉스박스 레이아웃
<div className="flex items-center justify-between gap-4">

// 조건부 스타일 (cn 유틸)
import { cn } from '@/lib/utils';

<button className={cn(
  'px-4 py-2 rounded-lg',
  isActive && 'bg-primary text-white',
  disabled && 'opacity-50 cursor-not-allowed'
)}>
```

### shadcn/ui 컴포넌트

```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>브랜드 정보</CardTitle>
  </CardHeader>
  <CardContent>
    {/* 내용 */}
  </CardContent>
</Card>
```

### 커스텀 폰트 사이즈

`tailwind.config.ts`에 정의된 사이즈 사용:

```typescript
<h1 className="text-h1">제목</h1>      // 32px
<h2 className="text-h2">부제목</h2>    // 24px
<p className="text-body">본문</p>       // 14px
<span className="text-caption">캡션</span>  // 12px
```

## 커스텀 훅

### useQueryString

URL 쿼리 파라미터 파싱:

```typescript
const { name, category, page } = useQueryString();
```

### useSearchInfiniteScroll

무한 스크롤 구현:

```typescript
const {
  data,
  isLoading,
  hasMore,
  loadMore,
} = useSearchInfiniteScroll({ category: 'chicken' });
```

## 에러 처리

### ErrorBoundary

```typescript
import { ErrorBoundary } from '@/components/errorBoundary/ErrorBoundary';

<ErrorBoundary fallback={<ErrorFallback />}>
  <MyComponent />
</ErrorBoundary>
```

### API 에러

```typescript
import { ApiError } from '@/lib/fetchService';

try {
  const data = await BrandService.getBrandByName(name);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error: ${error.status} - ${error.message}`);
  }
}
```

## 테스트

### Playwright E2E 테스트

```typescript
// tests/search.spec.ts
import { test, expect } from '@playwright/test';

test.describe('검색 기능', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('검색어 입력 후 결과 페이지 이동', async ({ page }) => {
    await page.fill('[data-testid="search-input"]', '치킨');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/search\?name=치킨/);
  });
});
```

### 테스트 실행

```bash
pnpm test:e2e        # 헤드리스 모드
pnpm test:ui         # UI 모드 (브라우저에서 확인)
```

## SEO

### 메타데이터 설정

```typescript
// app/brand/[name]/page.tsx
import { Metadata } from 'next';
import { generateBrandMetadata } from '@/utils/seo';

export async function generateMetadata({ params }): Promise<Metadata> {
  const brand = await BrandService.getBrandByName(params.name);
  return generateBrandMetadata(brand);
}
```

### 사이트맵

`app/sitemap.xml/route.ts`에서 동적 생성

## 환경 변수

```env
# .env.local
NEXT_PUBLIC_API_URL_DEV=http://localhost:3001
NEXT_PUBLIC_API_URL_PROD=https://api.example.com
```

사용:

```typescript
// lib/defaultUrl.ts
const apiUrl = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_API_URL_PROD
  : process.env.NEXT_PUBLIC_API_URL_DEV;
```

## 주의사항

1. **Server Component 우선**: 가능하면 Server Component로 작성하고, 상태/이벤트가 필요할 때만 Client Component 사용
2. **타입 안전성**: `apiTypes.ts`의 자동 생성 타입 활용
3. **쿠키 인증**: 인증이 필요한 API는 `credentials: 'include'` 필수
4. **반응형**: 모바일 우선 디자인 (sm: → md: → lg:)
5. **접근성**: shadcn/ui의 Radix 컴포넌트 활용
