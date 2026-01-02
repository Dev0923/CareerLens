# ---- Build client ----
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client .
RUN npm run build

# ---- Server runtime ----
FROM node:20-alpine AS server
WORKDIR /app/server
ENV NODE_ENV=production
# Install server deps
COPY server/package*.json ./
RUN npm install --omit=dev
# Copy server source
COPY server/src ./src
COPY server/.env.example ./.env.example
# Copy root config for auth store
WORKDIR /app
COPY config.yaml ./config.yaml
# Copy built client
COPY --from=client-build /app/client/dist ./client/dist
WORKDIR /app/server
EXPOSE 4000
CMD ["node", "src/index.js"]
