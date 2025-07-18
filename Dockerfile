# Stage 1: Build the app
FROM node:18-alpine AS builder

# Accept the build-time environment variable
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Set working directory
WORKDIR /app

# Copy app source
COPY . .

# Print the value to verify it gets injected (debug only, optional)
RUN echo "VITE_API_URL=$VITE_API_URL"

# Install dependencies
RUN npm install

# Build the app (Vite will use VITE_API_URL automatically)
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy the built files from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Optionally configure nginx (optional: if you need custom routing)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
