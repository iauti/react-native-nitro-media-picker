import { NitroModules } from 'react-native-nitro-modules';

import type { DocumentPicker } from './specs/DocumentPicker.nitro';
import type { MediaPicker } from './specs/MediaPicker.nitro';

/** Picks media from the device's library. @see {@linkcode MediaPicker} */
export const mediaPicker =
  NitroModules.createHybridObject<MediaPicker>('MediaPicker');

export type { MediaType } from './MediaType';
export type { PermissionStatus } from './PermissionStatus';
export type { PickOptions } from './PickOptions';
export type { PickResult } from './PickResult';
export type { MediaPicker } from './specs/MediaPicker.nitro';
export type { PickedAsset } from './specs/PickedAsset.nitro';

/** Opens system file providers. @see {@linkcode DocumentPicker} */
export const documentPicker =
  NitroModules.createHybridObject<DocumentPicker>('DocumentPicker');
export type { DocumentPicker } from './specs/DocumentPicker.nitro';
export type { PickedDocument } from './specs/PickedDocument.nitro';
export type { DocumentPickOptions } from './DocumentPickOptions';
export type { DocumentPickResult } from './DocumentPickResult';
