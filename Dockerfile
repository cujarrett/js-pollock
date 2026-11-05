FROM node:26-alpine@sha256:c6ad9e9c1d80f6eb607c26b4b0a132ff7a2344fad1c78ea3baa2a7d4c8de6d94 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.31-alpine@sha256:785835ea65db4bba6f021acc0f3be91b0fef76a53fe41f8588c6698d2aed0606
# The base image lags behind Alpine security fixes.
# Updating here clears those CVEs without waiting for nginx to rebuild.
RUN apk upgrade --no-cache
COPY --from=build /app/dist/js-pollock/browser /usr/share/nginx/html
EXPOSE 80
