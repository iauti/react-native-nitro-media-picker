package com.margelo.nitro.nitromediapicker

import androidx.activity.ComponentActivity
import androidx.lifecycle.Lifecycle
import com.margelo.nitro.NitroModules

internal object DocumentPickerActivity {
  fun requireCurrent(): ComponentActivity {
    val activity = NitroModules.applicationContext?.currentActivity as? ComponentActivity
      ?: throw IllegalStateException("No ComponentActivity is available to present the document picker")
    check(activity.lifecycle.currentState.isAtLeast(Lifecycle.State.STARTED)) {
      "The activity must be visible to present the document picker"
    }
    return activity
  }
}
