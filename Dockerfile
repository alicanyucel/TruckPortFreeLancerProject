# Multi-stage build for Angular TruckPort application
# Stage 1: Build the Angular application
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with clean install
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the Angular application for production
RUN npm run build --prod

# Stage 2: Serve the application with Nginx
FROM nginx:alpine AS production

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application from build stage
COPY --from=build /app/dist/truck-port /usr/share/nginx/html

# Copy SSL certificates (if needed)
# COPY ssl/ /etc/nginx/ssl/

# Expose port 80 and 443
EXPOSE 80
EXPOSE 443

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
