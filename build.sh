#!/usr/bin/env bash
set -e

echo "Building app..."
podman run --rm -v "$(pwd)":/app:z -w /app node:22-alpine sh -c "npm run build"

git st

read -rp "Stage all changes with 'git add .'? [y/N] " confirm_add
if [[ "$confirm_add" != "y" && "$confirm_add" != "Y" ]]; then
  echo "Aborted."
  exit 1
fi

git add .

read -rp "Commit with message 'New build'? [y/N] " confirm_commit
if [[ "$confirm_commit" != "y" && "$confirm_commit" != "Y" ]]; then
  echo "Aborted."
  exit 1
fi

git cm "New build"


read -rp "Push? [y/N] " confirm_push
if [[ "$confirm_push" != "y" && "$confirm_commit" != "Y" ]]; then
  echo "Aborted."
  exit 1
fi
