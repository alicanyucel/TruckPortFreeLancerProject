# TruckPort Docker Deployment Guide

This document provides instructions for deploying the TruckPort Angular application using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose v2.0+
- Minimum 4GB RAM
- 10GB available disk space

## Quick Start

### 1. Build and Run the Application

```bash
# Clone the repository
git clone <repository-url>
cd TruckPort

# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 2. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **Database**: localhost:5432
- **Redis**: localhost:6379

### 3. Optional Monitoring

```bash
# Start with monitoring services
docker-compose --profile monitoring up -d

# Access monitoring
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3001 (admin/admin123)
```

## Services Overview

### Frontend (Angular + Nginx)
- **Port**: 80, 443
- **Health Check**: http://localhost/health
- **Features**: 
  - Production optimized build
  - Gzip compression
  - Security headers
  - SSL ready

### Backend (Node.js API)
- **Port**: 3000
- **Health Check**: http://localhost:3000/api/health
- **Features**:
  - RESTful API
  - CORS enabled
  - Request logging
  - Error handling

### Database (PostgreSQL)
- **Port**: 5432
- **Database**: truckport
- **User**: truckport_user
- **Features**:
  - Auto initialization
  - Performance indexes
  - Sample data

### Cache (Redis)
- **Port**: 6379
- **Features**:
  - Session storage
  - Caching layer
  - Pub/Sub ready

## Environment Configuration

### Production Environment

```bash
# Create environment file
cat > .env << EOF
NODE_ENV=production
DB_HOST=truckport-db
DB_PORT=5432
DB_NAME=truckport
DB_USER=truckport_user
DB_PASSWORD=secure_password_here
REDIS_HOST=truckport-redis
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret_here
EOF

# Use environment file
docker-compose --env-file .env up -d
```

### SSL Configuration

1. Place SSL certificates in `ssl/` directory:
   ```
   ssl/
   ├── cert.pem
   └── key.pem
   ```

2. Uncomment SSL configuration in `nginx.conf`
3. Uncomment SSL volume mount in `docker-compose.yml`

## Development Mode

### Hot Reload Development

```bash
# Start only database and redis
docker-compose up -d truckport-db truckport-redis

# Run Angular in development mode
npm start

# Run backend in development mode (if needed)
cd backend && npm run dev
```

### Override for Development

```yaml
# docker-compose.override.yml
version: '3.8'
services:
  truckport-frontend:
    volumes:
      - ./src:/app/src:ro
    environment:
      - NODE_ENV=development
    command: ["npm", "start"]
```

## Scaling and Load Balancing

### Scale Frontend

```bash
# Scale to 3 frontend instances
docker-compose up -d --scale truckport-frontend=3

# Use load balancer (nginx)
cat > nginx-lb.conf << EOF
upstream frontend {
    server truckport-frontend_1:80;
    server truckport-frontend_2:80;
    server truckport-frontend_3:80;
}

server {
    listen 80;
    location / {
        proxy_pass http://frontend;
    }
}
EOF
```

## Monitoring and Logging

### View Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs truckport-frontend

# Follow logs
docker-compose logs -f --tail=100
```

### Health Checks

```bash
# Check all service health
docker-compose ps

# Manual health checks
curl http://localhost/health
curl http://localhost:3000/api/health
```

## Backup and Restore

### Database Backup

```bash
# Backup database
docker-compose exec truckport-db pg_dump -U truckport_user truckport > backup.sql

# Restore database
docker-compose exec -T truckport-db psql -U truckport_user truckport < backup.sql
```

### Volume Backup

```bash
# Backup all volumes
docker run --rm -v truckport_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change port mappings in `docker-compose.yml`
2. **Memory issues**: Increase Docker memory limit
3. **Permission errors**: Check file permissions and Docker daemon access

### Reset Everything

```bash
# Stop and remove all containers, networks, volumes
docker-compose down -v --remove-orphans

# Remove all images
docker-compose down --rmi all

# Start fresh
docker-compose up -d --build
```

### Debug Container

```bash
# Enter container shell
docker-compose exec truckport-frontend sh
docker-compose exec truckport-backend sh
docker-compose exec truckport-db psql -U truckport_user truckport
```

## Performance Optimization

### Production Optimizations

1. **Use multi-stage builds** ✅ (Already implemented)
2. **Enable gzip compression** ✅ (Already configured)
3. **Add caching headers** ✅ (Already configured)
4. **Use nginx for static files** ✅ (Already implemented)
5. **Health checks** ✅ (Already configured)

### Resource Limits

```yaml
# Add to docker-compose.yml services
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
    reservations:
      cpus: '0.25'
      memory: 256M
```

## Security Considerations

1. **Change default passwords** in production
2. **Use environment variables** for secrets
3. **Enable SSL/TLS** in production
4. **Restrict network access** with firewall rules
5. **Regular security updates** for base images
6. **Scan images** for vulnerabilities

```bash
# Scan for vulnerabilities
docker scout cves truckport-frontend
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to server
        run: |
          docker-compose pull
          docker-compose up -d --build
```

This deployment setup provides a production-ready, scalable, and maintainable Docker environment for the TruckPort application.
