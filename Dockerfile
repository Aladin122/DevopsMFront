FROM nginx:stable-alpine

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
COPY dist/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
