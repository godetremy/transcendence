FROM node:22-slim AS base
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
WORKDIR /home/node/app

# ── DEV ──
FROM base AS dev
COPY package.json package-lock.json ./
RUN npm ci
RUN cp -r node_modules /home/node/node_modules_backup
RUN chown -R node:node /home/node/app
COPY docker/node/entrypoint-dev.sh /entrypoint-dev.sh
RUN chmod +x /entrypoint-dev.sh
USER node
ENTRYPOINT ["/entrypoint-dev.sh"]
CMD ["npm", "run", "dev"]

# ── DEPS ──
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ── BUILDER ──
FROM base AS builder
COPY --from=deps /home/node/app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_OAUTH_42_CLIENTID
ENV NEXT_PUBLIC_OAUTH_42_CLIENTID=${NEXT_PUBLIC_OAUTH_42_CLIENTID}
ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
RUN npm run build

# ── RUNNER ──
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /home/node/app/public ./public
COPY --from=builder --chown=node:node /home/node/app/.next/standalone ./
COPY --from=builder --chown=node:node /home/node/app/.next/static ./.next/static
COPY --from=builder /home/node/app/src/database/prisma ./src/database/prisma
COPY --from=builder /home/node/app/package.json ./

USER node
EXPOSE 3000
CMD HOSTNAME="0.0.0.0" node server.js
