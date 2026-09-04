package com.margelo.nitro.nitromediapicker

import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.core.Promise
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.withContext

@Keep
@DoNotStrip
class HybridDocumentPicker : HybridDocumentPickerSpec() {
  private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)
  private var isPicking = false

  override fun pickDocuments(options: DocumentPickOptions): Promise<DocumentPickResult> =
    Promise.async(scope) {
      val intent = options.toDocumentIntent()
      check(!isPicking) { "A document pick is already in progress" }
      val activity = DocumentPickerActivity.requireCurrent()
      isPicking = true
      try {
        val uris = activity.pickDocuments(intent)
        val resolver = activity.applicationContext.contentResolver
        val documents = withContext(Dispatchers.IO) {
          uris.map { uri ->
            val metadata = uri.queryMetadata(resolver)
            HybridPickedDocument(
              resolver = resolver,
              sourceUri = uri,
              fileName = metadata.fileName?.takeIf { it.isNotEmpty() }
                ?: uri.lastPathSegment?.substringAfterLast('/')?.takeIf { it.isNotEmpty() }
                ?: "document",
              mimeType = resolver.getType(uri),
              byteSize = metadata.byteSize?.takeIf { it >= 0 }?.toDouble(),
            ) as HybridPickedDocumentSpec
          }.toTypedArray()
        }
        DocumentPickResult(isCanceled = uris.isEmpty(), documents = documents)
      } finally {
        isPicking = false
      }
    }
}
