FROM node:22-slim AS base
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
WORKDIR /home/node/app

FROM base AS dev
COPY package.json package-lock.json ./
RUN npm ci
RUN cp -r node_modules /home/node/node_modules_backup
COPY docker/node/entrypoint-dev.sh /entrypoint-dev.sh
RUN chmod +x /entrypoint-dev.sh
ENTRYPOINT ["/entrypoint-dev.sh"]
CMD ["npm", "run", "dev"]

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci && npm prune --production

FROM base AS build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_OAUTH_42_CLIENTID
ENV NEXT_PUBLIC_OAUTH_42_CLIENTID=${NEXT_PUBLIC_OAUTH_42_CLIENTID}
RUN npm run build

FROM base AS prod
COPY --from=deps /home/node/app/node_modules ./node_modules
COPY --from=build /home/node/app/.next ./.next
COPY --from=build /home/node/app/public ./public
COPY --from=build /home/node/app/package.json ./
COPY --from=build /home/node/app/prisma ./prisma
USER node
EXPOSE 3000
CMD ["npm", "start"]
