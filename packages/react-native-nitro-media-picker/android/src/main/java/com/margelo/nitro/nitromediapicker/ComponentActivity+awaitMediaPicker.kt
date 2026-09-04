package com.margelo.nitro.nitromediapicker

import androidx.activity.ComponentActivity
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContract
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import java.util.UUID
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import kotlinx.coroutines.suspendCancellableCoroutine

internal suspend fun <O> ComponentActivity.awaitMediaPicker(
  contract: ActivityResultContract<PickVisualMediaRequest, O>,
  request: PickVisualMediaRequest,
): O {
  check(lifecycle.currentState.isAtLeast(Lifecycle.State.STARTED)) {
    "The activity must be visible to present the media picker"
  }
  val key = "nitro-media-picker-${UUID.randomUUID()}"
  var unregister: (() -> Unit)? = null
  var observer: LifecycleEventObserver? = null
  try {
    return suspendCancellableCoroutine { continuation ->
      val launcher = activityResultRegistry.register(key, contract) { result ->
        if (continuation.isActive) continuation.resume(result)
      }
      unregister = { launcher.unregister() }
      val activityObserver = LifecycleEventObserver { _, event ->
        if (event == Lifecycle.Event.ON_DESTROY && continuation.isActive) {
          continuation.resumeWithException(IllegalStateException("Activity was destroyed while picking media"))
        }
      }
      observer = activityObserver
      lifecycle.addObserver(activityObserver)
      launcher.launch(request)
    }
  } finally {
    unregister?.invoke()
    observer?.let { lifecycle.removeObserver(it) }
  }
}
