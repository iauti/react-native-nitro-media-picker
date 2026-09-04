import type { PickedAsset } from './PickedAsset.nitro';
import type { HybridObject } from 'react-native-nitro-modules';

import type { PermissionStatus } from '../PermissionStatus';
import type { PickOptions } from '../PickOptions';
import type { PickResult } from '../PickResult';

/**
 * Picks media from the device's library without reading it.
 *
 * The system picker resolves as soon as the user is done choosing, handing back
 * {@linkcode PickedAsset} handles rather than files. Reading each asset is a
 * separate, per-asset step, so selection does not wait for file copying or cloud downloads.
 *
 * @see {@linkcode MediaPicker.pickAssets}
 */
export interface MediaPicker extends HybridObject<{
  ios: 'swift';
  android: 'kotlin';
}> {
  /**
   * Whether the app can already read the media library, without prompting.
   *
   * @see {@linkcode MediaPicker.requestPermission}
   */
  getPermissionStatus(): Promise<PermissionStatus>;

  /**
   * Ask the user for access to the media library, resolving with the status
   * afterwards. Resolves immediately where the system picker needs no
   * permission of its own.
   */
  requestPermission(): Promise<PermissionStatus>;

  /**
   * Present the system picker and resolve once the user is done.
   *
   * Resolves rather than rejects when the picker is dismissed — see
   * {@linkcode PickResult.isCanceled}.
   *
   * @throws When the library cannot be read, or a pick is already in progress.
   */
  pickAssets(options: PickOptions): Promise<PickResult>;
}
