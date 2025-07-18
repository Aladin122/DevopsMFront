# Stage 1: Build the React app with Vite
FROM node:18 AS builder

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy built app to Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: debug env var
RUN echo "VITE_API_URL=$VITE_API_URL" > /usr/share/nginx/html/env.txt

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
