# Stage 1: Build
FROM node:18 AS builder

WORKDIR /app
COPY . .

# Install and build with VITE_API_URL provided externally
RUN npm install
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
