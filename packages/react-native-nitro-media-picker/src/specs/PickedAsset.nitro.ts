import type { MediaPicker } from './MediaPicker.nitro';
import type { HybridObject } from 'react-native-nitro-modules';

import type { MediaType } from '../MediaType';

/**
 * One asset the user picked, identified but not yet read.
 *
 * Picking hands back these handles as soon as the sheet closes; the bytes stay
 * where they are until {@linkcode PickedAsset.saveToFile} asks for them. That
 * keeps a large or cloud-backed selection from blocking the picker, at the cost
 * of the file not existing until you ask.
 *
 * @see {@linkcode MediaPicker.pickAssets}
 */
export interface PickedAsset extends HybridObject<{
  ios: 'swift';
  android: 'kotlin';
}> {
  /**
   * Identifies the asset within the device's media library.
   *
   * Stable enough to hold across a screen, but not a durable reference: an
   * asset can be deleted, and on Android access can lapse when the app is
   * killed. Treat a failure from {@linkcode PickedAsset.saveToFile} as the
   * asset having gone away.
   */
  readonly id: string;

  /** The name the library records for the asset, such as `IMG_0042.heic`. */
  readonly fileName: string;

  /** The asset's media type, such as `image/heic`. */
  readonly mimeType: string;

  /** Whether the asset is a still image or a video. */
  readonly mediaType: MediaType;

  /**
   * The asset's size in bytes, when the library reports one without opening the
   * file. Otherwise `undefined` — the real size is the return value of
   * {@linkcode PickedAsset.saveToFile}.
   */
  readonly byteSize?: number;

  /**
   * Write the asset's bytes to `destinationPath`, replacing anything already
   * there, and resolve with the number of bytes written.
   *
   * This is where the work deferred by picking actually happens: an asset held
   * only in the cloud is downloaded here, so the call can be slow and should
   * not be made while the user is waiting on a picker.
   *
   * @param destinationPath An absolute path in a directory the app can write to.
   * @param onProgress Called with the fraction written so far, from 0 to 1.
   * @throws When the asset is no longer available, or cannot be written.
   */
  saveToFile(
    destinationPath: string,
    onProgress?: (fraction: number) => void,
  ): Promise<number>;
}
