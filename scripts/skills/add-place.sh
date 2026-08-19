#!/bin/bash

# Add a place to the travel diary
# Usage: bash scripts/skills/add-place.sh '{"city":"London","place":"Luton Airport","country":"gb","date":"2024","people":""}'

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/common.sh"

if [ -z "$1" ]; then
  echo '{"error":"Uso: bash add-place.sh '\''{"city":"...","place":"...","country":"...","date":"...","people":"..."}'\''"}' >&2
  exit 1
fi

check_backend
load_auth

curl -s -X POST http://localhost:3001/api/kimo/places \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH" \
  -d "$1"
