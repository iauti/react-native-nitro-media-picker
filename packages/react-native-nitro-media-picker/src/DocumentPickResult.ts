import type { DocumentPicker } from './specs/DocumentPicker.nitro';
import type { PickedDocument } from './specs/PickedDocument.nitro';

/** The normal selection or cancellation outcome of {@linkcode DocumentPicker.pickDocuments}. */
export interface DocumentPickResult {
  /** Whether the user dismissed the picker without selecting a document. */
  isCanceled: boolean;
  /** Selected handles in the order returned by the system provider. */
  documents: PickedDocument[];
}
