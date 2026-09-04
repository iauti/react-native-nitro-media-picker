#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
test_dir=$(mktemp -d "${TMPDIR:-/tmp}/nitro-picker-tests.XXXXXX")
trap 'rm -rf "$test_dir"' EXIT
xcrun swiftc -module-cache-path "$test_dir/cache" \
  packages/react-native-nitro-media-picker/ios/MediaPickerError.swift \
  packages/react-native-nitro-media-picker/ios/MediaFileDestination.swift \
  packages/react-native-nitro-media-picker/ios/Documents/DocumentPickerError.swift \
  packages/react-native-nitro-media-picker/ios/Documents/DocumentContentTypes.swift \
  packages/react-native-nitro-media-picker/ios/Documents/DocumentFileCopy.swift \
  tests/ios/DocumentHelpersTests.swift -o "$test_dir/tests"
"$test_dir/tests"
