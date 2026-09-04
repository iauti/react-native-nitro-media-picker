import type { MediaPicker } from './specs/MediaPicker.nitro';
/**
 * Whether the app may read the device's media library.
 *
 * Reading a picked asset later requires this access, so a picker that hands
 * back identifiers rather than files needs it up front — unlike one that copies
 * everything while the sheet is open.
 *
 * @see {@linkcode MediaPicker.getPermissionStatus}
 * @see {@linkcode MediaPicker.requestPermission}
 */
export type PermissionStatus =
  /** The library has not been asked for yet. */
  | 'not-determined'
  /** Full read access. */
  | 'granted'
  /** Access to a subset the user chose. Picking still works. */
  | 'limited'
  /** Refused, or blocked by device policy. */
  | 'denied';
