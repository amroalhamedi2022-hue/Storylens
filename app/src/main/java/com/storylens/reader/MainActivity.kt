package com.storylens.reader

import android.annotation.SuppressLint
import android.graphics.Color
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat

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
                override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                    val uri = request?.url ?: return true
                    return uri.scheme != "https" || uri.host != "appassets.androidplatform.net"
                }
            }
        }
        setContentView(reader)
        val html = assets.open("index.html").bufferedReader(Charsets.UTF_8).use { it.readText() }
        reader.loadDataWithBaseURL(
            "https://appassets.androidplatform.net/assets/index.html",
            html, "text/html", "UTF-8", null
        )
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                reader.evaluateJavascript(
                    "(function(){if(document.getElementById('modals').innerHTML){closeSheet();}" +
                    "else if(state.page==='translation'){backToReader();}" +
                    "else{libraryBack();}})();", null
                )
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
