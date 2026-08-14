FROM node:26-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run build

FROM node:26-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/build ./build
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
RUN mkdir -p /app/build/public/uploads/gallery /app/build/public/uploads/news /app/build/public/uploads/documents \
  && chown -R node:node /app
USER node
WORKDIR /app/build
EXPOSE 3333
CMD ["node", "bin/server.js"]
