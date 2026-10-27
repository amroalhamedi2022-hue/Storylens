package com.storylens.reader

import android.annotation.SuppressLint
import android.graphics.Color
import android.media.AudioAttributes
import android.media.AudioFocusRequest
import android.media.AudioManager
import android.os.Build
import android.net.Uri
import android.webkit.JavascriptInterface
import org.json.JSONObject
import java.io.ByteArrayOutputStream
import java.io.ByteArrayInputStream
import androidx.activity.result.contract.ActivityResultContracts
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.webkit.WebViewAssetLoader

/**
 * Secure offline host for the StoryLens reader.
 * The HTML is bundled with the APK, so vocabulary, stories and progress work without a connection.
 * Migration to pure Compose can use the same versioned library JSON without changing the learning data.
 */
class MainActivity : ComponentActivity() {
    private lateinit var reader: WebView
    private var pendingExport: String? = null
    // Only one Storage Access Framework picker may own an import/export result.
    // A second tap must never replace the bytes of an export already in flight.
    private var pickerInFlight = false
    private val maxBackupBytes = 3_000_000
    private val audioManager: AudioManager by lazy { getSystemService(AudioManager::class.java) }
    private var readerAudioFocusRequest: Any? = null
    private var readerAudioFocusHeld = false

    // Any focus loss pauses ambience/SFX. Gain never auto-resumes sound, so returning
    // from a call or another app cannot unexpectedly start playback.
    private val readerAudioFocusListener = AudioManager.OnAudioFocusChangeListener { focusChange ->
        if (focusChange != AudioManager.AUDIOFOCUS_GAIN) {
            runOnUiThread {
                if (::reader.isInitialized) reader.evaluateJavascript(
                    "window.LinguaAmbience && window.LinguaAmbience.onNativeAudioFocusLoss && window.LinguaAmbience.onNativeAudioFocusLoss();",
                    null
                )
            }
        }
    }

