FROM node:26-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5 AS build
WORKDIR /app
COPY package*.json .npmrc ./
RUN npm ci
COPY . .
RUN npm run build

# The platform base image already carries Alpine's security fixes.
FROM ghcr.io/cujarrett/base-nginx:1.31-alpine@sha256:b7012eeaf6e201aba6a2de70c5b9d8d23a368e5c4ce1534b64240e39b8b81d16
COPY --from=build /app/dist/js-pollock/browser /usr/share/nginx/html
EXPOSE 80
