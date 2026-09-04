# Picker playground

An Expo Router example with one native route and a separate instructional web route. Native functionality requires an iOS or Android development build.

From the repository root:

```sh
bun install
bun example ios
bun example android
bun example web
bun example typecheck
bun example lint
bun example verify:structure
```

Use the multiple-selection switch with photos, videos, mixed media, all files, or PDFs. Request photo-library access to inspect the permission result. Selection returns handles; use a card's copy button to write bytes and see progress. The destination defaults to an absolute path under `Paths.cache`. Copying replaces the destination; change its name when keeping more than one copy.

`src/app` contains route entries and the Router stack. `src/screens` and `src/components` render the interface. `src/hooks/usePickerExample.ts` orchestrates state and operations, while `src/examples/picker-examples.ts` owns native API calls and filesystem paths. The web screen has no import path to the native module.

`app.config.ts` owns the scheme, Router plugin, and Photos usage description. Rebuild the development app after native/config changes. Real provider, cloud, permission, and lifecycle scenarios are listed in the repository's `docs/native-verification.md`.

## Native smoke tests

Install a native debug build first, then run:

```sh
bun run --cwd apps/example harness -- --harnessRunner ios
bun run --cwd apps/example harness -- --harnessRunner android
```

Harness validates native registration and API behavior without automating system picker selection. Override `HARNESS_IOS_DEVICE`, `HARNESS_IOS_VERSION`, or `HARNESS_ANDROID_DEVICE` for your installed simulator/emulator. The defaults follow the FileToolkit example. Real picker interaction remains a manual verification step.

Harness uses Jest file discovery without Watchman. The repository applies a pinned Harness startup patch for Expo 57; install dependencies with Bun so the patch is applied. The native smoke suite does not open system pickers or request permission.
