#!/usr/bin/env bash

# Run via: npm run invoke:curl
# Hits the deployed HTTP API (no AWS credentials required).

set -euo pipefail

DEPLOYED_URL="https://8qyltr090f.execute-api.us-east-1.amazonaws.com"

echo "=== searchLocations ==="
curl -X GET "${DEPLOYED_URL}/search-locations?searchKey=road" -s | jq
echo

echo "=== getTrams ==="
curl -X GET "${DEPLOYED_URL}/trams?atcoCode=9400ZZMASTW" -s | jq
echo
