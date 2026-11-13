# Lingua Tales: eBook core / physical page-fold stabilization — 2026-11-13

## Live branch and exact source evidence

- Repository: `amroalhamedi2022-hue/Storylens` (Android package `com.storylens.reader`).
- Integration PR: https://github.com/amroalhamedi2022-hue/Storylens/pull/87
- Branch: `fix/ebook-paper-curl-core-20261113`, based on `main` SHA `a82a9c9ed29b4ff615be98ba11b00b548991985e`.
- Android CI: https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/43401540367 (running when drafted). Verify exact PR head before claiming passing.
- The installed APK is NOT updated by this PR, and this status does not imply tablet acceptance.

## Real code changes

1. `app/src/main/assets/physical-page-curl.js`: allocate the 22 geometric shells without cloning all full-page text/illustrations up front. Each geometrically visible face receives one inert local ink copy when needed, retained for its transaction. No runtime network, no duplicate live token listeners, no changed source text.
2. `app/src/main/assets/reader-experience.js`: measure actual paper-height budget (portrait viewport-118, landscape viewport-82) consistent with final CSS rather than 72vh. Existing paragraph-anchor persistence remains.
3. `app/src/main/assets/lt-final-experience.css`: restore visible, usable touch-size Previous/Next controls in portrait, including when the Android system owns swipe navigation near a screen edge. Landscape on-demand chrome remains.
4. `tools/physical-page-curl-browser.cjs`: assert only visible facets hold page DOM, and portrait Next touch control has a real hit box.
5. `docs/PHYSICAL_PAGE_CURL_API.md`: research and integration contract updated.

## Evaluated eBook / open-source engines

- StPageFlip (MIT): HTML-pages useful reference, but its clipping + rotation is less deformable, and idle redraw would add battery/thermal cost.
- harism/android-pagecurl & eschao/android-PageFlip (Apache-2.0): good OpenGL 3D paper reference, but native texture rendering cannot directly host the app's current interactive HTML tokens.
- Compose PageCurl: native modern approach, requires changing present WebView renderer, dictionary and bilingual DOM.
- Readium Mobile: excellent standards-based EPUB pagination/storage reference, but a new EPUB pipeline cannot be dropped into the current bundled interactive story UI as a styling change.

No third-party source, binaries or unauthorized images imported.

## Acceptance still required

- Exact-head Node/Chromium/Android CI green; inspect screenshot artifact and gesture semantics, no fake completion.
- Real System WebView on phone/tablet: portrait one page; landscape two physically ordered pages; LTR/RTL; pinch/lookup; cancel/settle; reverse/next chapter; font reflow and anchors; TalkBack.
- Real Xiaomi Pad 5 frame pacing and responsiveness while turning illustrated/bilingual pages; do not claim 120fps without captured device evidence.
- For an installable update: same retained owner signing certificate, unchanged package, monotonic versionCode and verified signed APK. Never create a new signing key.

**Owner feedback:** old reader not usable. Treat actual touch operation and physical-device checks as the release blocker; code-only success is insufficient.
