FROM node:22-slim AS base
# Trigger deployment
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

FROM base AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/server/package.json ./apps/server/

RUN corepack enable && corepack prepare pnpm@10.6.5 --activate
RUN pnpm install --frozen-lockfile --filter @open-franchise/server

COPY apps/server ./apps/server

WORKDIR /app/apps/server
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" pnpm prisma:generate
RUN pnpm build

FROM base AS runner
WORKDIR /app
RUN npm install -g pm2

COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/package.json ./
COPY --from=builder /app/apps/server/node_modules ./node_modules
COPY --from=builder /app/apps/server/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000
CMD ["/bin/sh", "-c", "npx prisma migrate deploy && npm run pm2:prod"]
