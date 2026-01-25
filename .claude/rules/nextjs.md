# Next.js 코딩 규칙

## 컴포넌트 패턴

### Server Component 우선

기본적으로 Server Component로 작성하고, 필요한 경우에만 Client Component 사용.

```typescript
// Server Component (기본)
export default async function BrandList() {
  const brands = await BrandService.getAll();
  return <ul>{brands.map(b => <li key={b.id}>{b.name}</li>)}</ul>;
}

// Client Component (상태/이벤트 필요 시)
'use client';
export default function SearchInput() {
  const [value, setValue] = useState('');
  return <input value={value} onChange={e => setValue(e.target.value)} />;
}
```

### Client Component 사용 조건

다음 경우에만 `'use client'` 사용:

- `useState`, `useEffect` 등 훅 사용
- 이벤트 핸들러 (`onClick`, `onChange` 등)
- 브라우저 API 접근 (`window`, `localStorage` 등)
- 외부 클라이언트 라이브러리 사용

## 타입 정의

### 네이밍 규칙 (필수)

모든 타입은 반드시 `xxxType` postfix를 사용합니다:

```typescript
// ✅ 올바른 예시
type CommentType = { id: string; content: string; };
type CommentsResponseType = { payload: CommentType[]; };
type CardPropsType = { title: string; children: React.ReactNode; };
type ButtonPropsType = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

// ❌ 금지
type Comment = { ... };       // Type postfix 누락
type CommentsResponse = { ... };
interface CardProps { ... };  // interface 대신 type 사용
```

### Props 타입

```typescript
// 기본 Props
type CardPropsType = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

// HTML 속성 확장 시
type ButtonPropsType = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
};
```

## 파일 구조

```
app/
├── layout.tsx          # 루트 레이아웃
├── page.tsx            # 홈 페이지
├── loading.tsx         # 로딩 UI
├── error.tsx           # 에러 UI
├── not-found.tsx       # 404 UI
└── [slug]/
    ├── page.tsx        # 동적 라우트 페이지
    └── layout.tsx      # 중첩 레이아웃 (필요 시)
```

## 데이터 페칭

### Server Component에서

```typescript
// 직접 서비스 호출
export default async function Page() {
  const data = await BrandService.getAll();
  return <BrandList data={data} />;
}

// revalidate 설정
export const revalidate = 3600; // 1시간마다 재검증
```

### Client Component에서

```typescript
'use client';

export default function SearchResults({ query }: { query: string }) {
  const [data, setData] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const result = await BrandService.search({ name: query, isClient: true });
        setData(result);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [query]);

  if (isLoading) return <Skeleton />;
  return <List data={data} />;
}
```

## 스타일링

> 디자인 품질이 중요한 UI 작업 시 `.claude/skills/frontend-design/SKILL.md` 스킬을 참조하세요.

### Tailwind 클래스 순서

1. 레이아웃 (display, position)
2. 박스 모델 (width, height, padding, margin)
3. 타이포그래피 (font, text)
4. 비주얼 (background, border, shadow)
5. 기타 (transition, animation)

```typescript
<div className="flex items-center justify-between w-full h-16 px-4 text-lg font-bold bg-white border-b shadow-sm transition-all">
```

### 조건부 스타일

```typescript
import { cn } from '@/lib/utils';

<button
  className={cn(
    'px-4 py-2 rounded-lg font-medium transition-colors',
    variant === 'primary' && 'bg-primary text-white hover:bg-primary/90',
    variant === 'secondary' && 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    disabled && 'opacity-50 cursor-not-allowed',
  )}
>
```

### 반응형 디자인 (필수)

> **모든 화면과 컴포넌트는 반드시 모바일 반응형을 고려해야 합니다.**

모바일 우선 접근:

```typescript
// 패딩/마진 반응형
<div className="px-4 sm:px-8 md:px-16 lg:px-24">

// 그리드 반응형
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

// 입력 폼 반응형
<div className="flex flex-col sm:flex-row gap-4">
  <Input className="w-full sm:w-48" />
  <Button className="w-full sm:w-auto">검색</Button>
</div>
```

### Dual Layout (테이블 → 카드)

데이터 목록은 모바일에서 카드, 데스크톱에서 테이블로 표시:

```typescript
{/* 모바일: 카드 */}
<div className="md:hidden space-y-3">
  {items.map((item) => (
    <Card key={item.id}>
      <CardContent className="p-4">...</CardContent>
    </Card>
  ))}
</div>

{/* 데스크톱: 테이블 */}
<div className="hidden md:block">
  <Table>...</Table>
</div>
```

## shadcn/ui 사용

```typescript
// 컴포넌트 import
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// 사용
<Button variant="outline" size="sm">
  클릭
</Button>
```

## 커스텀 훅 작성

```typescript
// hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

## 에러 처리

### Error Boundary

```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h2 className="text-xl font-bold">문제가 발생했습니다</h2>
      <Button onClick={reset}>다시 시도</Button>
    </div>
  );
}
```

### API 에러 처리

```typescript
try {
  const data = await fetchService({ path: 'brands', isClient: true });
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      router.push('/login');
    }
  }
}
```

## 메타데이터

```typescript
// app/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '홈 | Open Franchise',
  description: '프랜차이즈 정보 검색 서비스',
};

// 동적 메타데이터
export async function generateMetadata({ params }): Promise<Metadata> {
  const brand = await getBrand(params.name);
  return {
    title: `${brand.name} | Open Franchise`,
    description: brand.description,
  };
}
```

## 이미지 최적화

```typescript
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="로고"
  width={100}
  height={40}
  priority  // LCP 이미지인 경우
/>
```

## 금지 사항

- Server Component에서 `useState`, `useEffect` 사용 금지
- Client Component에서 async 함수 직접 사용 금지 (useEffect 내에서 호출)
- `document`, `window`를 Server Component에서 접근 금지
- 불필요한 `'use client'` 남발 금지
- **모바일 반응형 미고려 금지** - 모든 화면/컴포넌트는 모바일 대응 필수
- **타입 정의 시 `xxxType` postfix 누락 금지** - 모든 타입은 Type으로 끝나야 함
- `interface` 사용 금지 - `type` 키워드만 사용
