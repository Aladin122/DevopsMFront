# Stage 1: Build the React app
FROM nginx:stable-alpine

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Print the variable to test it
RUN echo "VITE_API_URL=$VITE_API_URL" > /env-test.txt

COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
