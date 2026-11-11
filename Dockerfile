FROM node:26-alpine@sha256:c6ad9e9c1d80f6eb607c26b4b0a132ff7a2344fad1c78ea3baa2a7d4c8de6d94 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# The platform base image already carries Alpine's security fixes.
FROM ghcr.io/cujarrett/base-spa:nginx1.31-alpine@sha256:a5e096d54c04b6543c25e45b26334e3a2f8533b571bf50e0dd02b66fb7c4e84a
COPY --from=build /app/dist/js-pollock/browser /usr/share/nginx/html
EXPOSE 80
