package com.margelo.nitro.nitromediapicker

import android.net.Uri
import java.io.File

/** Content URIs are opaque; atomic staging still prevents truncation for those. */
internal fun Uri.requireDifferentDestination(destination: File) {
  if (scheme == "file") {
    val sourcePath = requireNotNull(path) { "Source file URI has no path" }
    require(File(sourcePath).canonicalFile != destination.canonicalFile) {
      "Destination must differ from the picked source file"
    }
  }
}
