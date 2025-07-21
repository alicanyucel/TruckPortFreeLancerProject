#!/bin/bash

# TruckPort Docker Quick Deploy Script
# This script provides easy deployment options for the TruckPort application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_status "Docker and Docker Compose are installed."
}

# Check if ports are available
check_ports() {
    local ports=(80 443 3000 5432 6379)
    for port in "${ports[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            print_warning "Port $port is already in use. Please stop the service using this port."
        fi
    done
}

# Build and start services
deploy_production() {
    print_header "DEPLOYING TRUCKPORT - PRODUCTION MODE"
    
    print_status "Building Docker images..."
    docker-compose build --no-cache
    
    print_status "Starting services..."
    docker-compose up -d
    
    print_status "Waiting for services to be ready..."
    sleep 30
    
    # Health checks
    print_status "Checking service health..."
    
    # Check frontend
    if curl -f http://localhost/health >/dev/null 2>&1; then
        print_status "✅ Frontend is healthy"
    else
        print_error "❌ Frontend health check failed"
    fi
    
    # Check backend
    if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
        print_status "✅ Backend is healthy"
    else
        print_error "❌ Backend health check failed"
    fi
    
    # Check database
    if docker-compose exec -T truckport-db pg_isready -U truckport_user >/dev/null 2>&1; then
        print_status "✅ Database is healthy"
    else
        print_error "❌ Database health check failed"
    fi
    
    print_header "DEPLOYMENT COMPLETE"
    echo ""
    echo "🌐 Frontend: http://localhost"
    echo "🔧 Backend API: http://localhost:3000"
    echo "📊 Database: localhost:5432"
    echo "⚡ Redis: localhost:6379"
    echo ""
    echo "📋 View logs: docker-compose logs -f"
    echo "🛑 Stop services: docker-compose down"
}

# Start with monitoring
deploy_with_monitoring() {
    print_header "DEPLOYING TRUCKPORT WITH MONITORING"
    
    print_status "Building Docker images..."
    docker-compose build --no-cache
    
    print_status "Starting services with monitoring..."
    docker-compose --profile monitoring up -d
    
    print_status "Waiting for services to be ready..."
    sleep 45
    
    print_header "DEPLOYMENT WITH MONITORING COMPLETE"
    echo ""
    echo "🌐 Frontend: http://localhost"
    echo "🔧 Backend API: http://localhost:3000"
    echo "📊 Prometheus: http://localhost:9090"
    echo "📈 Grafana: http://localhost:3001 (admin/admin123)"
    echo ""
}

# Development mode
deploy_development() {
    print_header "DEPLOYING TRUCKPORT - DEVELOPMENT MODE"
    
    print_status "Starting only database and redis for development..."
    docker-compose up -d truckport-db truckport-redis
    
    print_status "Waiting for services to be ready..."
    sleep 15
    
    print_status "✅ Development services are ready"
    echo ""
    echo "📊 Database: localhost:5432"
    echo "⚡ Redis: localhost:6379"
    echo ""
    echo "💡 Run 'npm start' to start Angular development server"
    echo "💡 Backend API will be available at localhost:3000 when started"
}

# Stop all services
stop_services() {
    print_header "STOPPING TRUCKPORT SERVICES"
    
    print_status "Stopping all services..."
    docker-compose down
    
    print_status "✅ All services stopped"
}

# Reset everything
reset_all() {
    print_header "RESETTING TRUCKPORT DEPLOYMENT"
    
    print_warning "This will remove all containers, networks, and volumes!"
    read -p "Are you sure? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Stopping and removing all services..."
        docker-compose down -v --remove-orphans
        
        print_status "Removing Docker images..."
        docker-compose down --rmi all 2>/dev/null || true
        
        print_status "✅ Reset complete"
    else
        print_status "Reset cancelled"
    fi
}

# Show service status
show_status() {
    print_header "TRUCKPORT SERVICE STATUS"
    
    echo ""
    docker-compose ps
    echo ""
    
    print_status "Service Health:"
    
    # Frontend health
    if curl -f http://localhost/health >/dev/null 2>&1; then
        echo "🟢 Frontend: Healthy"
    else
        echo "🔴 Frontend: Unhealthy"
    fi
    
    # Backend health
    if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
        echo "🟢 Backend: Healthy"
    else
        echo "🔴 Backend: Unhealthy"
    fi
    
    # Database health
    if docker-compose exec -T truckport-db pg_isready -U truckport_user >/dev/null 2>&1; then
        echo "🟢 Database: Healthy"
    else
        echo "🔴 Database: Unhealthy"
    fi
}

# View logs
view_logs() {
    print_header "TRUCKPORT SERVICE LOGS"
    
    if [ $# -eq 0 ]; then
        docker-compose logs -f --tail=100
    else
        docker-compose logs -f --tail=100 "$1"
    fi
}

# Backup database
backup_database() {
    print_header "BACKING UP DATABASE"
    
    local backup_file="truckport_backup_$(date +%Y%m%d_%H%M%S).sql"
    
    print_status "Creating database backup..."
    docker-compose exec -T truckport-db pg_dump -U truckport_user truckport > "$backup_file"
    
    print_status "✅ Database backed up to: $backup_file"
}

# Show help
show_help() {
    echo "TruckPort Docker Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  production   Deploy in production mode (default)"
    echo "  monitoring   Deploy with monitoring (Prometheus + Grafana)"
    echo "  development  Deploy only database and redis for development"
    echo "  stop         Stop all services"
    echo "  status       Show service status and health"
    echo "  logs [service] View logs (optionally for specific service)"
    echo "  backup       Backup database"
    echo "  reset        Reset everything (removes all data)"
    echo "  help         Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 production"
    echo "  $0 logs truckport-frontend"
    echo "  $0 status"
}

# Main script logic
main() {
    check_docker
    check_ports
    
    case "${1:-production}" in
        "production")
            deploy_production
            ;;
        "monitoring")
            deploy_with_monitoring
            ;;
        "development"|"dev")
            deploy_development
            ;;
        "stop")
            stop_services
            ;;
        "status")
            show_status
            ;;
        "logs")
            view_logs "${2:-}"
            ;;
        "backup")
            backup_database
            ;;
        "reset")
            reset_all
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
