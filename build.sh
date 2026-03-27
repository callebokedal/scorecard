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

read -rp "Commit message (empty to abort): " commit_msg
if [[ -z "$commit_msg" ]]; then
  echo "Aborted."
  exit 1
fi

git cm "$commit_msg"


read -rp "Push? [Y/n] " confirm_push
if [[ "$confirm_push" == "n" || "$confirm_push" == "N" ]]; then
  echo "Skipped push."
  exit 0
fi

git push