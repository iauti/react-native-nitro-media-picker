package com.margelo.nitro.nitromediapicker

/** The kind of media a MIME type describes, defaulting to an image. */
internal fun mediaTypeOf(mimeType: String): MediaType =
  if (mimeType.startsWith("video/")) MediaType.VIDEO else MediaType.IMAGE
