# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS builder
WORKDIR /app

# Enable pnpm via Corepack
RUN corepack enable \
  && corepack prepare pnpm@10.19.0 --activate

# Install workspace dependencies with pnpm using a two-phase copy to leverage Docker layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/site/package.json apps/site/
RUN pnpm install --frozen-lockfile

# Copy the rest of the repository and build the Astro site
COPY . .
RUN pnpm --filter site build

FROM nginx:1.27-alpine AS runner
LABEL org.opencontainers.image.source="https://github.com/theschoonover/webpage"

# Copy hardened nginx configuration and static assets
COPY infra/nginx/site.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/site/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
