package com.example

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [34])
class ExampleRobolectricTest {

  @Test
  fun `read string from context`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val appName = context.getString(R.string.app_name)
    assertEquals("Bully Snake", appName)
  }

  @Test
  fun `test native bridge high score persistence`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val bridge = SnakeNativeBridge(context)

    assertEquals("0", bridge.getHighScore())
    bridge.saveHighScore(150)
    assertEquals("150", bridge.getHighScore())
    // Lower score should not overwrite
    bridge.saveHighScore(80)
    assertEquals("150", bridge.getHighScore())
    // Higher score should overwrite
    bridge.saveHighScore(320)
    assertEquals("320", bridge.getHighScore())
  }

  @Test
  fun `test native bridge diamonds and skins persistence`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val bridge = SnakeNativeBridge(context)

    assertEquals("0", bridge.getDiamonds())
    bridge.saveDiamonds(450)
    assertEquals("450", bridge.getDiamonds())

    assertEquals("[\"skin_1\"]", bridge.getSkins())
    bridge.saveSkins("[\"skin_1\",\"skin_2\",\"skin_4\"]")
    assertEquals("[\"skin_1\",\"skin_2\",\"skin_4\"]", bridge.getSkins())

    assertEquals("skin_1", bridge.getEquippedSkin())
    bridge.saveEquippedSkin("skin_4")
    assertEquals("skin_4", bridge.getEquippedSkin())
  }
}
