package com.margelo.nitro.nitromediapicker

import android.content.ContentResolver
import android.net.Uri
import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.core.Promise
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob

/** A session handle. The library deliberately does not persist URI grants. */
@Keep
@DoNotStrip
class HybridPickedDocument(
  private val resolver: ContentResolver,
  private val sourceUri: Uri,
  override val fileName: String,
  override val mimeType: String?,
  override val byteSize: Double?,
) : HybridPickedDocumentSpec() {
  override val uri: String = sourceUri.toString()
  private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

  override fun saveToFile(
    destinationPath: String,
    onProgress: ((fraction: Double) -> Unit)?,
  ): Promise<Double> = Promise.async(scope) {
    val destination = AtomicFileCopy.destination(destinationPath)
    sourceUri.requireDifferentDestination(destination)
    val source = resolver.openInputStream(sourceUri)
      ?: throw IllegalStateException("The picked document $uri is no longer available")
    source.use {
      AtomicFileCopy.copy(it, destination, byteSize, onProgress).toDouble()
    }
  }
}
