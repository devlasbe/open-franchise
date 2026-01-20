FROM node:22-slim AS base

RUN apt-get update && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

# ============================================
# Builder Stage: 모노레포 전체 빌드
# ============================================
FROM base AS builder
WORKDIR /app

# pnpm 설정
RUN corepack enable && corepack prepare pnpm@10.6.5 --activate

# 워크스페이스 설정 파일 복사
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/server/package.json ./apps/server/

# 의존성 설치
RUN pnpm install --frozen-lockfile --filter @open-franchise/server...

# 소스 코드 복사
COPY apps/server ./apps/server

# Prisma 생성 및 빌드
WORKDIR /app/apps/server
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" pnpm prisma:generate
RUN pnpm build

# ============================================
# Runner Stage: 최종 실행 환경
# ============================================
FROM base AS runner
WORKDIR /app

RUN npm install -g pm2

# builder에서 전체 복사
COPY --from=builder /app ./

WORKDIR /app/apps/server

EXPOSE 3000

CMD ["/bin/sh", "-c", "npx prisma migrate deploy && npm run pm2:prod"]
