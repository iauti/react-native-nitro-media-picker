import type { MediaPicker } from './specs/MediaPicker.nitro';
import type { PickedAsset } from './specs/PickedAsset.nitro';

/**
 * The outcome of one {@linkcode MediaPicker.pickAssets} call.
 *
 * Dismissing the picker is a normal outcome rather than a failure, so it is
 * reported here instead of rejecting.
 */
export interface PickResult {
  /** Whether the user dismissed the picker without choosing anything. */
  isCanceled: boolean;

  /**
   * What the user chose, in the order returned by the system picker.
   *
   * No file has been read at this point — see {@linkcode PickedAsset.saveToFile}.
   */
  assets: PickedAsset[];
}
