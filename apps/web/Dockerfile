FROM node:22-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/web/package.json ./apps/web/

RUN corepack enable && corepack prepare pnpm@10.6.5 --activate
RUN pnpm install --frozen-lockfile --filter @open-franchise/web

FROM base AS builder
WORKDIR /app
ARG NEXT_PUBLIC_API_URL_PROD
ENV NEXT_PUBLIC_API_URL_PROD=$NEXT_PUBLIC_API_URL_PROD

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY .prettierrc ./
COPY apps/web ./apps/web

WORKDIR /app/apps/web
RUN corepack enable pnpm
RUN pnpm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "apps/web/server.js"]
