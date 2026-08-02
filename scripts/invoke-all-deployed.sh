#!/usr/bin/env bash

# Run via: npm run invoke:deployed
# Requires AWS credentials and a deployed stack.

set -euo pipefail

export SLS_AWS_SDK=3

echo "=== searchLocations ==="
serverless invoke -f searchLocations -d '{"queryStringParameters": {"searchKey": "road"}}'
echo

echo "=== getTrams ==="
serverless invoke -f getTrams -d '{"queryStringParameters": {"atcoCode": "9400ZZMASTW"}}'
echo
