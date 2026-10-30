# Lingua Tales — Verified execution checkpoint (2026-10-30)

## Scope and exact evidence

Working PR: https://github.com/amroalhamedi2022-hue/Storylens/pull/1
Latest functional source/test HEAD **fb9c3a485d9a97284bd39a0dc84d8fb7d75adeb6**.
Exact-functional-head GitHub Actions run **40978972828**: https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40978972828 — **SUCCESS**.
Earlier source milestone **5c04fc22fdf575ab688d9698ca350db0acf887c7** also passed [run 40974140412](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40974140412).
The previous two audio checkpoints also passed CI: runs **40972320083** and **40972994977**.
Do not treat historical 2026-10-28 partial acceptance narratives as evidence of missing features that are already implemented and tested in current HEAD.

### 2026-10-30 — Additional audio race and RTL paper fixes

- **Recorded ambience playback race fixed:** an older, still-pending HTMLAudioElement.play() promise cannot pause a newer request for the same recording. Also detect a play() promise that resolves while the element is already paused, rather than incorrectly reporting sound as playing. Regression scenarios added to `tools/licensed-audio.test.cjs` (including a reused loop after a one-shot sound). This improves correctness and diagnostics but **does not prove the original sub-second interruption is cured on Android hardware**.
- **Held paper direction fixed for RTL:** right edge goes backward and left edge advances when the UI is RTL; LTR keeps the opposite behavior. This now agrees with the existing touch-swipe fallback and blocks backward turning at the true first-page edge. Four direction cases execute the actual helper in `tools/ux-2026-10-29.test.cjs`. True deformable paper mesh and device gesture acceptance remain **NOT TESTED / INCOMPLETE**.
- **CI PASS:** [run 40978972828](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40978972828) passed content/Node tests, Android Gradle tests and Debug APK, package identity checks, and complete Chromium reader screenshot journeys. An intermediate [run 40978869920](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40978869920) **FAILED** due to a test's assumption that the latest Audio instance was the loop rather than a previously-created SFX; corrected and retested in the successful run.
- CI debug preview artifact **12944510692** and screenshots artifact **12943907381**. CI reported APK SHA-256 `74a3a0b4df6ee6f1b87eba05f2772453928417bf5e12c22b2129547a6d93512b`, `versionCode=100654`, ephemeral Debug certificate SHA-256 `7b31b076cb301ff2fdaf15a023cced38390783f9845f81a8e30a5e3b2a5d4bd2`. **Independent artifact rehash NOT TESTED.** No production-signed update was emitted.
- The old preview artifact and certificate described below belong to the **previous** CI milestone and must not be mistaken for the latest build.

### Production changes (actual code)

1. Android WebView media focus: removed the Activity's competing native AudioManager focus request because Chromium's own HTMLAudio/Web Audio focus acquisition could trigger a false native LOSS and interrupt recording almost immediately. The local JS bridge remains for compatibility but returns success and leaves focus arbitration to Chromium. Activity.onPause now explicitly pauses BOTH licensed OGG playback and procedural Web Audio. Regression: `tools/test_lingua_audio_focus.py`, CI PASS. **Physical sound playback remains NOT TESTED.**
2. Recorded sound user diagnostics: `lingua-licensed-audio.js` now handles audio decoder/media errors and unexpected post-start pauses by clearing stale playback state, invalidating in-flight play promises, displaying a persistent bilingual diagnostic with error code and allowing retry. Existing `tools/licensed-audio.test.cjs` now tests media decode failure, retention of diagnostics when sliders refresh, and unexpected pause/replay. CI PASS.
3. Touch, compact library, realistic interactive page-edge drag, English headings, reversible theme hiding/recolor, Liquid 27 theme and approved book-and-petals launcher artwork were implemented by preceding PR commits. Do NOT duplicate these implementations; physical touch/paper realism and Xiaomi Pad 5 performance are NOT TESTED. Current CI passed these integrated assets and browser journeys.
4. New original investigation novella **The Ninth Ledger**, `app/src/main/assets/novella-ninth-ledger.js`: 5 complete chapters, 40 paired English/Arabic prose paragraphs, **1,531 English words**, 12 source-occurring contextual glossary terms. It is **new original bilingual fiction**, not a public-domain translation. `app/src/main/assets/index.html` registers it before deferred local illustrations. `tools/editorial.test.cjs` now validates 45 total discovered entries; `tools/ninth-ledger.test.cjs` checks chapter completeness, authentic Arabic pairings, 5 generated offline SVG chapter illustrations, grammar-free text integrity and sourced glossary phrases. Android workflow calls the regression and checks the source module inside the APK. CI PASS. **Independent literary and legal terminology editing remains NOT TESTED.** This is a novella installment, not fulfillment of the target of approximately 120 substantial adult stories.

