package com.margelo.nitro.nitromediapicker

import android.content.ContentResolver
import android.net.Uri
import android.provider.OpenableColumns

/**
 * What the content provider will tell us about a picked item without opening
 * it. Both fields can be absent — a provider is not obliged to report either.
 */
internal data class UriMetadata(val fileName: String?, val byteSize: Long?)

/** Read a picked item's name and size straight from the provider's records. */
internal fun Uri.queryMetadata(resolver: ContentResolver): UriMetadata {
  resolver.query(this, null, null, null, null)?.use { cursor ->
    if (!cursor.moveToFirst()) {
      return UriMetadata(null, null)
    }

    val nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME)
    val sizeIndex = cursor.getColumnIndex(OpenableColumns.SIZE)

    return UriMetadata(
      fileName = if (nameIndex >= 0 && !cursor.isNull(nameIndex)) cursor.getString(nameIndex) else null,
      byteSize = if (sizeIndex >= 0 && !cursor.isNull(sizeIndex)) cursor.getLong(sizeIndex) else null,
    )
  }

  return UriMetadata(null, null)
}
