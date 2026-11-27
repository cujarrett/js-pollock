FROM node:26-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5 AS build
WORKDIR /app
COPY package*.json .npmrc ./
RUN npm ci
COPY . .
RUN npm run build

# The platform base image already carries Alpine's security fixes.
FROM ghcr.io/cujarrett/base-nginx:1.31-alpine@sha256:8a5df7fb081bbe170c362303c899a10ee94046a6ccb3a55783336ad87fd218e6
COPY --from=build /app/dist/js-pollock/browser /usr/share/nginx/html
EXPOSE 80
