package com.margelo.nitro.nitromediapicker

import androidx.activity.ComponentActivity
import com.margelo.nitro.NitroModules
import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.core.Promise
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.withContext

/**
 * Presents the system photo picker and hands back identified, unread items.
 *
 * The picker returns content URIs, which the provider only reads when someone
 * opens a stream — so picking costs the same whether the user chose one item or
 * twenty.
 */
@Keep
@DoNotStrip
class HybridMediaPicker : HybridMediaPickerSpec() {
  private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)

  private var isPicking = false

  /**
   * The system picker asks for nothing of its own: it runs out of process and
   * grants access only to what the user chose.
   */
  override fun getPermissionStatus(): Promise<PermissionStatus> =
    Promise.resolved(PermissionStatus.GRANTED)

  override fun requestPermission(): Promise<PermissionStatus> =
    Promise.resolved(PermissionStatus.GRANTED)

  override fun pickAssets(options: PickOptions): Promise<PickResult> {
    if (options.mediaTypes.isEmpty()) {
      throw MediaPickerError.NoMediaTypesRequested
    }

    val limit = options.maxSelectionCount
    require(limit == null || (limit.isFinite() && limit >= 1 && limit <= Int.MAX_VALUE && limit % 1.0 == 0.0)) {
      "`maxSelectionCount` must be a positive integer no greater than 2147483647"
    }

    return Promise.async(scope) {
      if (isPicking) {
        throw MediaPickerError.PickInProgress
      }

      val activity =
        NitroModules.applicationContext?.currentActivity as? ComponentActivity
          ?: throw MediaPickerError.NoActivity

      isPicking = true

      try {
        val uris = activity.pickVisualMedia(options)

        PickResult(
          isCanceled = uris.isEmpty(),
          assets = withContext(Dispatchers.IO) { uris.map { describe(it) }.toTypedArray() },
        )
      } finally {
        isPicking = false
      }
    }
  }

  /** Everything JS needs for a row, from the provider's records alone. */
  private fun describe(uri: android.net.Uri): HybridPickedAssetSpec {
    val context = NitroModules.applicationContext ?: throw MediaPickerError.NoActivity
    val resolver = context.contentResolver
    val metadata = uri.queryMetadata(resolver)

    return HybridPickedAsset(
      context = context,
      uri = uri,
      fileName = metadata.fileName ?: uri.lastPathSegment.orEmpty(),
      mimeType = resolver.getType(uri) ?: "application/octet-stream",
      byteSize = metadata.byteSize?.toDouble(),
    )
  }
}
