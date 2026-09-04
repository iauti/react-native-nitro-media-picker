package com.margelo.nitro.nitromediapicker

import android.net.Uri
import androidx.activity.ComponentActivity
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts.PickVisualMedia
import androidx.activity.result.contract.ActivityResultContracts.PickMultipleVisualMedia

/** Launch on Main. Fallback pickers may ignore limits, so validate the returned count. */
internal suspend fun ComponentActivity.pickVisualMedia(options: PickOptions): List<Uri> {
  val request = PickVisualMediaRequest(options.visualMediaType)
  if (options.maxSelectionCount == 1.0) {
    return listOfNotNull(awaitMediaPicker(PickVisualMedia(), request))
  }
  val contract = options.maxSelectionCount?.let { PickMultipleVisualMedia(it.toInt()) }
    ?: PickMultipleVisualMedia()
  val result = awaitMediaPicker(contract, request)
  val limit = options.maxSelectionCount
  check(limit == null || result.size <= limit) {
    "The system picker returned ${result.size} items, exceeding maxSelectionCount=$limit"
  }
  return result
}
