FROM node:22-slim AS base
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# ============================================
# Builder Stage: 모노레포 전체 빌드
# ============================================
FROM base AS builder
WORKDIR /app

# pnpm 설정
RUN corepack enable && corepack prepare pnpm@10.6.5 --activate

# 1단계: 워크스페이스 설정 파일 복사
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# 2단계: 모든 앱의 package.json 복사 (의존성 해결을 위해)
COPY apps/server/package.json ./apps/server/

# 3단계: 의존성 설치 (전체 워크스페이스 컨텍스트 유지)
RUN pnpm install --frozen-lockfile --filter @open-franchise/server...

# 4단계: 소스 코드 복사
COPY apps/server ./apps/server

# 5단계: Prisma 생성 및 빌드
WORKDIR /app/apps/server
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" pnpm prisma:generate
RUN pnpm build

# 6단계: Production 의존성만 설치
WORKDIR /app
RUN pnpm install --frozen-lockfile --filter @open-franchise/server... --prod

# ============================================
# Pruner Stage: 필요한 파일만 추출
# ============================================
FROM base AS pruner
WORKDIR /app

# 빌드 결과물 복사
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/prisma ./apps/server/prisma
COPY --from=builder /app/apps/server/package.json ./apps/server/package.json
COPY --from=builder /app/apps/server/prisma.config.ts ./apps/server/prisma.config.ts

# Production node_modules 복사 (모노레포 구조 유지)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/server/node_modules ./apps/server/node_modules

# 워크스페이스 설정 파일 복사
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# ============================================
# Runner Stage: 최종 실행 환경
# ============================================
FROM base AS runner
WORKDIR /app

# PM2 전역 설치
RUN npm install -g pm2

# Pruner에서 필요한 파일만 복사
COPY --from=pruner /app ./

# Prisma 클라이언트 생성 (런타임 최적화)
WORKDIR /app/apps/server
RUN npx prisma generate

EXPOSE 3000

# 마이그레이션 배포 후 실행
CMD ["/bin/sh", "-c", "npx prisma migrate deploy && npm run pm2:prod"]
