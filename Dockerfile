
# syntax=docker/dockerfile:1

FROM node:20-alpine
WORKDIR /app

# Copy manifests first for better layer caching
COPY package*.json ./

# Use npm install (no lockfile required). Installs devDependencies too (needed for tests).
RUN npm install --no-audit --no-fund

# Copy source code
COPY src ./src
COPY __tests__ ./__tests__

EXPOSE 4001
CMD ["npm", "start"]