#!/usr/bin/env bash

# Run via: npm run invoke:local

set -euo pipefail

export SLS_AWS_SDK=3

echo "=== searchLocations ==="
serverless invoke local -f searchLocations -d '{"queryStringParameters": {"searchKey": "road"}}'
echo

echo "=== getTrams ==="
serverless invoke local -f getTrams -d '{"queryStringParameters": {"atcoCode": "9400ZZMASTW"}}'
echo
