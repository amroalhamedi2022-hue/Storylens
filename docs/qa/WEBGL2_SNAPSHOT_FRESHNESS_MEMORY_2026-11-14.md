# WebGL2 reader — snapshot correctness and memory acceptance

Source branch: `fix/webgl2-page-texture-freshness-memory-20261114` (based on merged WebGL2 main `be3a7e7e3a1493ce25e0f65d55f173e03efaa3e7`).

## Problem
The previous WebGL2 warm-cache was indexed only by page DOM identity, width, height and scale. Changing visible text, styling, theme or an image-load state without repagination could leave a stale bitmap on the curling paper even though idle interactive HTML had updated. A four-page cache could retain four full-size RGBA canvases after a chapter change; the app had no Android memory-pressure eviction.

## Real changes
- Compare a page visual signature (inner HTML; body/reader/page classes; relevant computed typography/paper styles; images' source/loaded dimensions) before returning an existing texture.
- Recheck the signature **after** asynchronous html2canvas work. Fail the GPU animation back to the pre-existing HTML curl if the visible page changed mid-capture; do not show stale text.
- Bound idle rasterization to about **2.4 million pixels per page** and temporary cache allocations to **24 MiB**, with LRU eviction. This affects only transient GPU snapshots, never the original story illustrations or saved progress.
- Idle pre-rendering is skipped when app is backgrounded, reader is not connected, word-sheet modal is open or the turn is active. Release cached canvas references on native `onPause` and `onTrimMemory` while preserving all real DOM and storage.
- Keep background warm-up failures separate from the active gesture error state. Reader still runs via its existing HTML fallback if WebGL2/screenshotting cannot run.

## Required verification
- Exact PR Android CI, legacy 22-facet fallback, Wen Glass, dictionary, bilingual passage and chapter navigation all pass.
- Real Chromium WebGL2 test: prewarm the current/adjacent page, change and restore foreground ink color, assert each triggers a *new* capture; verify memory estimate ≤24 MiB and explicit cache release.
- Real Xiaomi Pad 5 and signed production update require separate proof. No changes to package, keystore, literary source text, Quran source, local saved words, or app network permissions.
