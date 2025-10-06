#!/usr/bin/env bash
set -euo pipefail

URL="${1:-}"
FILE="${2:-}"
SECRET="${3:-}"

if [[ -z "$URL" || -z "$FILE" || -z "$SECRET" ]]; then
  echo "Usage: $0 <url> <json-file> <cron-secret>" >&2
  exit 2
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq not found; installing..."
  sudo apt-get update -y && sudo apt-get install -y jq
fi

echo "POST $URL"
HTTP_CODE=$(curl -s -o response.json -w "%{http_code}" -X POST "$URL"   -H "Authorization: Bearer $SECRET"   -H "Content-Type: application/json"   --data-binary "@${FILE}")

echo "HTTP $HTTP_CODE"
cat response.json || true
test "$HTTP_CODE" -ge 200 -a "$HTTP_CODE" -lt 300
