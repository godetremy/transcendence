FROM node:24-alpine AS base
WORKDIR /home/node/app

FROM base AS dev
RUN npm ci && npm run prepare || true
CMD ["sh", "-c", "npm install && npm run dev"]

FROM base AS deps
COPY package.json package-lock.json ./
RUN apk add --no-cache git && \
	npm ci && \
	npm run prepare || true && \
	npm prune --production

FROM base AS build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Ensure build-time environment variables exist for Next.js prerendering.
# .env is excluded by .dockerignore; fall back to .env.example if present.
RUN [ -f .env ] || (if [ -f .env.example ]; then cp .env.example .env; fi)
RUN npm run build

FROM base AS prod
COPY --from=deps /home/node/app/node_modules ./node_modules
COPY --from=build /home/node/app/.next ./.next
COPY --from=build /home/node/app/public ./public
COPY --from=build /home/node/app/package.json ./
USER node
EXPOSE 3000
CMD ["npm", "start"]
