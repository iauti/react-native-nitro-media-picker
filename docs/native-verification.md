# Native verification

Status: the following is a manual verification plan. Unchecked scenarios have not been verified through device/provider interaction. Build and static checks are separate evidence and do not imply these scenarios passed.

The extraction baseline uses Expo 57, React Native 0.86.3, and Nitro 0.37.1. Validation completed during extraction:

- iOS simulator app build.
- Android library and complete example `assembleDebug` for arm64, and seven JVM tests.
- Swift helper tests.
- Six iOS Harness native smoke tests on iPhone 16 Pro / iOS 18.5.
- TypeScript checks, including public API contract tests.
- npm tarball dry-run inspection, plus packed CommonJS export smoke test.

This does not establish compatibility with every version in the peer dependency ranges. A successful app build does not verify real provider access, cloud transfers, presentation, or device lifecycle behavior. A separate consumer installation from the actual tarball still needs verification.

Build and launch the example with `bun example ios` and `bun example android`. Record OS version, device/emulator, provider, result, and relevant logs for each scenario. Use at least one physical iOS and Android device before publishing.

## Picker flows

- [ ] Select a single photo, video, and mixed multi-selection; compare metadata and copied contents.
- [ ] Dismiss each picker without selection; verify a canceled result with an empty selection and no error screen.
- [ ] Reopen each picker repeatedly after selection, cancellation, and failure.
- [ ] Try overlapping calls, including media then document; verify predictable rejection without a stranded promise.
- [ ] iOS: test initial, granted, denied, and limited Photos access. Confirm usage-description prompt and behavior after changing access in Settings.
- [ ] Android: verify photo picking works without broad storage permissions.
- [ ] Background/resume the app while a picker is open; verify no duplicate or unresolved result.
- [ ] Android: rotate while selecting and exercise activity recreation; record current behavior.

## Documents and providers

- [ ] Pick local PDF, text, image, and unknown-extension files; inspect optional MIME type and size.
- [ ] Test `*/*`, `application/pdf`, and multiple MIME filters with single and multiple selection.
- [ ] Select zero-byte and large files; ensure zero is preserved and final bytes match the output.
- [ ] iOS: pick from Files/iCloud and another available provider; verify scoped access through `saveToFile()`.
- [ ] Android: pick from Downloads and a cloud document provider; verify copying a `content://` item.
- [ ] Android: verify virtual documents requiring conversion are excluded from the openable selection.
- [ ] Pick a cloud-only file with a network connection, then repeat offline. Record whether waiting/error occurs during picking or copying.
- [ ] Revoke access or remove a selected item before copying; verify a useful rejection.
- [ ] Restart the app; verify the UI does not pretend serialized provider URIs are durable handles.

## Copying

- [ ] Copy to an existing writable directory using an absolute path; compare output size and hash with the original.
- [ ] Repeat with an existing destination to verify replacement behavior.
- [ ] Reject relative paths, URI destinations, missing parent directories, and unwritable destinations without crashing.
- [ ] Confirm large copies keep the UI responsive and progress stays within 0–1 when emitted.
- [ ] Check providers with unknown size; do not require intermediate progress callbacks.
- [ ] Copy several selected items to distinct destinations; verify contents do not cross between handles.
- [ ] Interrupt connectivity during a cloud read; handle rejection and discard any unsuccessful output.
- [ ] Check cleanup and memory after repeatedly picking and releasing handles.

## Integration

- [ ] Build both platforms from a clean checkout with generated bindings included.
- [ ] Install an npm tarball into a separate React Native native app and build both platforms.
- [ ] Install the tarball into an Expo development build; confirm both Nitro roots autolink.
- [ ] Verify package import and type resolution under the consumer's supported Metro/TypeScript setup.
