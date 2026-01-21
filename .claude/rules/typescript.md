# TypeScript 코딩 규칙

## 타입 정의

### type vs interface

- **`type` 키워드 선호**: 일반적인 타입 정의에는 `type` 사용
- **`interface`는 확장이 필요한 경우에만**: 클래스 구현이나 선언 병합이 필요할 때

```typescript
// Good: type 사용
type UserProps = {
  name: string;
  email: string;
};

// Good: 확장이 필요한 경우 interface
interface Repository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
}
```

### 명시적 타입 선언

- 함수 반환 타입은 명시적으로 선언
- 변수 타입은 추론 가능하면 생략 가능

```typescript
// Good: 반환 타입 명시
async function getUser(id: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { id } });
}

// Good: 추론 가능한 경우 생략
const name = 'John';  // string으로 추론
const count = items.length;  // number로 추론
```

### any 사용 최소화

- `any` 대신 `unknown` 사용 검토
- 불가피한 경우 `// eslint-disable-next-line` 주석과 함께 사용

```typescript
// Bad
function parse(data: any) { ... }

// Good
function parse(data: unknown) {
  if (typeof data === 'string') {
    // 타입 가드 후 사용
  }
}
```

## 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 파일 (일반) | camelCase | `userService.ts`, `authGuard.ts` |
| 파일 (컴포넌트) | PascalCase | `SearchInput.tsx`, `Header.tsx` |
| 변수/함수 | camelCase | `getUserById`, `isLoggedIn` |
| 상수 | UPPER_SNAKE_CASE | `API_URL`, `MAX_RETRY` |
| 타입/인터페이스 | PascalCase | `UserDto`, `BrandResponse` |
| Enum | PascalCase (값은 UPPER_SNAKE) | `UserRole.ADMIN` |

## Import 순서

1. Node.js 내장 모듈
2. 외부 라이브러리 (React, NestJS 등)
3. 내부 모듈 (절대 경로)
4. 상대 경로 모듈
5. 타입 import

```typescript
// Node.js 내장
import { readFile } from 'fs/promises';

// 외부 라이브러리
import { Injectable } from '@nestjs/common';
import { useState } from 'react';

// 내부 모듈 (절대 경로)
import { PrismaService } from '@/prisma/prisma.service';
import { Button } from '@/components/ui/button';

// 상대 경로
import { BrandService } from './brand.service';

// 타입
import type { User, Brand } from '@/types';
```

## 에러 처리

```typescript
// 커스텀 에러 클래스 활용
class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = 'NotFoundError';
  }
}

// try-catch에서 타입 가드 사용
try {
  await doSomething();
} catch (error) {
  if (error instanceof NotFoundError) {
    // 특정 에러 처리
  }
  throw error;  // 알 수 없는 에러는 다시 던짐
}
```

## 비동기 처리

- `async/await` 선호 (Promise chain 대신)
- 병렬 실행이 가능하면 `Promise.all` 사용

```typescript
// Good: async/await
async function fetchData() {
  const user = await getUser();
  const posts = await getPosts(user.id);
  return { user, posts };
}

// Good: 병렬 실행
async function fetchAllData() {
  const [users, categories] = await Promise.all([
    getUsers(),
    getCategories(),
  ]);
  return { users, categories };
}
```

## Null 처리

- Optional chaining (`?.`) 활용
- Nullish coalescing (`??`) 활용

```typescript
// Good
const userName = user?.profile?.name ?? 'Unknown';

// Good: 조기 반환
function process(data: Data | null) {
  if (!data) return null;
  // data는 이제 Data 타입
  return data.value;
}
```
