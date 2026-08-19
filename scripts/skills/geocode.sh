#!/bin/bash

# Geocode a place name using the backend's /api/geocode endpoint
# Usage: bash scripts/skills/geocode.sh "place name" ["countrycode"]

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/common.sh"

if [ -z "$1" ]; then
  echo '{"error":"Uso: bash geocode.sh \"nombre del lugar\" [\"código país\"]"}' >&2
  exit 1
fi

check_backend

QUERY="$1"
COUNTRYCODE="${2:-}"

if [ -n "$COUNTRYCODE" ]; then
  PAYLOAD="{\"q\":\"$QUERY\",\"countrycode\":\"$COUNTRYCODE\"}"
else
  PAYLOAD="{\"q\":\"$QUERY\"}"
fi

curl -s -X POST http://localhost:3001/api/geocode \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD"
