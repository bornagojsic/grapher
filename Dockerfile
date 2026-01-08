# === Build stage ===
FROM node:24-alpine AS base

WORKDIR /app

# Copy deps
COPY package.json package-lock.json ./

# Install deps
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build


# === Production stage ===
FROM node:24-alpine AS production

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built files
COPY --from=base /app/dist ./dist

ENV PORT=6947
EXPOSE 6947

CMD ["serve", "-s", "dist", "-l", "6947"]
