FROM node:22-slim AS base

RUN apt-get update && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

FROM base AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm i --frozen-lockfile

COPY . .

RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" pnpm prisma:generate
RUN pnpm build

FROM base AS runner
WORKDIR /app

RUN npm install -g pm2

COPY --from=builder /app .

EXPOSE 3000

CMD ["/bin/sh", "-c", "npx prisma migrate deploy && npm run pm2:prod"]