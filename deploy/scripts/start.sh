#!/bin/bash

# Pulse Observability - Start Script
# This script starts all Docker containers

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

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Pulse Observability - Start Script      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker is not running${NC}"
    exit 1
fi

# Change to deploy directory
cd "$DEPLOY_DIR"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    echo -e "${YELLOW}   Run: cp .env.example .env${NC}"
    exit 1
fi

# Parse command line arguments
DETACHED=""
BUILD=""
SERVICES=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--detach)
            DETACHED="-d"
            shift
            ;;
        --build)
            BUILD="--build"
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
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Usage: $0 [-d|--detach] [--build] [ui|server|alerting]"
            exit 1
            ;;
    esac
done

# Start containers
echo -e "${BLUE}🚀 Starting services...${NC}"
echo ""

if [ -z "$SERVICES" ]; then
    echo -e "${YELLOW}Starting all services...${NC}"
    docker-compose up $DETACHED $BUILD
else
    echo -e "${YELLOW}Starting services: $SERVICES${NC}"
    docker-compose up $DETACHED $BUILD $SERVICES
fi

# If running in detached mode, show status
if [ ! -z "$DETACHED" ]; then
    echo ""
    echo -e "${GREEN}✓ Services started in detached mode${NC}"
    echo ""
    echo -e "${BLUE}📊 Container status:${NC}"
    docker-compose ps
    echo ""
    echo -e "${BLUE}🔗 Access points:${NC}"
    echo -e "   UI:  ${GREEN}http://localhost:3000${NC}"
    echo -e "   API: ${GREEN}http://localhost:8080${NC}"
    echo ""
    echo -e "${BLUE}📝 View logs:${NC}"
    echo -e "   All:    ${GREEN}docker-compose logs -f${NC}"
    echo -e "   UI:     ${GREEN}docker-compose logs -f pulse-ui${NC}"
    echo -e "   Server: ${GREEN}docker-compose logs -f pulse-server${NC}"
fi