    @Synchronized
    private fun requestReaderAudioFocus(): Boolean {
        if (readerAudioFocusHeld) return true
        val result = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val request = AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN)
                .setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                        .build()
                )
                .setWillPauseWhenDucked(true)
                .setOnAudioFocusChangeListener(readerAudioFocusListener)
                .build()
            readerAudioFocusRequest = request
            audioManager.requestAudioFocus(request)
        } else {
            @Suppress("DEPRECATION")
            audioManager.requestAudioFocus(
                readerAudioFocusListener,
                AudioManager.STREAM_MUSIC,
                AudioManager.AUDIOFOCUS_GAIN
            )
        }
        readerAudioFocusHeld = result == AudioManager.AUDIOFOCUS_REQUEST_GRANTED
        if (!readerAudioFocusHeld) readerAudioFocusRequest = null
        return readerAudioFocusHeld
    }

    @Synchronized
    private fun abandonReaderAudioFocus() {
        if (!readerAudioFocusHeld) {
            readerAudioFocusRequest = null
            return
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            (readerAudioFocusRequest as? AudioFocusRequest)?.let {
                audioManager.abandonAudioFocusRequest(it)
            }
        } else {
            @Suppress("DEPRECATION")
            audioManager.abandonAudioFocus(readerAudioFocusListener)
        }
        readerAudioFocusHeld = false
        readerAudioFocusRequest = null
    }

    private val exportDocument = registerForActivityResult(
        ActivityResultContracts.CreateDocument("application/json")
    ) { uri: Uri? ->
        pickerInFlight = false
        val text = pendingExport
        pendingExport = null
        if (uri != null && text == null) notifyBackup("nativeStatus", "save_failed")
        if (uri != null && text != null) {
            try {
                val output = contentResolver.openOutputStream(uri)
                    ?: throw IllegalStateException("تعذّر فتح الملف للحفظ.")
                output.use { it.write(text.toByteArray(Charsets.UTF_8)) }
                notifyBackup("nativeStatus", "saved")
            } catch (ex: Exception) {
                notifyBackup("nativeStatus", "save_failed")
            }
        }
    }

    private val importDocument = registerForActivityResult(
        ActivityResultContracts.OpenDocument()
    ) { uri: Uri? ->
        pickerInFlight = false
        if (uri == null) return@registerForActivityResult
        try {
            val input = contentResolver.openInputStream(uri)
                ?: throw IllegalStateException("تعذّر فتح الملف.")
            val buffer = ByteArray(8192)
            val bytes = ByteArrayOutputStream()
            input.use { stream ->
                while (true) {
                    val n = stream.read(buffer)
                    if (n < 0) break
                    if (bytes.size() + n > maxBackupBytes)
                        throw IllegalArgumentException("الملف أكبر من الحد المسموح.")
                    bytes.write(buffer, 0, n)
                }
            }
            // Never silently replace malformed UTF-8 bytes with U+FFFD; that could
            // change saved vocabulary and source text without user consent.
            notifyBackup("receiveImport", BackupUtf8.decode(bytes.toByteArray()))
        } catch (ex: Exception) {
            notifyBackup("nativeStatus", "import_failed")
        }
    }

    /** Only exposed to local APK JavaScript; does not access the Internet. */
    private inner class OfflineBackupBridge {
        @JavascriptInterface
        fun saveBackup(json: String) {
            if (json.toByteArray(Charsets.UTF_8).size > maxBackupBytes) {
                runOnUiThread { notifyBackup("nativeStatus", "export_too_large") }
                return
            }
            runOnUiThread {
                if (pickerInFlight) {
                    notifyBackup("nativeStatus", "picker_busy")
                    return@runOnUiThread
                }
                pickerInFlight = true
                pendingExport = json
                try {
                    exportDocument.launch("LinguaTales-backup.json")
                } catch (_: Exception) {
                    pickerInFlight = false
                    pendingExport = null
                    notifyBackup("nativeStatus", "save_failed")
                }
            }
        }

        @JavascriptInterface
        fun openBackup() {
            runOnUiThread {
                if (pickerInFlight) {
                    notifyBackup("nativeStatus", "picker_busy")
                    return@runOnUiThread
                }
                pickerInFlight = true
                try {
                    importDocument.launch(arrayOf("application/json", "text/plain", "application/octet-stream"))
                } catch (_: Exception) {
                    pickerInFlight = false
                    notifyBackup("nativeStatus", "import_failed")
                }
            }
        }
    }

    /** Audio playback only; no microphone, recording or network capability. */
    private inner class ReaderAudioFocusBridge {
        @JavascriptInterface
        fun requestFocus(): Boolean = requestReaderAudioFocus()

        @JavascriptInterface
        fun releaseFocus() = abandonReaderAudioFocus()
    }

    private fun notifyBackup(method: String, data: String) {
        if (!::reader.isInitialized) return
        // Method names are fixed, and JSONObject.quote safely escapes file content.
        if (method != "receiveImport" && method != "nativeError" && method != "nativeStatus") return
        reader.evaluateJavascript(
            "window.StoryLensBackup && window.StoryLensBackup." + method +
                "(" + JSONObject.quote(data) + ");", null
        )
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        WindowCompat.setDecorFitsSystemWindows(window, false)
        WindowInsetsControllerCompat(window, window.decorView).apply {
            systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            hide(WindowInsetsCompat.Type.systemBars())
        }

        val assetLoader = WebViewAssetLoader.Builder()
            .setDomain("appassets.androidplatform.net")
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        reader = WebView(this).apply {
            setBackgroundColor(Color.rgb(239, 245, 243))
            isVerticalScrollBarEnabled = false
            isHorizontalScrollBarEnabled = false
            overScrollMode = WebView.OVER_SCROLL_NEVER
            settings.apply {
                javaScriptEnabled = true // only executes bundled, internally curated HTML
                domStorageEnabled = true // offline vocabulary, reading position and settings
                allowFileAccess = false
                allowContentAccess = false
                javaScriptCanOpenWindowsAutomatically = false
                setSupportMultipleWindows(false)
                cacheMode = WebSettings.LOAD_NO_CACHE
                mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
                setSupportZoom(false)
            }
            addJavascriptInterface(OfflineBackupBridge(), "StoryLensNative")
            addJavascriptInterface(ReaderAudioFocusBridge(), "LinguaTalesAudioFocus")
            webChromeClient = WebChromeClient()
            webViewClient = object : WebViewClient() {
                override fun shouldInterceptRequest(view: WebView?, request: WebResourceRequest?): WebResourceResponse? {
                    val url = request?.url ?: return null
                    // Do not fall through to WebView's network stack for any
                    // off-origin or missing asset, even if permissions change.
                    val bundled = url.scheme == "https" &&
                        url.host == "appassets.androidplatform.net" &&
                        url.path.orEmpty().startsWith("/assets/")
                    val local = if (bundled) assetLoader.shouldInterceptRequest(url) else null
                    return local ?: WebResourceResponse(
                        "text/plain", "UTF-8", 403, "Forbidden",
                        mapOf("Cache-Control" to "no-store"),
                        ByteArrayInputStream(ByteArray(0))
                    )
                }
                override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                    val uri = request?.url ?: return true
                    return uri.scheme != "https" || uri.host != "appassets.androidplatform.net" ||
                        !uri.path.orEmpty().startsWith("/assets/")
                }
            }
        }
        setContentView(reader)
        // All HTML/CSS/JS, including the independent GPL dictionary data, are
        // served from APK assets by WebViewAssetLoader — no network permission.
        reader.loadUrl("https://appassets.androidplatform.net/assets/index.html")
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                reader.evaluateJavascript(
                    "Boolean(document.getElementById('modals')?.innerHTML)"
                ) { modalOpen ->
                    if (modalOpen == "true") {
                        reader.evaluateJavascript("closeSheet();", null)
                    } else {
                        // Android system Back must dismiss the locale-aware library
                        // drawer before exiting the app. This mirrors Escape/backdrop
                        // handling in lingua-shell.js without altering reader history.
                        reader.evaluateJavascript(
                            "Boolean(window.LinguaShell && window.LinguaShell.isDrawerOpen())"
                        ) { drawerOpen ->
                            if (drawerOpen == "true") {
                                reader.evaluateJavascript("window.LinguaShell.closeDrawer();", null)
                            } else {
                                reader.evaluateJavascript("state.page") { page ->
                                    if (page == "\"library\"") finish()
                                    else reader.evaluateJavascript(
                                        "(function(){if(state.page==='translation'){backToReader();}" +
                                        "else{libraryBack();}})();", null
                                    )
                                }
                            }
                        }
                    }
                }
            }
        })
    }

    override fun onPause() {
        if (::reader.isInitialized) {
            // Stop Web Audio before Android backgrounds the WebView; release is also
            // performed natively so a paused JS event loop cannot retain audio focus.
            reader.evaluateJavascript(
                "window.LinguaAmbience && window.LinguaAmbience.pauseFromNative && window.LinguaAmbience.pauseFromNative();",
                null
            )
            reader.onPause()
        }
        abandonReaderAudioFocus()
        super.onPause()
    }

    override fun onResume() {
        super.onResume()
        if (::reader.isInitialized) reader.onResume()
    }

    override fun onDestroy() {
        abandonReaderAudioFocus()
        if (::reader.isInitialized) {
            reader.stopLoading()
            reader.destroy()
        }
        super.onDestroy()
    }
}
