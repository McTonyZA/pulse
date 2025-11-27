#!/bin/bash

# Reset Databases Script
# This script removes all database volumes and restarts services
# Use this when you want to start fresh with clean databases

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"

cd "$DEPLOY_DIR"

echo "⚠️  WARNING: This will delete ALL database data!"
echo "This includes:"
echo "  - MySQL data (pulse_db)"
echo "  - ClickHouse data (otel database)"
echo ""
read -p "Are you sure you want to continue? (yes/no): " -r
echo

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "❌ Aborted"
    exit 1
fi

echo "🛑 Stopping all services..."
docker-compose down

echo "🗑️  Removing database volumes..."
docker volume rm deploy_mysql-data deploy_clickhouse-data 2>/dev/null || true

echo "🚀 Starting services (init scripts will run automatically)..."
docker-compose up -d

echo ""
echo "✅ Databases reset complete!"
echo ""
echo "⏳ Waiting for services to initialize..."
sleep 10

echo ""
echo "📊 Checking database status..."
echo ""
echo "MySQL tables:"
docker exec pulse-mysql mysql -uroot -ppulse_root_password pulse_db -e "SHOW TABLES;" 2>/dev/null || echo "  (MySQL still initializing...)"

echo ""
echo "ClickHouse tables:"
docker exec pulse-clickhouse clickhouse-client --query "SHOW TABLES FROM otel" 2>/dev/null || echo "  (ClickHouse still initializing...)"

echo ""
echo "💡 If tables are not shown above, wait a minute and run:"
echo "   docker-compose ps"
echo "   docker logs pulse-mysql"
echo "   docker logs pulse-clickhouse"

