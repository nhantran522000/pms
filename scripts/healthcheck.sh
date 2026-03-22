#!/bin/bash
# Health check script for PMS API
# Usage: ./scripts/healthcheck.sh [host]
# Exit codes: 0 = healthy, 1 = unhealthy

set -e

HOST="${1:-localhost}"
PORT="${2:-3000}"
TIMEOUT="${3:-10}"

URL="http://${HOST}:${PORT}/health"

echo "Checking health at ${URL}..."

response=$(curl -s -o /dev/null -w "%{http_code}" --max-time "${TIMEOUT}" "${URL}" || echo "000")

if [ "${response}" -eq 200 ]; then
    echo "Health check passed (HTTP ${response})"
    exit 0
else
    echo "Health check failed (HTTP ${response})"
    exit 1
fi
