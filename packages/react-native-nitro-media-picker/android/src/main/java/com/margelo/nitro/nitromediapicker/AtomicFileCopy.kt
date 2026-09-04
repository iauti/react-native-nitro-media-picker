package com.margelo.nitro.nitromediapicker

import java.io.File
import java.io.IOException
import java.io.InputStream

/** Stage the entire stream beside the destination before replacing any existing file. */
internal object AtomicFileCopy {
  fun destination(path: String): File {
    require(path.isNotEmpty() && File(path).isAbsolute && !path.contains('\u0000')) {
      "`destinationPath` must be an absolute filesystem path, not a URI"
    }
    val destination = File(path).canonicalFile
    require(destination.parentFile?.isDirectory == true) { "Destination parent directory does not exist" }
    require(!destination.exists() || destination.isFile) { "Destination must be a regular file" }
    return destination
  }

  fun copy(
    source: InputStream,
    destination: File,
    expectedBytes: Double?,
    onProgress: ((Double) -> Unit)?,
  ): Long {
    val temporary = File.createTempFile(".nitro-picker-", ".tmp", destination.parentFile)
    try {
      var written = 0L
      var previousProgress = 0.0
      temporary.outputStream().use { sink ->
        val buffer = ByteArray(DEFAULT_BUFFER_SIZE)
        while (true) {
          val read = source.read(buffer)
          if (read < 0) break
          if (read == 0) continue
          sink.write(buffer, 0, read)
          written += read
          if (expectedBytes != null && expectedBytes.isFinite() && expectedBytes > 0) {
            // Metadata can be stale. Reserve 1 for the successful final rename.
            val progress = (written.toDouble() / expectedBytes).coerceIn(0.0, 0.99)
            if (progress - previousProgress >= 0.01) {
              onProgress?.invoke(progress)
              previousProgress = progress
            }
          }
        }
        sink.fd.sync()
      }
      if (!temporary.renameTo(destination)) throw IOException("Could not replace destination file")
      onProgress?.invoke(1.0)
      return written
    } finally {
      temporary.delete()
    }
  }
}
