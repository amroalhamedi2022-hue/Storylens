package com.storylens.reader

import android.annotation.SuppressLint
import android.graphics.Color
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
                reader.evaluateJavascript("state.page") { page ->
                    if (page == "\"library\"") {
                        finish()
                    } else {
                        reader.evaluateJavascript(
                            "(function(){if(document.getElementById('modals').innerHTML){closeSheet();}" +
                            "else if(state.page==='translation'){backToReader();}" +
                            "else{libraryBack();}})();", null
                        )
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
