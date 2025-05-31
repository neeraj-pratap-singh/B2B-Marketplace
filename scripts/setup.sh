#!/bin/bash

# B2B Marketplace Setup Script
# This script automates the complete setup process

set -e  # Exit on any error

echo "🚀 B2B Marketplace - Automated Setup"
echo "====================================="
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check Node.js
    if ! command_exists node; then
        log_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node --version | cut -d 'v' -f 2 | cut -d '.' -f 1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    # Check npm
    if ! command_exists npm; then
        log_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    # Check if Docker is available (optional)
    if command_exists docker; then
        DOCKER_AVAILABLE=true
        log_success "Docker detected"
    else
        DOCKER_AVAILABLE=false
        log_warning "Docker not detected (optional)"
    fi
    
    log_success "Prerequisites check completed"
}

# Setup environment
setup_environment() {
    log_info "Setting up environment..."
    
    if [ ! -f ".env.local" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env.local
            log_success "Created .env.local from template"
        else
            # Create basic .env.local
            cat > .env.local << EOF
MONGODB_URI=mongodb://localhost:27017/b2b-marketplace
NEXTAUTH_SECRET=setup-script-generated-secret-key-$(date +%s)
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
EOF
            log_success "Created .env.local with default values"
        fi
    else
        log_warning ".env.local already exists, skipping creation"
    fi
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    log_success "Dependencies installed"
}

# Setup database
setup_database() {
    log_info "Setting up database..."
    
    # Ask user for database preference
    echo
    echo "Choose database setup option:"
    echo "1) Docker MongoDB (recommended)"
    echo "2) Local MongoDB (must be pre-installed)"
    echo "3) Skip database setup (I'll configure it manually)"
    echo
    read -p "Enter your choice (1-3): " db_choice
    
    case $db_choice in
        1)
            if [ "$DOCKER_AVAILABLE" = true ]; then
                log_info "Starting MongoDB with Docker..."
                docker-compose up -d mongodb
                
                # Wait for MongoDB to be ready
                log_info "Waiting for MongoDB to be ready..."
                sleep 10
                
                # Check if MongoDB is running
                if docker ps | grep -q mongodb; then
                    log_success "MongoDB is running in Docker"
                else
                    log_error "Failed to start MongoDB with Docker"
                    return 1
                fi
            else
                log_error "Docker is not available. Please choose option 2 or 3."
                return 1
            fi
            ;;
        2)
            log_info "Assuming local MongoDB is running..."
            # Test MongoDB connection
            if command_exists mongosh; then
                if mongosh --eval "db.runCommand({ connectionStatus: 1 })" >/dev/null 2>&1; then
                    log_success "Local MongoDB connection successful"
                else
                    log_warning "Cannot connect to local MongoDB. Please ensure it's running."
                fi
            else
                log_warning "mongosh not found. Cannot verify MongoDB connection."
            fi
            ;;
        3)
            log_warning "Skipping database setup. Please configure MongoDB manually."
            return 0
            ;;
        *)
            log_error "Invalid choice. Please run the script again."
            return 1
            ;;
    esac
}

# Seed database
seed_database() {
    log_info "Seeding database with 100 sample listings..."
    
    # Give MongoDB some time to be fully ready
    sleep 5
    
    if npm run seed; then
        log_success "Database seeded successfully with 100 listings"
    else
        log_error "Failed to seed database. You can try running 'npm run seed' manually later."
        return 1
    fi
}

# Start application
start_application() {
    log_info "Setup completed! Starting the application..."
    echo
    log_success "🎉 Setup completed successfully!"
    echo
    echo "Application will be available at:"
    echo "📱 Local: http://localhost:3000"
    echo "🌐 Network: http://$(hostname -I | awk '{print $1}'):3000"
    echo
    echo "To stop the application, press Ctrl+C"
    echo "To restart later, run: npm run dev"
    echo
    
    # Start the development server
    npm run dev
}

# Main setup flow
main() {
    echo "Starting automated setup process..."
    echo
    
    check_prerequisites
    echo
    
    setup_environment
    echo
    
    install_dependencies
    echo
    
    setup_database
    echo
    
    if [ $? -eq 0 ]; then
        seed_database
        echo
        
        if [ $? -eq 0 ]; then
            start_application
        else
            echo
            log_warning "Setup completed with warnings. You can start the app with: npm run dev"
        fi
    else
        echo
        log_error "Setup failed during database configuration."
        echo "Please check the error messages above and try again."
        exit 1
    fi
}

# Handle script interruption
trap 'echo && log_warning "Setup interrupted by user"' INT

# Run main function
main

# Usage information
echo
echo "📚 Additional commands:"
echo "  npm run dev          - Start development server"
echo "  npm run build        - Build for production"
echo "  npm run seed         - Re-seed database"
echo "  docker-compose up -d - Start with Docker"
echo
echo "📖 For detailed setup guide, see SETUP.md" 