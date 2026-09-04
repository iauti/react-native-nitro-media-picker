import type { HybridObject } from 'react-native-nitro-modules';
import type { DocumentPickOptions } from '../DocumentPickOptions';
import type { DocumentPickResult } from '../DocumentPickResult';

/** Opens system file providers and returns {@linkcode DocumentPickResult} handles. */
export interface DocumentPicker extends HybridObject<{
  ios: 'swift';
  android: 'kotlin';
}> {
  /**
   * Select local or cloud-provider files without broad storage permission.
   * Cancellation resolves normally. Providers may download files before returning.
   * @throws For invalid filters, unavailable presentation, or another document pick in progress.
   * @see {@linkcode DocumentPickOptions}
   */
  pickDocuments(options: DocumentPickOptions): Promise<DocumentPickResult>;
}
