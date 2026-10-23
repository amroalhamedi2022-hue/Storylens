package com.storylens.reader

import android.annotation.SuppressLint
import android.graphics.Color
import android.net.Uri
import android.webkit.JavascriptInterface
import org.json.JSONObject
import java.io.ByteArrayOutputStream
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
    private val maxBackupBytes = 3_000_000

    private val exportDocument = registerForActivityResult(
        ActivityResultContracts.CreateDocument("application/json")
    ) { uri: Uri? ->
        val text = pendingExport
        pendingExport = null
        if (uri != null && text != null) {
            try {
                val output = contentResolver.openOutputStream(uri)
                    ?: throw IllegalStateException("تعذّر فتح الملف للحفظ.")
                output.use { it.write(text.toByteArray(Charsets.UTF_8)) }
                notifyBackup("nativeError", "تم حفظ النسخة الاحتياطية في الموقع الذي اخترته.")
            } catch (ex: Exception) {
                notifyBackup("nativeError", "تعذّر حفظ النسخة الاحتياطية: " + (ex.message ?: "خطأ في الملفات"))
            }
        }
    }

    private val importDocument = registerForActivityResult(
        ActivityResultContracts.OpenDocument()
    ) { uri: Uri? ->
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
            notifyBackup("receiveImport", bytes.toString(Charsets.UTF_8.name()))
        } catch (ex: Exception) {
            notifyBackup("nativeError", "تعذّر استيراد الملف: " + (ex.message ?: "خطأ في الملفات"))
        }
    }

    /** Only exposed to local APK JavaScript; does not access the Internet. */
    private inner class OfflineBackupBridge {
        @JavascriptInterface
        fun saveBackup(json: String) {
            if (json.toByteArray(Charsets.UTF_8).size > maxBackupBytes) {
                runOnUiThread { notifyBackup("nativeError", "النسخة كبيرة جدًا.") }
                return
            }
            runOnUiThread {
                pendingExport = json
                exportDocument.launch("LinguaTales-backup.json")
            }
        }

        @JavascriptInterface
        fun openBackup() {
            runOnUiThread {
                importDocument.launch(arrayOf("application/json", "text/plain", "application/octet-stream"))
            }
        }
    }

    private fun notifyBackup(method: String, data: String) {
        if (!::reader.isInitialized) return
        // Method names are fixed, and JSONObject.quote safely escapes file content.
        if (method != "receiveImport" && method != "nativeError") return
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
            webChromeClient = WebChromeClient()
            webViewClient = object : WebViewClient() {
                override fun shouldInterceptRequest(view: WebView?, request: WebResourceRequest?): WebResourceResponse? {
                    val url = request?.url ?: return null
                    return if (url.scheme == "https" && url.host == "appassets.androidplatform.net") {
                        assetLoader.shouldInterceptRequest(url)
                    } else null
                }
                override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                    val uri = request?.url ?: return true
                    return uri.scheme != "https" || uri.host != "appassets.androidplatform.net"
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

    override fun onDestroy() {
        if (::reader.isInitialized) {
            reader.stopLoading()
            reader.destroy()
        }
        super.onDestroy()
    }
}
