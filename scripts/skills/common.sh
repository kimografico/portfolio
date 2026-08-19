#!/bin/bash

# Common helper for skill scripts
# Source this file and call load_auth + check_backend before running your logic

load_auth() {
  AUTH=$(grep KIMO_PASSWORD_HASH .env | cut -d'=' -f2)
  if [ -z "$AUTH" ]; then
    echo '{"error":"KIMO_PASSWORD_HASH no encontrado en .env"}' >&2
    exit 1
  fi
}

check_backend() {
  curl -s http://localhost:3001/health > /dev/null 2>&1 || {
    echo '{"error":"Backend no disponible en localhost:3001. Ejecuta: pnpm backend"}' >&2
    exit 1
  }
}
