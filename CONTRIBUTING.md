# Contributing

Install Bun, the iOS/Android development toolchains, and the native prerequisites for the example app. Start at the repository root:

```sh
bun install
bun check
bun example ios
bun example android
```

The example uses an Expo Router native development build. Run `bun example verify:structure` and `bun example lint` to verify its routing/layering and Expo lint rules. Native changes require rebuilding; Metro reload alone does not update Swift, Kotlin, C++, or generated native bindings.

## Layout

- `packages/react-native-nitro-media-picker/src`: public types, `.nitro.ts` specs, and direct Nitro root exports.
- `packages/react-native-nitro-media-picker/ios` and `android`: native implementation.
- `packages/react-native-nitro-media-picker/nitrogen/generated`: code generated from the specs; ship these bindings with the package.
- `packages/react-native-nitro-media-picker/tests`: compile-time public API regression tests.
- `apps/example`: Expo Router playground; route-only entries, render-only screens, orchestration hooks, and native API examples. The separate web route never imports the native module.
- `docs`: API, native verification, and release instructions.
- `scripts`: package verification tooling.

Change specs first when changing the contract, then run `bun specs` and implement the generated native interfaces. Do not patch generated bindings by hand. Only the factory roots are autolinked; selected-item handles are created by the native pickers.

Keep the entry point a barrel with direct Nitro root creation. Keep provider access and copying in native implementation files, orchestration in hooks/services, and example rendering in components. Preserve the existing media API when adding document features unless intentionally preparing a breaking release.

## Validation

`bun check` regenerates bindings, checks TypeScript, and checks the package contents. The TypeScript contract tests use `@ts-expect-error` to ensure invalid media kinds, missing document filters, wrong callback signatures, and writes to read-only metadata remain rejected.

Static checks do not prove native runtime behavior. Run [native verification](docs/native-verification.md) on both platforms, including a real cloud provider and a physical device, before releasing. Record device/OS versions and failures so the supported configuration is evidence-based.

See the [release checklist](docs/releasing.md) for publishing preparation. The repository does not publish merely by running its normal validation commands.
