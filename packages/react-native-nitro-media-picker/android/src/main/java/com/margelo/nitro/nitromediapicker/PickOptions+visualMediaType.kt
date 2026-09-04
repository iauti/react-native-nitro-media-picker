package com.margelo.nitro.nitromediapicker

import androidx.activity.result.contract.ActivityResultContracts.PickVisualMedia

/** The picker's own filter for the requested media types. */
internal val PickOptions.visualMediaType: PickVisualMedia.VisualMediaType
  get() =
    when {
      mediaTypes.distinct().size > 1 -> PickVisualMedia.ImageAndVideo
      mediaTypes.first() == MediaType.VIDEO -> PickVisualMedia.VideoOnly
      else -> PickVisualMedia.ImageOnly
    }
