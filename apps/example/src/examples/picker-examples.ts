import { Paths } from 'expo-file-system';
import {
  documentPicker,
  mediaPicker,
  type MediaType,
  type PickedAsset,
  type PickedDocument,
} from 'react-native-nitro-media-picker';

export type SelectedItem = PickedAsset | PickedDocument;

export function defaultDestination(): string {
  return (
    decodeURIComponent(Paths.cache.uri.replace(/^file:\/\//, '')) +
    'picked-file'
  );
}

export function requestMediaPermission() {
  return mediaPicker.requestPermission();
}

export function pickMedia(mediaTypes: MediaType[], multiple: boolean) {
  return mediaPicker.pickAssets({
    mediaTypes,
    maxSelectionCount: multiple ? undefined : 1,
  });
}

export function pickFiles(pdfOnly: boolean, multiple: boolean) {
  return documentPicker.pickDocuments({
    mimeTypes: pdfOnly ? ['application/pdf'] : ['*/*'],
    allowMultiple: multiple,
  });
}

export function copySelection(
  item: SelectedItem,
  destination: string,
  onProgress: (fraction: number) => void,
) {
  return item.saveToFile(destination, onProgress);
}

export function describeSelection(item: SelectedItem) {
  return {
    key: 'uri' in item ? item.uri : item.id,
    name: item.fileName,
    details: `${item.mimeType ?? 'Unknown type'} · ${item.byteSize === undefined ? 'Unknown size' : `${item.byteSize} bytes`}`,
  };
}
