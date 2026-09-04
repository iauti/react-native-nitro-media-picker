#!/usr/bin/env bash

set -euo pipefail

(
  cd packages/react-native-nitro-media-picker
  bun release "$@"
)
bun run release-it "$@"
