FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.31-alpine
COPY --from=build /app/dist/js-pollock/browser /usr/share/nginx/html
EXPOSE 80
