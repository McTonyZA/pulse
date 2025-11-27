#!/bin/bash
# ClickHouse Table Initialization Script
# This script ensures ClickHouse tables are created even if the container is recreated

set -e

echo "Waiting for ClickHouse to be ready..."
sleep 5

# Wait for ClickHouse to be fully ready
until clickhouse-client --host=clickhouse --user=pulse_user --password=pulse_password --query="SELECT 1" > /dev/null 2>&1; do
    echo "Waiting for ClickHouse..."
    sleep 2
done

echo "Creating ClickHouse tables..."
clickhouse-client --host=clickhouse --user=pulse_user --password=pulse_password --database=otel --multiquery < /init/clickhouse-otel-schema.sql
echo "✓ ClickHouse tables created successfully!"

