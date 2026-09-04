package com.margelo.nitro.nitromediapicker

import org.junit.Assert.*
import org.junit.Test

class DocumentMimeTypesTest {
  @Test fun acceptsConcreteVendorAndWildcardMimeTypes() {
    for (value in listOf("application/pdf", "image/*", "*/*", "application/vnd.api+json")) {
      assertTrue(value, DocumentMimeTypes.isValid(value))
    }
  }

  @Test fun rejectsExtensionsParametersAndMalformedWildcards() {
    for (value in listOf("", ".pdf", "pdf", "*/pdf", "image/", " image/png", "text/plain; charset=utf8")) {
      assertFalse(value, DocumentMimeTypes.isValid(value))
    }
  }
}
