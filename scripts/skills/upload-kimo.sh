#!/bin/bash

# Upload an image to a Kimo collection (books, illustrations, etc.)
# Usage: bash scripts/skills/upload-kimo.sh <collection> <title> <filepath>
# Example: bash scripts/skills/upload-kimo.sh books "mi-libro" "/path/to/cover.jpg"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/common.sh"

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
  echo '{"error":"Uso: bash upload-kimo.sh <collection> <title> <filepath>"}' >&2
  exit 1
fi

check_backend
load_auth

COLLECTION="$1"
TITLE="$2"
FILEPATH="$3"

if [ ! -f "$FILEPATH" ]; then
  echo "{\"error\":\"Archivo no encontrado: $FILEPATH\"}" >&2
  exit 1
fi

curl -s -X POST http://localhost:3001/api/kimo/upload \
  -H "Authorization: Bearer $AUTH" \
  -F "collection=$COLLECTION" \
  -F "title=$TITLE" \
  -F "images=@$FILEPATH"
