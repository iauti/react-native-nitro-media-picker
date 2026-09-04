package com.margelo.nitro.nitromediapicker

import android.content.Intent

internal fun DocumentPickOptions.toDocumentIntent(): Intent {
  val types = mimeTypes.distinct()
  require(types.isNotEmpty()) { "`mimeTypes` must contain at least one MIME type (use */* for all files)" }
  require(types.all { DocumentMimeTypes.isValid(it) }) {
    "`mimeTypes` must contain MIME types such as application/pdf, image/*, or */*"
  }
  return Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
    addCategory(Intent.CATEGORY_OPENABLE)
    addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
    type = if (types.size == 1) types.first() else "*/*"
    if (types.size > 1) putExtra(Intent.EXTRA_MIME_TYPES, types.toTypedArray())
    putExtra(Intent.EXTRA_ALLOW_MULTIPLE, allowMultiple ?: false)
  }
}