### Verified APK artifact and integrity (NOT a final production update)

- CI preview artifact ID **12941662918**: `Lingua-Tales-Preview-NOT-PRODUCTION-UPDATE`.
- Independently inspected extracted APK: **27,808,253 bytes**.
- SHA-256: **35243a0fc15020d0d68a66c5cde3de7b70f94b036c52d667537f993dccbf5af7**, recomputed and MATCHES `APK_SHA256.txt`.
- APK ZIP integrity PASS; bundled `assets/novella-ninth-ledger.js`, `assets/index.html`, and `assets/lingua-licensed-audio.js` confirmed.
- Android package inside APK: `com.storylens.reader.preview`, `versionCode=100648`.
- Signing certificate SHA-256: `284a7758f5c73186664bbb1d06e3009043ed53e79b7272ee25f04b7d400a4771`.
- Signing mode: **ephemeral CI Debug**. Signed production Release artifact was **SKIPPED** because stable signing secrets are absent. Preview cannot replace production `com.storylens.reader`, and a future CI Preview can conflict with this Preview due to a new certificate.

### Open gates — do not claim final completion

- Physical Android playback and audible duration, notification/phone call interruption, media permissions and Android System WebView compatibility — **NOT TESTED**.
- Physical 120 Hz smoothness, startup, scroll/drag frame time, memory/thermal and touch interaction — **NOT TESTED**.
- Finger-held realistic page-curl visual acceptance and real user gesture quality — **NOT TESTED**; source and browser regressions are not equivalent.
- Artistically exact Liquid iOS style acceptance and all theme color/hide/restore interactions on hardware — **NOT TESTED**.
- Complete requested long-form story catalog, independent Arabic editorial review and territorial literary source rights for classics — **INCOMPLETE / NOT TESTED**.
- Production signing: require retained private keystore (ideally the same one as the installed production app), configured only in GitHub Actions secrets; NEVER commit passwords/keys. If old signature unavailable, export backup, do a one-time uninstall/reinstall, restore, then retain one permanent signing key for every later production update. Do not change application ID merely to hide conflicts.

### Next implementation priorities (for hourly automation and manual sessions)

Start from the actual newest branch HEAD and checks, including any concurrent Codex commits; avoid reimplementing work above.
1. If user reports that sound still stops after this build, use visible diagnostic and compare Android System WebView/media decoder events; fix a reproduced cause and add a regression. Do not claim repaired on device without evidence.
2. Improve physical page curl and responsive performance, preserving word selection, RTL/LTR and accessibility, and profile the Xiaomi Pad 5 before promising 120Hz.
3. Expand the substantial, adult original bilingual mystery/thriller catalog in complete arcs; verify actual paragraph, word, dictionary and art counts instead of creating placeholder stories.
4. Re-check all earlier LT-01..LT-13, LT-R14/R15, and user screenshot-driven requests against actual source; then arrange a stable-signed production release.

No main merge, no paid API, no publishing an untested Release. Documentation-only changes after this source SHA do not require an automatic APK rebuild.
