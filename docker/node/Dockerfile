FROM node:22-slim AS base
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
WORKDIR /home/node/app

# ── DEV ──
FROM base AS dev
COPY package.json package-lock.json ./
RUN npm ci
RUN cp -r node_modules /home/node/node_modules_backup
COPY docker/node/entrypoint-dev.sh /entrypoint-dev.sh
RUN chmod +x /entrypoint-dev.sh
ENTRYPOINT ["/entrypoint-dev.sh"]
CMD ["npm", "run", "dev"]

# ── DEPS ──
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci && npm prune --production

# ── BUILD ──
FROM base AS build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_OAUTH_42_CLIENTID
ENV NEXT_PUBLIC_OAUTH_42_CLIENTID=${NEXT_PUBLIC_OAUTH_42_CLIENTID}
ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
RUN npm run build

# ── PROD ──
FROM base AS prod
ENV NODE_ENV=production
COPY --from=deps /home/node/app/node_modules ./node_modules
COPY --from=build /home/node/app/.next/standalone ./
COPY --from=build /home/node/app/.next/static ./.next/static
COPY --from=build /home/node/app/public ./public
COPY --from=build /home/node/app/src/database/prisma ./src/database/prisma
COPY --from=build /home/node/app/package.json ./
USER node
EXPOSE 3000
CMD ["node", "server.js"]
