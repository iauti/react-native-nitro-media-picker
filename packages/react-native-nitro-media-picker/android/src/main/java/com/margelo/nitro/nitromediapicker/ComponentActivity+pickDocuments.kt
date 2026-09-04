package com.margelo.nitro.nitromediapicker

import android.app.Activity
import android.content.Intent
import android.net.Uri
import androidx.activity.ComponentActivity
import androidx.activity.result.contract.ActivityResultContracts
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import java.util.UUID
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import kotlinx.coroutines.suspendCancellableCoroutine

/** Called on Main. Registration and the activity observer live only for this request. */
internal suspend fun ComponentActivity.pickDocuments(intent: Intent): List<Uri> {
  var unregister: (() -> Unit)? = null
  var observer: LifecycleEventObserver? = null
  try {
    return suspendCancellableCoroutine { continuation ->
      val launcher = activityResultRegistry.register(
        "nitro-document-picker-${UUID.randomUUID()}",
        ActivityResultContracts.StartActivityForResult(),
      ) { result ->
        if (continuation.isActive) {
          when (result.resultCode) {
            Activity.RESULT_CANCELED -> continuation.resume(emptyList())
            Activity.RESULT_OK -> {
              val uris = LinkedHashSet<Uri>()
              result.data?.data?.let { uris.add(it) }
              result.data?.clipData?.let { clip ->
                for (index in 0 until clip.itemCount) uris.add(clip.getItemAt(index).uri)
              }
              if (uris.isEmpty()) {
                continuation.resumeWithException(IllegalStateException("Document picker returned no documents"))
              } else {
                continuation.resume(uris.toList())
              }
            }
            else -> continuation.resumeWithException(IllegalStateException("Document picker failed with result ${result.resultCode}"))
          }
        }
      }
      unregister = { launcher.unregister() }
      val activityObserver = LifecycleEventObserver { _, event ->
        if (event == Lifecycle.Event.ON_DESTROY && continuation.isActive) {
          continuation.resumeWithException(IllegalStateException("Activity was destroyed while picking documents"))
        }
      }
      observer = activityObserver
      lifecycle.addObserver(activityObserver)
      launcher.launch(intent)
    }
  } finally {
    unregister?.invoke()
    observer?.let { lifecycle.removeObserver(it) }
  }
}
