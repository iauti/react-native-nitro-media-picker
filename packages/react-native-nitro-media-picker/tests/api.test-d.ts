import { documentPicker, mediaPicker } from '../src';
import type { PickedAsset, PickedDocument } from '../src';

// Compile-only: never execute this file; imports construct native Nitro roots.
async function acceptsSupportedWorkflows(destinationPath: string) {
  const permission = await mediaPicker.getPermissionStatus();
  const status: 'not-determined' | 'granted' | 'limited' | 'denied' = permission;
  const media = await mediaPicker.pickAssets({
    mediaTypes: ['image', 'video'],
    maxSelectionCount: 3,
  });
  const assets: PickedAsset[] = media.assets;
  const documents = await documentPicker.pickDocuments({
    mimeTypes: ['application/pdf', 'text/plain'],
    allowMultiple: true,
  });
  const items: PickedDocument[] = documents.documents;
  const canceled: boolean = documents.isCanceled;
  for (const document of items) {
    const uri: string = document.uri;
    const name: string = document.fileName;
    const mimeType: string | undefined = document.mimeType;
    const size: number | undefined = document.byteSize;
    const copied: number = await document.saveToFile(destinationPath, fraction => {
      const progress: number = fraction;
    });
  }
  await documentPicker.pickDocuments({ mimeTypes: ['*/*'] });
}

function rejectsInvalidContracts(asset: PickedAsset, document: PickedDocument) {
  // @ts-expect-error Document filtering must be explicit.
  documentPicker.pickDocuments({ allowMultiple: true });
  // @ts-expect-error MIME types are an array, not a comma-delimited string.
  documentPicker.pickDocuments({ mimeTypes: 'application/pdf' });
  // @ts-expect-error Multiple selection uses a boolean.
  documentPicker.pickDocuments({ mimeTypes: ['*/*'], allowMultiple: 5 });
  // @ts-expect-error Documents use their own picker, not a new media kind.
  mediaPicker.pickAssets({ mediaTypes: ['document'] });
  // @ts-expect-error Media kinds must be explicit.
  mediaPicker.pickAssets({ maxSelectionCount: 1 });
  // @ts-expect-error A destination path is required.
  document.saveToFile();
  // @ts-expect-error Progress is a numeric fraction.
  document.saveToFile('/tmp/output', (progress: string) => {});
  // @ts-expect-error Native metadata is read-only.
  document.uri = '/tmp/other';
  // @ts-expect-error Native metadata is read-only.
  document.fileName = 'renamed.pdf';
  // @ts-expect-error Native metadata is read-only.
  asset.mediaType = 'video';
  // @ts-expect-error Unknown provider sizes must be handled explicitly.
  const requiredSize: number = document.byteSize;
  // @ts-expect-error MIME metadata can be unavailable.
  const requiredMimeType: string = document.mimeType;
  // @ts-expect-error Handles do not provide durable bookmark persistence.
  document.createBookmark();
}
