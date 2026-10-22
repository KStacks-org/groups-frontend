# Stage 1: Build
FROM node:24-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.30.3 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .
ARG VITE_API_URL
ARG VITE_CATALOG_TERM_CODE
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_CATALOG_TERM_CODE=${VITE_CATALOG_TERM_CODE}
RUN pnpm run build

# Stage 2: Production
FROM node:24-alpine AS runner

RUN corepack enable && corepack prepare pnpm@10.30.3 --activate

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/.output ./.output

CMD ["node", ".output/server/index.mjs"]