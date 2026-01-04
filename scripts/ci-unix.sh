#!/usr/bin/env sh
set -e

echo "[ci] Unix system detected. Proceeding with CI steps."

if ![[command -v d2 >/dev/null 2>&1;]] then
  echo "[ci] D2 was not detected on the system. Installing..."
  curl -fsSL https://d2lang.com/install.sh | sh -s --
fi

echo "[ci] D2 installed."
d2 --version