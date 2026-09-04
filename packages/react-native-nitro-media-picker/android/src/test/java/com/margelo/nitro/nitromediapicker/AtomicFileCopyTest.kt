package com.margelo.nitro.nitromediapicker

import java.io.File
import java.io.IOException
import java.io.InputStream
import org.junit.Assert.*
import org.junit.Rule
import org.junit.Test
import org.junit.rules.TemporaryFolder

class AtomicFileCopyTest {
  @get:Rule val directory = TemporaryFolder()

  @Test fun failedStreamPreservesDestinationAndRemovesTemporaryFile() {
    val target = directory.newFile("target")
    target.writeText("keep this")
    val source = object : InputStream() {
      override fun read(): Int = throw IOException("provider disconnected")
    }
    assertThrows(IOException::class.java) { AtomicFileCopy.copy(source, target, null, null) }
    assertEquals("keep this", target.readText())
    assertEquals(listOf("target"), directory.root.list()?.toList())
  }

  @Test fun copyingOntoSourceDoesNotTruncateIt() {
    val target = directory.newFile("source")
    target.writeText("original source content")
    target.inputStream().use { input ->
      assertEquals(23L, AtomicFileCopy.copy(input, target, 23.0, null))
    }
    assertEquals("original source content", target.readText())
  }

  @Test fun staleSizeCannotReportCompletionBeforeRename() {
    val target = directory.newFile("target")
    target.writeText("old")
    val progress = mutableListOf<Double>()
    val bytes = ByteArray(25000) { 7 }
    val written = AtomicFileCopy.copy(bytes.inputStream(), target, 1.0) { fraction ->
      progress.add(fraction)
      if (fraction < 1.0) assertEquals("old", target.readText())
    }
    assertEquals(bytes.size.toLong(), written)
    assertArrayEquals(bytes, target.readBytes())
    assertTrue(progress.all { it in 0.0..1.0 })
    assertEquals(1.0, progress.last(), 0.0)
    assertEquals(progress.sorted(), progress)
  }

  @Test fun unknownSizeAndEmptyFileComplete() {
    val target = File(directory.root, "empty")
    val progress = mutableListOf<Double>()
    assertEquals(0L, AtomicFileCopy.copy(byteArrayOf().inputStream(), target, null, progress::add))
    assertEquals(listOf(1.0), progress)
    assertTrue(target.exists())
    assertEquals(0L, target.length())
  }

  @Test fun rejectsRelativeUriAndMissingParentPaths() {
    for (path in listOf("relative.txt", "file:///tmp/example", "content://provider/example")) {
      assertThrows(IllegalArgumentException::class.java) { AtomicFileCopy.destination(path) }
    }
    assertThrows(IllegalArgumentException::class.java) {
      AtomicFileCopy.destination(File(directory.root, "missing/target").absolutePath)
    }
    assertThrows(IllegalArgumentException::class.java) {
      AtomicFileCopy.destination(directory.root.absolutePath)
    }
  }
}
