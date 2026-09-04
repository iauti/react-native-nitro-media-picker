import type { HybridObject } from 'react-native-nitro-modules';
import type { DocumentPicker } from './DocumentPicker.nitro';

/**
 * A file-provider handle returned by {@linkcode DocumentPicker.pickDocuments}.
 * Keep the handle alive until saving completes. URIs are not durable bookmarks;
 * save a local copy before relying on access across app restarts.
 * iOS security-scoped access is released when the native handle is destroyed.
 */
export interface PickedDocument extends HybridObject<{
  ios: 'swift';
  android: 'kotlin';
}> {
  /** Provider URI. It is not necessarily a filesystem path or independently readable URL. */
  readonly uri: string;
  /** Provider display name; never use as an unsanitized destination path. */
  readonly fileName: string;
  /** MIME type when reported by the provider, otherwise undefined. */
  readonly mimeType?: string;
  /** Byte size when available from metadata, otherwise undefined. */
  readonly byteSize?: number;
  /**
   * Copy into an absolute writable filesystem path and return bytes written.
   * The destination directory must exist. An existing destination is replaced.
   * A cloud-backed document may require downloading while this runs.
   * @param destinationPath Absolute filesystem path, not a file:// URI.
   * @param onProgress Copy progress from 0 to 1; unknown sizes may only report completion.
   * @throws If provider access has expired, the file is unavailable, or copying fails.
   */
  saveToFile(
    destinationPath: string,
    onProgress?: (fraction: number) => void,
  ): Promise<number>;
}
