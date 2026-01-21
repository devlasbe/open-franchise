# API 타입 생성

서버의 Swagger 스키마에서 TypeScript 타입을 자동 생성합니다.

## 사전 조건

서버가 실행 중이어야 합니다:

```bash
pnpm dev:server
```

## 타입 생성

```bash
pnpm --filter @open-franchise/web swagger
```

또는:

```bash
cd apps/web
pnpm swagger
```

## 생성 결과

**파일 위치**: `apps/web/types/apiTypes.ts`

**포함 내용**:
- 모든 DTO 타입
- Request/Response 타입
- Enum 정의

## 사용 예시

```typescript
import {
  BrandResponseDto,
  LoginRequestDto,
  GetStatisticResponseDto,
} from '@/types/apiTypes';

// 서비스에서 타입 사용
const data: BrandResponseDto = await BrandService.getByName('치킨마루');
```

## Swagger 접근

- **UI**: http://localhost:3001/swagger
- **JSON**: http://localhost:3001/swagger-json

## 주의사항

- 서버 API가 변경되면 타입을 다시 생성해야 함
- 타입 파일은 자동 생성되므로 직접 수정하지 말 것
