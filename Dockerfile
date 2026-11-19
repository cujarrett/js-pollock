FROM node:26-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5 AS build
WORKDIR /app
COPY package*.json .npmrc ./
RUN npm ci
COPY . .
RUN npm run build

# The platform base image already carries Alpine's security fixes.
FROM ghcr.io/cujarrett/base-nginx:1.31-alpine@sha256:5a496bb0fc48c56667dd14b68390213f35380810ad3a36e1c632a7702990394a
COPY --from=build /app/dist/js-pollock/browser /usr/share/nginx/html
EXPOSE 80
