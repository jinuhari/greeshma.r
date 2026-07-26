#!/bin/bash
cd "$(dirname "$0")"
pnpm dev &
echo "Waiting for server to start..."
while ! curl -s http://localhost:8080 > /dev/null 2>&1; do
  sleep 1
done
open -a "Safari" http://localhost:8080
