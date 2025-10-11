
# syntax=docker/dockerfile:1

FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src ./src
COPY __tests__ ./__tests__

EXPOSE 4000
CMD ["npm", "start"]
