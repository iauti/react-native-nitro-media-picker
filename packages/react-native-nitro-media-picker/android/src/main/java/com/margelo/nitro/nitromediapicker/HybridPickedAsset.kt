package com.margelo.nitro.nitromediapicker

import android.content.Context
import android.net.Uri
import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.core.Promise
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob

/** One picked asset, identified now and read only when asked. */
@Keep
@DoNotStrip
class HybridPickedAsset(
  private val context: Context,
  private val uri: Uri,
  override val fileName: String,
  override val mimeType: String,
  override val byteSize: Double?,
) : HybridPickedAssetSpec() {
  override val id: String = uri.toString()

  override val mediaType: MediaType = mediaTypeOf(mimeType)

  private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

  override fun saveToFile(
    destinationPath: String,
    onProgress: ((fraction: Double) -> Unit)?,
  ): Promise<Double> =
    Promise.async(scope) {
      val destination = AtomicFileCopy.destination(destinationPath)
      uri.requireDifferentDestination(destination)
      val input = context.contentResolver.openInputStream(uri)
        ?: throw MediaPickerError.AssetUnavailable(id)
      input.use { source ->
        AtomicFileCopy.copy(source, destination, byteSize, onProgress).toDouble()
      }
    }
}
