#!/bin/bash

# Add a book to the library
# Usage: bash scripts/skills/add-book.sh '{"title":"...","author":"...","language":"...","cover":"...","dateRead":"...","genre":"...","isbn":"...","series":"...","synopsis":"..."}'

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/common.sh"

if [ -z "$1" ]; then
  echo '{"error":"Uso: bash add-book.sh '\''{"title":"...","author":"...","language":"...","cover":"...","dateRead":"..."}'\''"}' >&2
  exit 1
fi

check_backend
load_auth

curl -s -X POST http://localhost:3001/api/kimo/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH" \
  -d "$1"
