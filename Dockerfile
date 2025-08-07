# Multi-stage build for Angular TruckPort application with advanced optimizations
# Stage 1: Build the Angular application
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Add build tools for node-gyp
RUN apk add --no-cache python3 make g++ libc6-compat

# Copy package files first for better caching
COPY package*.json ./
COPY tsconfig*.json ./
COPY angular.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build the Angular application for production with advanced optimizations
RUN npm run build --configuration=production \
    --optimization=true \
    --build-optimizer=true \
    --aot=true \
    --vendor-chunk=true \
    --common-chunk=true \
    --source-map=false

# Stage 2: Serve the application with Nginx + advanced features
FROM nginx:alpine AS production

# Install security updates and additional tools
RUN apk update && apk upgrade && \
    apk add --no-cache openssl curl && \
    rm -rf /var/cache/apk/*

# Create nginx user for security
RUN addgroup -g 101 -S nginx-custom && \
    adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx-custom -g nginx nginx-custom

# Copy custom nginx configuration with security headers
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application from build stage
COPY --from=build /app/dist/truck-port /usr/share/nginx/html

# Create logs directory
RUN mkdir -p /var/log/nginx && \
    chown -R nginx-custom:nginx-custom /var/log/nginx

# Copy security and performance optimizations
COPY docker-configs/security-headers.conf /etc/nginx/conf.d/security-headers.conf

# Expose port 80 and 443
EXPOSE 80
EXPOSE 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
