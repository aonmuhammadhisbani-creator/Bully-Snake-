package com.example

import android.annotation.SuppressLint
import android.content.Context
import android.os.Build
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.view.KeyEvent
import android.webkit.JavascriptInterface
import android.webkit.RenderProcessGoneDetail
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {

    private var gameWebView: WebView? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            MyApplicationTheme {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color(0xFF030712))
                ) {
                    BullySnakeGameScreen(
                        onWebViewCreated = { webView ->
                            gameWebView = webView
                        }
                    )
                }
            }
        }
    }

    override fun onPause() {
        super.onPause()
        gameWebView?.evaluateJavascript("if (window.onGamePause) window.onGamePause();", null)
    }

    override fun onResume() {
        super.onResume()
        gameWebView?.evaluateJavascript("if (window.onGameResume) window.onGameResume();", null)
    }

    override fun onDestroy() {
        super.onDestroy()
        gameWebView?.destroy()
        gameWebView = null
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        gameWebView?.let { wv ->
            val keyStr = when (keyCode) {
                KeyEvent.KEYCODE_DPAD_UP, KeyEvent.KEYCODE_W -> "ArrowUp"
                KeyEvent.KEYCODE_DPAD_DOWN, KeyEvent.KEYCODE_S -> "ArrowDown"
                KeyEvent.KEYCODE_DPAD_LEFT, KeyEvent.KEYCODE_A -> "ArrowLeft"
                KeyEvent.KEYCODE_DPAD_RIGHT, KeyEvent.KEYCODE_D -> "ArrowRight"
                KeyEvent.KEYCODE_SPACE -> " "
                else -> null
            }
            if (keyStr != null) {
                wv.evaluateJavascript(
                    "window.dispatchEvent(new KeyboardEvent('keydown', { key: '$keyStr', bubbles: true }));",
                    null
                )
                return true
            }
        }
        return super.onKeyDown(keyCode, event)
    }
}

class SnakeNativeBridge(context: Context) {
    private val prefs = context.getSharedPreferences("bully_snake_prefs", Context.MODE_PRIVATE)
    private val vibrator: Vibrator? = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
        vibratorManager?.defaultVibrator
    } else {
        @Suppress("DEPRECATION")
        context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
    }

    @JavascriptInterface
    fun getHighScore(): String {
        return prefs.getInt("high_score", 0).toString()
    }

    @JavascriptInterface
    fun saveHighScore(score: Int) {
        val current = prefs.getInt("high_score", 0)
        if (score > current) {
            prefs.edit().putInt("high_score", score).apply()
        }
    }

    @JavascriptInterface
    fun getDiamonds(): String {
        return prefs.getInt("diamonds", 0).toString()
    }

    @JavascriptInterface
    fun saveDiamonds(count: Int) {
        prefs.edit().putInt("diamonds", count).apply()
    }

    @JavascriptInterface
    fun getSkins(): String {
        return prefs.getString("unlocked_skins", "[\"skin_1\"]") ?: "[\"skin_1\"]"
    }

    @JavascriptInterface
    fun saveSkins(skinsJson: String) {
        prefs.edit().putString("unlocked_skins", skinsJson).apply()
    }

    @JavascriptInterface
    fun getEquippedSkin(): String {
        return prefs.getString("equipped_skin", "skin_1") ?: "skin_1"
    }

    @JavascriptInterface
    fun saveEquippedSkin(skinId: String) {
        prefs.edit().putString("equipped_skin", skinId).apply()
    }

    @JavascriptInterface
    fun vibrate(type: String) {
        vibrator ?: return
        if (!vibrator.hasVibrator()) return

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                when (type) {
                    "turn" -> vibrator.vibrate(VibrationEffect.createOneShot(12, VibrationEffect.DEFAULT_AMPLITUDE))
                    "eat" -> vibrator.vibrate(VibrationEffect.createOneShot(30, VibrationEffect.DEFAULT_AMPLITUDE))
                    "diamond" -> vibrator.vibrate(VibrationEffect.createWaveform(longArrayOf(0, 25, 30, 45), -1))
                    "button" -> vibrator.vibrate(VibrationEffect.createOneShot(15, VibrationEffect.DEFAULT_AMPLITUDE))
                    "crash" -> {
                        val timings = longArrayOf(0, 100, 50, 180)
                        val amplitudes = intArrayOf(0, 200, 0, 255)
                        vibrator.vibrate(VibrationEffect.createWaveform(timings, amplitudes, -1))
                    }
                }
            } else {
                @Suppress("DEPRECATION")
                when (type) {
                    "turn" -> vibrator.vibrate(12)
                    "eat" -> vibrator.vibrate(30)
                    "diamond" -> vibrator.vibrate(longArrayOf(0, 25, 30, 45), -1)
                    "button" -> vibrator.vibrate(15)
                    "crash" -> vibrator.vibrate(longArrayOf(0, 100, 50, 180), -1)
                }
            }
        } catch (_: Exception) {}
    }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun BullySnakeGameScreen(
    onWebViewCreated: (WebView) -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val bridge = remember { SnakeNativeBridge(context) }

    AndroidView(
        modifier = modifier.fillMaxSize(),
        factory = { ctx ->
            WebView(ctx).apply {
                setLayerType(android.view.View.LAYER_TYPE_SOFTWARE, null)
                setBackgroundColor(0xFF030712.toInt())
                isVerticalScrollBarEnabled = false
                isHorizontalScrollBarEnabled = false

                settings.apply {
                    javaScriptEnabled = true
                    domStorageEnabled = true
                    allowFileAccess = true
                    allowContentAccess = true
                    mediaPlaybackRequiresUserGesture = false
                    cacheMode = WebSettings.LOAD_DEFAULT
                    useWideViewPort = true
                    loadWithOverviewMode = true
                }

                webChromeClient = WebChromeClient()
                webViewClient = object : WebViewClient() {
                    override fun onRenderProcessGone(view: WebView?, detail: RenderProcessGoneDetail?): Boolean {
                        // Return true to avoid host application termination
                        return true
                    }

                    override fun onPageFinished(view: WebView?, url: String?) {
                        super.onPageFinished(view, url)
                        view?.evaluateJavascript("document.body.style.backgroundColor = '#030712';", null)
                    }
                }

                addJavascriptInterface(bridge, "AndroidBridge")
                loadUrl("file:///android_asset/snake/index.html")

                onWebViewCreated(this)
            }
        }
    )
}
