# API reference

Import runtime roots and types from `react-native-nitro-media-picker`. The roots are Nitro HybridObjects; selected items are native handles returned by those roots.

## Documents

```ts
const result = await documentPicker.pickDocuments({
  mimeTypes: ['*/*'],
  allowMultiple: false,
});
```

`mimeTypes` is required and must contain at least one MIME type. `*/*` accepts all supported openable files; specific values such as `application/pdf` restrict the chooser. `allowMultiple` defaults to `false`. System providers determine which files they expose and how they report metadata.

On iOS, specific MIME types must resolve to a registered, non-dynamic Uniform Type Identifier. Unknown types reject before presenting the picker. Supported wildcard filters are `*/*`, `image/*`, `video/*`, `audio/*`, and `text/*`; other wildcard groups reject. Android accepts syntactically valid MIME types and wildcard groups, subject to provider support. Use `*/*` when users need to select files whose types iOS does not recognize.

The result has `isCanceled: boolean` and `documents: PickedDocument[]`. Dismissal resolves with `isCanceled: true` and an empty array. Operational errors reject the promise; handle these separately from cancellation. Avoid presenting another picker while one is open.

A `PickedDocument` has these read-only properties:

| Property | Type | Meaning |
| --- | --- | --- |
| `uri` | `string` | Provider URL/URI; not a portable local filesystem path |
| `fileName` | `string` | Provider name or implementation fallback; treat as untrusted display metadata |
| `mimeType` | `string \| undefined` | Content type, when discoverable |
| `byteSize` | `number \| undefined` | Reported size, when available; zero means an empty file |

Do not construct storage paths directly from `fileName`. Choose an app-owned name and keep display metadata separately.

```ts
const bytesWritten = await document.saveToFile(absoluteDestinationPath);
```

On iOS, documents are opened in place through security-scoped URLs and read through the native handle. Android uses the Storage Access Framework with `CATEGORY_OPENABLE` and transient access. Keep the handle alive until copying finishes. Do not persist a handle or assume its URI remains readable after an app restart. Copy to app-owned storage if the app needs long-term access.

The library does not copy document bytes into app storage merely to return the selection. A system provider may still materialize or download the file during picking or reading. Provider/network failures can therefore occur at either stage. There is no directory selection, save-as dialog, bookmark API, persistable grant API, or conversion for Android virtual documents.

## Media

`mediaPicker.getPermissionStatus()` and `mediaPicker.requestPermission()` return `Promise<PermissionStatus>`, where the status is `not-determined`, `granted`, `limited`, or `denied`. On Android the system photo picker does not require a separate broad library permission. On iOS the asset workflow uses Photos library access, including limited access.

```ts
const result = await mediaPicker.pickAssets({
  mediaTypes: ['image', 'video'],
  maxSelectionCount: 5,
});
```

`mediaTypes` is a nonempty array of `image` and/or `video`. `maxSelectionCount`, if provided, must be a positive integer; omission uses the platform maximum. The result has `isCanceled` and `assets: PickedAsset[]`, in the order returned by the system.

A `PickedAsset` exposes read-only `id`, `fileName`, `mimeType`, `mediaType`, and optional `byteSize`. Selection returns handles before the library copies bytes. `saveToFile()` performs the actual export, including cloud retrieval when necessary. A handle can become unreadable if the asset is deleted or its access changes.

## Copying and progress

Both item types expose:

```ts
saveToFile(
  destinationPath: string,
  onProgress?: (fraction: number) => void,
): Promise<number>
```

Pass an absolute filesystem path in an existing directory the app can write to. Do not pass a `file://` URL or a document provider URI as the destination. An existing destination file is replaced; select a new app-owned filename when preservation matters. The resolved number is the number of bytes written.

Progress is a fraction from 0 to 1, not a percentage or a guaranteed frequency. A provider may omit the total size, and callbacks may be sparse. Use the resolved byte count as the successful completion result. There is no cancellation or resumable-copy API. Avoid throwing from progress callbacks or starting simultaneous writes to the same destination. On failure, do not use the destination as a successful copy; callers should clean up failed outputs when appropriate.

These APIs require native React Native execution. Importing the runtime entry point in Node.js or a web browser is unsupported. Type-only imports can be used without constructing Nitro objects.
