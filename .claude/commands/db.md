# 데이터베이스 (Prisma)

Prisma를 사용한 데이터베이스 관리 명령어입니다.

## Prisma 클라이언트 생성

스키마 변경 후 클라이언트를 재생성합니다.

```bash
pnpm prisma:generate
```

## 마이그레이션

### 개발 환경

새 마이그레이션 생성 및 적용:

```bash
pnpm prisma:migrate:dev
```

마이그레이션 이름 지정:

```bash
cd apps/server
npx prisma migrate dev --name add_user_table
```

### 프로덕션 환경

마이그레이션 배포:

```bash
cd apps/server
pnpm migrate:prod
```

## Prisma Studio (GUI)

데이터베이스를 시각적으로 탐색:

```bash
cd apps/server
npx prisma studio
```

http://localhost:5555 에서 접근

## 스키마 동기화

DB를 스키마에 맞게 리셋 (데이터 삭제됨):

```bash
cd apps/server
npx prisma migrate reset
```

## 스키마 검증

```bash
cd apps/server
npx prisma validate
```

## 스키마 포맷팅

```bash
cd apps/server
npx prisma format
```

## 스키마 파일 위치

`apps/server/prisma/schema.prisma`

## 주의사항

- `migrate reset`은 모든 데이터를 삭제합니다
- 프로덕션에서는 `migrate deploy`만 사용
- 스키마 변경 후 항상 `prisma:generate` 실행
