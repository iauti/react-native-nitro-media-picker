import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const cwd = fileURLToPath(
  new URL('../packages/react-native-nitro-media-picker/', import.meta.url),
);
const manifest = JSON.parse(readFileSync(`${cwd}/package.json`, 'utf8'));
const [pack] = JSON.parse(
  execFileSync('npm', ['pack', '--dry-run', '--ignore-scripts', '--json'], {
    cwd,
    encoding: 'utf8',
  }),
);
const files = new Set(pack.files.map((file) => file.path));
for (const path of [
  'lib/index.js',
  'lib/index.d.ts',
  'src/index.ts',
  'LICENSE',
  'README.md',
  'NitroMediaPicker.podspec',
  'react-native.config.js',
  'nitro.json',
  'android/build.gradle',
  'android/fix-prefab.gradle',
  'android/CMakeLists.txt',
  'android/src/main/cpp/cpp-adapter.cpp',
  'android/src/main/java/com/margelo/nitro/nitromediapicker/NitroMediaPickerPackage.kt',
  'nitrogen/generated/ios/NitroMediaPicker+autolinking.rb',
  'nitrogen/generated/android/NitroMediaPicker+autolinking.gradle',
  'nitrogen/generated/android/NitroMediaPicker+autolinking.cmake',
])
  assert(files.has(path), `Missing packed file: ${path}`);
for (const prefix of [
  'nitrogen/generated/shared/',
  'nitrogen/generated/ios/swift/',
  'nitrogen/generated/android/kotlin/',
]) {
  assert(
    [...files].some((file) => file.startsWith(prefix)),
    `Missing bindings: ${prefix}`,
  );
}
assert(!manifest.private);
assert(!manifest.scripts.postinstall, 'Consumers must not need Nitrogen');
assert(
  !/workspace:|catalog:/.test(JSON.stringify(manifest)),
  'Published manifest must be standalone',
);
assert(
  ![...files].some((file) =>
    /node_modules|\.tsbuildinfo|\.cxx\/|android\/build\//.test(file),
  ),
);
console.log(
  `Package validated: ${files.size} files, ${pack.unpackedSize} unpacked bytes.`,
);
