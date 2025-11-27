#!/bin/bash

# Pulse Observability - Logs Script
# This script shows logs from Docker containers

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

# Change to deploy directory
cd "$DEPLOY_DIR"

# Parse command line arguments
FOLLOW="-f"
TAIL=""
SERVICE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --no-follow)
            FOLLOW=""
            shift
            ;;
        --tail)
            TAIL="--tail=$2"
            shift 2
            ;;
        ui|pulse-ui)
            SERVICE="pulse-ui"
            shift
            ;;
        server|pulse-server)
            SERVICE="pulse-server"
            shift
            ;;
        alerting|pulse-alerting)
            SERVICE="pulse-alerting"
            shift
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Usage: $0 [--no-follow] [--tail N] [ui|server|alerting]"
            exit 1
            ;;
    esac
done

# Show logs
if [ -z "$SERVICE" ]; then
    echo -e "${BLUE}📋 Showing logs for all services...${NC}"
    docker-compose logs $FOLLOW $TAIL
else
    echo -e "${BLUE}📋 Showing logs for $SERVICE...${NC}"
    docker-compose logs $FOLLOW $TAIL $SERVICE
fi

