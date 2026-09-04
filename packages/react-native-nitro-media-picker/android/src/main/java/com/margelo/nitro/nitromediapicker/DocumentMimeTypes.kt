package com.margelo.nitro.nitromediapicker

internal object DocumentMimeTypes {
  private val mimeType = Regex("[a-zA-Z0-9!#$&^_.+-]+/(?:[a-zA-Z0-9!#$&^_.+-]+|\\*)")

  fun isValid(value: String): Boolean = value == "*/*" || mimeType.matches(value)
}
