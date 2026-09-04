package com.margelo.nitro.nitromediapicker

/** Failures the picker reports to JavaScript. */
internal sealed class MediaPickerError(message: String) : Exception(message) {
  object PickInProgress : MediaPickerError("A pick is already in progress")

  object NoActivity : MediaPickerError("No activity is available to present the picker from")

  object NoMediaTypesRequested :
    MediaPickerError("`mediaTypes` must name at least one type to pick")

  class AssetUnavailable(id: String) :
    MediaPickerError("The picked asset $id is no longer available")
}
