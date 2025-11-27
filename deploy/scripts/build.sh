#!/bin/bash

# Pulse Observability - Build Script
# This script builds all Docker images for the Pulse platform

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"
ROOT_DIR="$(dirname "$DEPLOY_DIR")"

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Pulse Observability - Build Script      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker is not running${NC}"
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Error: docker-compose is not installed${NC}"
    exit 1
fi

# Change to deploy directory
cd "$DEPLOY_DIR"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Warning: .env file not found${NC}"
    echo -e "${YELLOW}   Creating .env from .env.example...${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ Created .env file${NC}"
        echo -e "${YELLOW}   Please review and update .env with your actual values${NC}"
    else
        echo -e "${RED}❌ Error: .env.example not found${NC}"
        exit 1
    fi
fi

# Parse command line arguments
BUILD_ARGS=""
SERVICES=""
NO_CACHE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --no-cache)
            NO_CACHE="--no-cache"
            shift
            ;;
        --parallel)
            BUILD_ARGS="$BUILD_ARGS --parallel"
            shift
            ;;
        ui|pulse-ui)
            SERVICES="$SERVICES pulse-ui"
            shift
            ;;
        server|pulse-server)
            SERVICES="$SERVICES pulse-server"
            shift
            ;;
        alerting|pulse-alerting)
            SERVICES="$SERVICES pulse-alerting"
            shift
            ;;
        all)
            SERVICES=""
            shift
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Usage: $0 [--no-cache] [--parallel] [ui|server|alerting|all]"
            exit 1
            ;;
    esac
done

# Build images
echo -e "${BLUE}📦 Building Docker images...${NC}"
echo ""

if [ -z "$SERVICES" ]; then
    echo -e "${YELLOW}Building all services...${NC}"
    docker-compose build $NO_CACHE $BUILD_ARGS
else
    echo -e "${YELLOW}Building services: $SERVICES${NC}"
    docker-compose build $NO_CACHE $BUILD_ARGS $SERVICES
fi

# Check build status
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   ✓ Build completed successfully!         ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}📋 Built images:${NC}"
    docker-compose images
    echo ""
    echo -e "${BLUE}🚀 Next steps:${NC}"
    echo -e "   1. Review your .env file"
    echo -e "   2. Run: ${GREEN}docker-compose up${NC} to start services"
    echo -e "   3. Access UI at: ${GREEN}http://localhost:3000${NC}"
    echo -e "   4. Access API at: ${GREEN}http://localhost:8080${NC}"
else
    echo ""
    echo -e "${RED}╔════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║   ❌ Build failed!                         ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}💡 Troubleshooting tips:${NC}"
    echo -e "   1. Check Docker daemon is running"
    echo -e "   2. Ensure you have enough disk space"
    echo -e "   3. Try: ${GREEN}docker-compose build --no-cache${NC}"
    echo -e "   4. Check logs above for specific errors"
    exit 1
fi

