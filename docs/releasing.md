# First release checklist

The package is prepared for review and local builds. It has not been published by this extraction task. Repository URLs in package metadata are intended destinations; verify or create the GitHub repository before publishing.

- [ ] Confirm the npm name, IAUTI Labs ownership, version, license, repository URL, and access to the target npm account.
- [ ] Complete and record the [native verification scenarios](native-verification.md), including cloud providers and physical devices.
- [ ] Review peer dependencies against the native configurations actually tested; do not infer every supported combination from a broad version range.
- [ ] Run `bun install` and `bun check` from a clean checkout.
- [ ] Build and launch the example on iOS and Android.
- [ ] Inspect the tarball with `npm pack --dry-run` from `packages/react-native-nitro-media-picker`.
- [ ] Check that JavaScript, declarations, Swift/Kotlin/C++ sources, Nitrogen bindings, podspec, Android build files, README, and license are included; no credentials or development output should ship.
- [ ] Create a real tarball with `npm pack`, install it into a separate native app, and verify both picker roots and returned handles.
- [ ] Review the [API limitations](api.md), README examples, and cancellation/error behavior.
- [ ] Set the intended initial version and record release notes and tested native versions.
- [ ] Commit source and generated bindings; create the intended repository/tag using the maintainer's normal release workflow.
- [ ] Run `bun release <version>` only after all release gates pass. The package-level release publishes npm; root release-it then synchronizes versions/lockfile, commits, tags, and creates the GitHub release, matching FileToolkit. Pass the same explicit version through both phases.
- [ ] Install the published version in a clean consumer and smoke-test both platforms.

Normal `bun check`, build, and pack commands do not publish. Publication is a separate maintainer action. Automated static checks cannot replace the native verification above.

`bun release <version> --dry-run` previews the workflow but still requires configured repository/account access and runs its checks. No release command was run during extraction. Native projects are Expo-generated and ignored, so the release hook updates `bun.lock`; regenerate/install pods for native verification.
