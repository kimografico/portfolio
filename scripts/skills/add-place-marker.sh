#!/bin/bash

# Add a place marker to the map
# Usage: bash scripts/skills/add-place-marker.sh '{"name":"Luton Airport","country":"GB","lat":51.8747,"lon":-0.3683}'

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/common.sh"

if [ -z "$1" ]; then
  echo '{"error":"Uso: bash add-place-marker.sh '\''{"name":"...","country":"...","lat":...,"lon":..."}'\''"}' >&2
  exit 1
fi

check_backend
load_auth

curl -s -X POST http://localhost:3001/api/kimo/places-markers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH" \
  -d "$1"
