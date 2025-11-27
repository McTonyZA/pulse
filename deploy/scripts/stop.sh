#!/bin/bash

# Pulse Observability - Stop Script
# This script stops all Docker containers

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
echo -e "${BLUE}║   Pulse Observability - Stop Script       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Change to deploy directory
cd "$DEPLOY_DIR"

# Parse command line arguments
REMOVE_VOLUMES=""
SERVICES=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -v|--volumes)
            REMOVE_VOLUMES="-v"
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
            echo "Usage: $0 [-v|--volumes] [ui|server|alerting]"
            exit 1
            ;;
    esac
done

# Stop containers
echo -e "${BLUE}🛑 Stopping services...${NC}"
echo ""

if [ -z "$SERVICES" ]; then
    if [ ! -z "$REMOVE_VOLUMES" ]; then
        echo -e "${YELLOW}Stopping all services and removing volumes...${NC}"
        docker-compose down $REMOVE_VOLUMES
    else
        echo -e "${YELLOW}Stopping all services...${NC}"
        docker-compose down
    fi
else
    echo -e "${YELLOW}Stopping services: $SERVICES${NC}"
    docker-compose stop $SERVICES
fi

echo ""
echo -e "${GREEN}✓ Services stopped successfully${NC}"

