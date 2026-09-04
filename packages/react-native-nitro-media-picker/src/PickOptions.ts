import type { MediaPicker } from './specs/MediaPicker.nitro';
import type { MediaType } from './MediaType';

/**
 * How the picker should behave for one {@linkcode MediaPicker.pickAssets} call.
 */
export interface PickOptions {
  /**
   * Which kinds of media the user may choose. Pass every type to leave the
   * choice open — there is no separate "any" value, so the set is always
   * visible at the call site.
   *
   * @throws When empty.
   */
  mediaTypes: MediaType[];

  /**
   * How many assets the user may choose at once. Must be a positive integer. Omit for the platform maximum.
   *
   * @default platform maximum
   */
  maxSelectionCount?: number;
}
