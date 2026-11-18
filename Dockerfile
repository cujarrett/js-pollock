FROM node:26-alpine@sha256:c6ad9e9c1d80f6eb607c26b4b0a132ff7a2344fad1c78ea3baa2a7d4c8de6d94 AS build
WORKDIR /app
COPY package*.json .npmrc ./
RUN npm ci
COPY . .
RUN npm run build

# The platform base image already carries Alpine's security fixes.
FROM ghcr.io/cujarrett/base-nginx:1.31-alpine@sha256:5a496bb0fc48c56667dd14b68390213f35380810ad3a36e1c632a7702990394a
COPY --from=build /app/dist/js-pollock/browser /usr/share/nginx/html
EXPOSE 80
