#!/bin/bash

# TruckPort Production Deployment Script
# This script deploys the TruckPort application to production

set -e

echo "🚛 TruckPort Production Deployment Started..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="truckport"
IMAGE_NAME="truckport"
CONTAINER_NAME="truckport-app"
PORT="80"
SSL_PORT="443"

# Step 1: Clean previous builds
echo -e "${BLUE}📦 Cleaning previous builds...${NC}"
rm -rf dist/
rm -rf node_modules/.cache/
docker system prune -f

# Step 2: Install dependencies
echo -e "${BLUE}📋 Installing dependencies...${NC}"
npm ci --production=false

# Step 3: Run security audit
echo -e "${YELLOW}🔒 Running security audit...${NC}"
npm audit --audit-level high

# Step 4: Run linting
echo -e "${YELLOW}🔍 Running linting...${NC}"
npm run lint

# Step 5: Run tests
echo -e "${YELLOW}🧪 Running tests...${NC}"
npm run test:ci

# Step 6: Build for production
echo -e "${BLUE}🏗️ Building for production...${NC}"
npm run build --configuration=production

# Step 7: Build Docker image
echo -e "${BLUE}🐳 Building Docker image...${NC}"
docker build -t ${IMAGE_NAME}:latest .
docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:$(date +%Y%m%d_%H%M%S)

# Step 8: Stop existing container
echo -e "${YELLOW}⏹️ Stopping existing container...${NC}"
docker stop ${CONTAINER_NAME} 2>/dev/null || true
docker rm ${CONTAINER_NAME} 2>/dev/null || true

# Step 9: Start new container
echo -e "${GREEN}🚀 Starting new container...${NC}"
docker run -d \
  --name ${CONTAINER_NAME} \
  --restart unless-stopped \
  -p ${PORT}:80 \
  -p ${SSL_PORT}:443 \
  --memory="1g" \
  --cpus="1" \
  -e NODE_ENV=production \
  ${IMAGE_NAME}:latest

# Step 10: Health check
echo -e "${BLUE}🏥 Performing health check...${NC}"
sleep 10

if curl -f http://localhost:${PORT} > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Deployment successful! Application is running on port ${PORT}${NC}"
    echo -e "${GREEN}🌐 Access your app at: http://localhost:${PORT}${NC}"
else
    echo -e "${RED}❌ Deployment failed! Application is not responding${NC}"
    exit 1
fi

# Step 11: Show container status
echo -e "${BLUE}📊 Container status:${NC}"
docker ps | grep ${CONTAINER_NAME}

echo -e "${GREEN}🎉 TruckPort Production Deployment Completed Successfully!${NC}"
echo -e "${BLUE}📋 Summary:${NC}"
echo -e "  - Application: ${PROJECT_NAME}"
echo -e "  - Container: ${CONTAINER_NAME}"
echo -e "  - HTTP Port: ${PORT}"
echo -e "  - HTTPS Port: ${SSL_PORT}"
echo -e "  - Status: Running"
echo -e "  - Health: ✅ Healthy"

# Optional: Show logs
read -p "Do you want to see application logs? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}📝 Application logs:${NC}"
    docker logs ${CONTAINER_NAME} --tail 50
fi
