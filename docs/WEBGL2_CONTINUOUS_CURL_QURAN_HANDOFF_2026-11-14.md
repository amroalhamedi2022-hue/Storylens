# Lingua Tales — WebGL2 Curl v2 and Quran safety boundary

## Runtime in Storylens
- index.html loads offline MIT html2canvas 1.4.1 and lingua-curl-v2.js before the existing physical-page-curl.js.
- LinguaReaderCurl remains the original public API for touch, control buttons, Back, cancel, progress events, dictionary and bookmarks.
- On drag lock the existing HTML facets appear immediately. Once temporary inert DOM snapshots of the current page's front and reverse are both uploaded, the WebGL2 canvas replaces the facets for the remainder of that turn.
- The actual DOM is interactive at rest. The GPU renders one indexed mesh with a mathematically continuous bend, back textures, ambient lighting and fwidth anti-aliasing, not 22 CSS-trimmed cards.
- The new spring is time-based with <=8ms integration steps. Snapshot failure or missing WebGL2 leaves the old reader available. All assets are packaged locally; no CDN or network calls.
- The snapshot implementation is local html2canvas, NOT an Android-native screenshot API. Advanced CSS and original-color art may expose rasterization errors; verify with actual held-paper screenshots and device tests.
- Run tools/lingua-curl-v2.test.cjs, tools/lingua-curl-v2-browser.cjs, existing physical-page-curl-browser.cjs and Android CI on the exact commit. DO NOT claim real Xiaomi Pad 5 120fps, signed production APK or certified device quality without direct evidence.

## Quran handoff (future ONLY)
- The Quran application is Kotlin/Jetpack Compose, NOT a WebView reader. Do not copy this JS runtime or html2canvas into Quran's production Compose reader.
- QuranAssetVerifier must first authenticate the unchanged original 604 PNG files against an approved external manifest. The original page image remains the idle reading source.
- Port only continuous mesh/curl physics into a native GLES layer, with verified original decoded page textures. A failure in bytes, page order, manifest trust, image dimension, rendering or content integrity HALTS the turn; never substitute new text, OCR, or generated Quran art.
- Every texture handed to a renderer must come from independently recomputed SHA-256 bytes matched to the trusted manifest, not from a hash claimed by the asset itself. No repainting/color transformations of Quran ink in idle mode.
- quran-safe-curl-adapter.js is an inactive prototype of this API. It is not loaded by Lingua Tales and must be adapted to Kotlin for Quran. No modifications to the Quran project text or 604 images were made here.
- Correct RTL page binding and authentic Arabic backface orientation must be checked visually. No technical checksum proves religious certification.
