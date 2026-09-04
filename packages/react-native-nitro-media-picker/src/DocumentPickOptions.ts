import type { DocumentPicker } from './specs/DocumentPicker.nitro';

/** Filters and selection behavior for {@linkcode DocumentPicker.pickDocuments}. */
export interface DocumentPickOptions {
  /** Allowed MIME types, for example ['application/pdf'], ['image/*'], or a wildcard for all files. Must not be empty. */
  mimeTypes: string[];
  /** Allow selecting more than one document. @default false */
  allowMultiple?: boolean;
}
