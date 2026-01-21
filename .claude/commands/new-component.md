# Next.js 새 컴포넌트 생성

Next.js 프로젝트에 새 컴포넌트를 추가하는 가이드입니다.

## Server Component (기본)

데이터 페칭이 필요한 컴포넌트:

`components/[ComponentName].tsx`:

```typescript
import { BrandService } from '@/services/brand';

type [ComponentName]Props = {
  id: string;
  title?: string;
};

export default async function [ComponentName]({ id, title }: [ComponentName]Props) {
  const data = await BrandService.getById(id);

  return (
    <div className="flex flex-col gap-4 p-4">
      {title && <h2 className="text-h2 font-bold">{title}</h2>}
      <div>{data.name}</div>
    </div>
  );
}
```

## Client Component

상태나 이벤트가 필요한 컴포넌트:

`components/[ComponentName].tsx`:

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

type [ComponentName]Props = {
  initialValue?: string;
  onSubmit?: (value: string) => void;
};

export default function [ComponentName]({
  initialValue = '',
  onSubmit
}: [ComponentName]Props) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = () => {
    onSubmit?.(value);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="px-4 py-2 border rounded-lg"
      />
      <Button onClick={handleSubmit}>제출</Button>
    </div>
  );
}
```

## UI 컴포넌트 (shadcn/ui 스타일)

`components/ui/[component-name].tsx`:

```typescript
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const [componentName]Variants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface [ComponentName]Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof [componentName]Variants> {}

const [ComponentName] = React.forwardRef<HTMLDivElement, [ComponentName]Props>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn([componentName]Variants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
[ComponentName].displayName = '[ComponentName]';

export { [ComponentName], [componentName]Variants };
```

## 페이지 컴포넌트

`app/[route]/page.tsx`:

```typescript
import { Metadata } from 'next';
import { MyComponent } from '@/components/MyComponent';

export const metadata: Metadata = {
  title: '페이지 제목 | Open Franchise',
  description: '페이지 설명',
};

export default async function [RouteName]Page() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-h1 font-bold mb-8">페이지 제목</h1>
      <MyComponent />
    </main>
  );
}
```

## 체크리스트

- [ ] Props 타입 정의
- [ ] Server/Client 컴포넌트 구분
- [ ] 반응형 스타일 적용
- [ ] 접근성 고려 (aria 속성)
- [ ] 에러 처리 (필요 시)
