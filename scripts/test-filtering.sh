#!/usr/bin/env bash

# Manual checks for getTrams departure filtering (serviceIds + towards).
# Usage: bash scripts/test-filtering.sh [1|2|3]

LABEL_1="All departures at St Werburgh's Road (no filter)"
LABEL_2="Pink line towards ends at St Werburgh's Road"
LABEL_3="Pink/Navy lines towards ends at Firswood"

invoke_get_trams() {
  local label="$1"
  local atco_code="$2"
  local service_ids="${3:-}"
  local towards="${4:-}"

  echo "$label"

  local payload='{"queryStringParameters": {"atcoCode": "'"$atco_code"'"'
  if [ -n "$service_ids" ]; then
    payload+=', "serviceIds": "'"$service_ids"'"'
  fi
  if [ -n "$towards" ]; then
    payload+=', "towards": "'"$towards"'"'
  fi
  payload+='}}'

  npx serverless invoke local \
    -f getTrams \
    -d "$payload"
  echo
}

case "${1:-}" in
  1)
    invoke_get_trams "$LABEL_1" "9400ZZMASTW"
    ;;

  2)
    invoke_get_trams "$LABEL_2" "9400ZZMASTW" "Pink_Line" "ends"
    ;;

  3)
    invoke_get_trams "$LABEL_3" "9400ZZMAFIR" "Pink_Line,Navy_Line" "ends"
    ;;

  *)
    echo "Usage: bash scripts/test-filtering.sh [1|2|3]"
    echo
    echo "  1  $LABEL_1"
    echo "  2  $LABEL_2"
    echo "  3  $LABEL_3"
    exit 1
    ;;
esac
