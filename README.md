# react-native-nitro-media-picker

Native photo, video, and document picking for React Native, powered by [Nitro Modules](https://nitro.margelo.com/). Picked items are native handles; copy their bytes to an app-owned file when you need them.

This repository extracts the existing media picker from OneMimir and adds a separate document picker. It is prepared for a first release; real-device/provider interaction validation and npm publication are still required. See the [release checklist](docs/releasing.md) and [validation report](docs/validation.md).

## Install

Once published:

```sh
bun add react-native-nitro-media-picker react-native-nitro-modules
```

For development before publication, use the included example or a local package dependency. Install iOS pods in a bare React Native app and rebuild the native app on both platforms. Expo apps require a native development build; Expo Go cannot load this module.

## Pick documents

```ts
import { documentPicker } from 'react-native-nitro-media-picker';

const result = await documentPicker.pickDocuments({
  mimeTypes: ['application/pdf', 'text/plain'],
  allowMultiple: true,
});

if (!result.isCanceled) {
  const document = result.documents[0];
  if (document) {
    // Supply a unique absolute path in an existing app-writable directory.
    const bytes = await document.saveToFile(destinationPath, fraction => {
      console.log(fraction);
    });
    console.log(document.fileName, bytes);
  }
}
```

`destinationPath` comes from your app's filesystem layer. It is a filesystem path, not a `file://` URL. An existing destination is replaced. See [API and lifecycle details](docs/api.md) before relying on provider URIs or progress reporting.

## Pick photos and videos

```ts
import { mediaPicker } from 'react-native-nitro-media-picker';

const permission = await mediaPicker.requestPermission();
if (permission === 'granted' || permission === 'limited') {
  const result = await mediaPicker.pickAssets({
    mediaTypes: ['image', 'video'],
    maxSelectionCount: 10,
  });

  if (!result.isCanceled) {
    for (const asset of result.assets) {
      console.log(asset.id, asset.fileName, asset.mediaType);
      // Later: await asset.saveToFile(uniqueAbsoluteDestinationPath);
    }
  }
}
```

The media API is preserved from the extracted package. iOS needs a photo-library usage description and access to the selected Photos assets. Configure `NSPhotoLibraryUsageDescription` in your app's native configuration (Expo: `ios.infoPlist`), using a clear explanation for your users. Android uses the system photo picker without a broad storage permission request.

## Scope

| Workflow | API |
| --- | --- |
| Photos and videos | `mediaPicker.pickAssets()` → `PickedAsset[]` |
| Files and documents | `documentPicker.pickDocuments()` → `PickedDocument[]` |
| Copy a selected item to app storage | `item.saveToFile()` → bytes written |
| User dismisses selection | Resolved result with `isCanceled: true` |

On iOS, MIME filters must resolve to registered types; supported wildcard groups are `*/*`, `image/*`, `video/*`, `audio/*`, and `text/*`. Unknown types reject. Android accepts valid MIME filters subject to provider support.

Document handles expose a provider URI, name, optional MIME type, and optional size. Keep the native handle alive and use its `saveToFile()` method to read it. Access is session-scoped; serializing a URI does not preserve it. On iOS the system provider may download an item during selection, so document selection is not guaranteed to avoid I/O.

This release does not provide directory picking, a save dialog, durable URI permissions, iOS bookmarks, or virtual document conversion. Android limits document selection to openable files. The document workflow was inspired by [react-native-documents/document-picker](https://github.com/react-native-documents/document-picker); it is an independent Nitro implementation, not an API-compatible replacement.

## Develop

```sh
bun install
bun check
bun example ios
bun example android
```

`packages/react-native-nitro-media-picker` contains the publishable package, native implementations, and generated Nitrogen bindings. `apps/example` contains an Expo Router playground with photos, videos, documents, copy progress, and an instructional web route. See [contributing](CONTRIBUTING.md), the [API reference](docs/api.md), and [native verification scenarios](docs/native-verification.md).

MIT, IAUTI Labs.
