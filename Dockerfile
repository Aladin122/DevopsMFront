# Stage 1: Build the React app
FROM node:18 AS builder

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# ❗ Redéfinir ARG pour avoir accès à VITE_API_URL dans ce stage aussi
ARG VITE_API_URL

# Optional: dump the var for debug
RUN echo "VITE_API_URL=${VITE_API_URL}" > /env.txt

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
