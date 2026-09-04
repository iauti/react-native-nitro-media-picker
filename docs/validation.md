# Extraction and validation report

Created 2026-09-05 as a separate repository beside `react-native-nitro-filetoolkit`. The original OneMimir working tree was left unchanged.

## Delivered

- Publishable package under `packages/react-native-nitro-media-picker`, preserving the original media API.
- New `documentPicker.pickDocuments()` and `PickedDocument` native handles on iOS and Android.
- MIME filters, single/multiple documents, cancellation results, provider metadata, and on-demand copying.
- iOS security-scoped document access and coordinated provider reads; Android openable document selection without broad storage permissions.
- Safe staged file replacement on both platforms. A failed copy no longer erases an existing destination.
- Android single-selection, registration, lifecycle cleanup, native build dependencies, and iOS dismissal/error handling corrected during extraction.
- Generated Nitro bindings, compiled CommonJS/declarations, Expo Router example using FileToolkit rules, API contract tests, native helper/Harness tests, CI, and release-it workflow.

## Verification

Baseline: Nitro/Nitrogen 0.37.1, React Native 0.86.3, Expo 57, Xcode 26.6, Android arm64.

- `bun check` / `bun check:ci`: code generation, package/example type checks, lint, example structure, TypeScript contract tests, JavaScript build, npm file manifest validation.
- Expo Router web export passed with the isolated native-only instructions page.
- `bun test:ios:helpers`: executable Swift tests cover MIME filters, copying, progress, invalid destinations, source aliases, atomic overwrite, and failed media-export cleanup.
- Android library `assembleDebug` and `testDebugUnitTest`: passed, seven JVM tests with zero failures.
- The actual npm tarball was unpacked and its compiled CommonJS entry loaded against a Nitro mock. Both roots request their expected native registration names. This is an export/packaging check, not a native runtime test.
- Full iOS example: `xcodebuild` Debug for the generic iOS Simulator destination passed after refreshing CocoaPods for the final source files.
- Full Android example: `:app:assembleDebug -PreactNativeArchitectures=arm64-v8a` passed.

The npm cache was redirected to a temporary directory for sandboxed packaging checks. No special cache setting is required by the repository.

## Remaining manual release checks

System picker UI, actual device/provider access, cloud downloads, permission changes, process recreation, and cross-picker overlap have not been exercised interactively. Follow [native-verification.md](native-verification.md). Installing the tarball into a separate native consumer and testing the supported-version matrix remain release checks.

Document selection does not implement directory picking, bookmarks/persisted access, save/export dialogs, or virtual-document conversion. iOS MIME filtering requires registered types and supports the wildcard groups documented in the API.

Nothing was published to npm or GitHub. GitHub URLs are intended IAUTI destinations, patterned after FileToolkit, and must be confirmed before release.

## FileToolkit conventions

The example uses `expo-router/entry`, a single Stack, route-only entry files, separate screens/components/hooks/examples, an `@/` alias, a web-only informational route, and conditional Harness Metro wiring. Repository tooling mirrors FileToolkit: hoisted Bun workspaces, `check:ci`, generated-code checks, lint, native CI, release-it package/root ownership, issue/PR templates, and community/release docs. No release command has been executed.
