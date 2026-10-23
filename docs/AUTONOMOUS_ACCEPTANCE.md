# StoryLens — Autonomous acceptance evidence

AUTOMATION_COMPLETE: IN_PROGRESS

## 2026-10-23 — New user-requested Lingua Tales plan (documentation only)
**No app code, icon, animations, localization or performance change was implemented in this planning update.** The screenshot is a visual reference; see `docs/LINGUA_TALES_REBRAND_UX_PERFORMANCE_I18N_PLAN.md` for detailed acceptance gates.

| New requirement | Status | Evidence needed in future development runs |
|---|---|---|
| LT-01 Lingua Tales launcher/in-app rebrand and retained data | NOT TESTED | Code + migration/upgrade tests and on-device labels |
| LT-02 smooth story open **and close** animations | NOT TESTED | Actual UI change, navigation regressions, repeated open/close device evidence |
| LT-03 card-paint optimization / measurable performance | PASS (source/CI); NOT TESTED (device) | Scoped blur/animation reduction and lazy card painting verified in CI at `e64732a206d56c0ae4bcdf5350a6933041f53276`; no Android FPS/RAM baseline or visual parity measurement yet |
| LT-04 modern distinctive Android adaptive icon inspired by Wen Sarafet design quality | NOT TESTED | Icon assets and real launcher mask/theme inspection |
| LT-05 reduced marketing metadata/clutter without loss of features | PASS (source/browser CI); NOT TESTED (device) | Simplified homepage with hero metadata removed, cards prioritized; CI run 39972837571 screenshot artifacts |
| LT-06 complete Arabic/English app UI language toggle; keep English story/Arabic translations | NOT TESTED | i18n catalogs, RTL/LTR, offline save/restore and bilingual flow tests |

## 2026-10-23 — LT-03 paint budget (production code + test, not device benchmark)
- **Production:** `app/src/main/assets/liquid-aurora.css` now disables repeated live `backdrop-filter` and card-reveal animations only on library shelf cards; replaces them with a translucent gradient retaining Liquid colors, cover art, hover transforms, hero/orb and modal glass. Uses `content-visibility:auto` with approximate intrinsic card size to skip offscreen card paint in compatible WebView. This is a targeted potential jank reduction, **not** a measured FPS improvement.
- **Regression:** `tools/library-experience.test.cjs` asserts scoped paint override, gradient/cover retention and reduced-motion support; existing library, reader, offline dictionary and browser flow tests still run.
- **PASS (CI on exact source+test SHA `e64732a206d56c0ae4bcdf5350a6933041f53276`):** [Actions run 39962712916](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/39962712916), job `120444495073`, confirmed log `PASS: LT-03 scoped card paint optimization retains Liquid visuals and reduced-motion support`, `BUILD SUCCESSFUL`, reader/browser journey PASS. APK artifact ID `12504174717`, screenshot artifact ID `12505351887`.
- **NOT TESTED:** Xiaomi Pad 5 FPS/frame timing, RAM/CPU, user-perceived scroll jank, side-by-side screenshot review, repeated story open/close animations, RTL/i18n. Mark LT-03 fully PASS only after same-device baseline and improved measurements.
- **Next:** LT-02 open/close transitions with reduced-motion and state/scroll preservation; do not add expensive animation layers.

## 2026-10-23 — Reader navigation regression (production + tests)
- **Production fix:** `app/src/main/assets/reader-experience.js` now routes chapter picker and bookmark jumps through the live `renderReader()` enhancement chain instead of bypassing it with the captured base `originalReader()`. This restores sentence keyboard focus, long-press sentence translation, bookmark marker, saved read progress, and later reader preferences after navigation. The fix is independent of dictionary edits and stays in existing PR #1.
- **Regression:** `tools/reader-experience.test.cjs` runs the real enhancement script inside a deterministic Node VM, checks both navigation paths, sentence accessibility, translation listener binding, progress persistence and scroll restoration. CI workflow executes it before APK packaging.
- **PASS on source+test SHA `f8bfdd99f2d69d9684783b588dbcaabbf2e1fd4e`:** [GitHub Actions run 39954824587](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/39954824587), job `120417924749`, verified log contains `PASS: chapter and bookmark navigation preserve enhanced reader accessibility, translation and progress`. Gradle unit tests, Android Debug APK build, APK asset verification and browser UI flow also succeeded. Artifact `StoryLens-Debug-APK` ID `12502321256`, screenshots ID `12502191746`.
- **NOT TESTED:** physical Android installation, process death, TalkBack accessibility, actual long-press gesture on Xiaomi Pad 5, all content translations, visual fidelity to approved screenshot. The Node VM regression is not a physical-device test.
- **Remaining:** continue auditing inflected idioms and dictionary coverage, curate full story catalog, test offline reading/saved vocabulary/backup on Android, then independent acceptance recheck. No auto-merge or public release.


Last source review: 2026-10-23 (branch `automation/storylens-dictionary-saved-words-20261023`).
Production code changed in this iteration: **YES** — `app/src/main/assets/index.html` and `tools/build_freedict.py`.
Base reference: `main@c2117c5ca1a09afb8e923770857aa0dbfc777f20`.
Verified PR CI for source+tests at `2a3dc0ec1fa6b26336488d70c20e446a9f8a5bc9`: https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/39947411826 (SUCCESS, 2026-10-23). APK artifact #12498568304 and UI screenshot artifact #12498254394 uploaded. Later documentation-only commits require checking their own CI status; no on-device tests.
This record does not assert any physical Android verification.

| Requirement | Status | Evidence / limitation |
|---|---|---|
| Offline English–Arabic dictionary available in APK | PASS (CI packaging) | Verified pinned FreeDict 0.6.3 generated, syntax/functional tests passed, and dictionary + license found in PR APK, run #39947411826. Physical Android launch NOT TESTED. |
| Show up to two distinct dictionary senses where present | PASS (CI) | `python3 tools/test_freedict.py` and `node tools/freedict.test.cjs` passed in run #39947411826. Ordering follows source, not frequency. |
| Never confuse dictionary gloss with verified story-specific sense | PASS (CI) | `node tools/lexicon.test.cjs` executed actual word-sheet rendering for curated, generic, and unknown words, run #39947411826. Human review of all story contexts NOT TESTED. |
| Saved vocabulary retains meaning and original sentence translation | PASS (CI) | `node tools/lexicon.test.cjs` exercised saved cards, dictionary lookup, source sentence and translation rendering, run #39947411826. Android process-death restoration NOT TESTED. |
| Idiom/phrase longest match | NOT TESTED | Existing code examined; broader device and inflection cases still need coverage. |
| Offline story and sentence translation | PASS (base content only) | Existing paired English/Arabic paragraphs and no INTERNET permission in base. No human translation audit of all paragraphs. |
| Full 120-story professionally edited collection | FAIL | Base catalog 24 stories, target 120; editorial review outstanding. |
| Liquid Aurora fidelity and phone/tablet UI | NOT TESTED | Screenshot reference and on-device visual comparison not completed in this iteration. |
| Offline save/review/backup recovery | NOT TESTED | Unit regressions exist; Android cold start, process death, backup/restore and upgrade migration not tested. |
| Android APK builds and installs on Xiaomi Pad 5 | PARTIAL | PR Android unit tests + assembleDebug and packaged assets PASS at run #39947411826, APK artifact #12498568304. Physical install and runtime NOT TESTED. |
| Security, accessibility, performance, rotation and negative cases | NOT TESTED | Require full independent end-to-end QA. |

Next action: obtain physical Android installation/reader tap/save/restart evidence for artifact #12498568304, then quantify remaining missing story-word glosses from the generated FreeDict pack and audit real contextual senses. This documentation update is not a new feature implementation. Do not claim release ready without physical Android install + independent recheck.

## 2026-10-23 — Additional approved requirements (roadmap only)
**Production code changed by this administrative update: NO.** GitHub roadmap file `docs/LINGUA_TALES_REBRAND_UX_PERFORMANCE_I18N_PLAN.md` is the source of truth for detailed acceptance.

| Gate | Status | Future acceptance evidence |
|---|---|---|
| LT-07 real medium/long fiction; new reviewed batches, faithful public-domain edition verification and contextual Arabic translation | NOT TESTED | Chapter inventory, source/license records, editorial and dictionary tests |
| LT-08 in-reader context-matched images with legal source/asset provenance and attractive focal-point cropping/feathering | NOT TESTED | Image catalog, chapter anchors, offline mobile screenshots and performance |
| LT-09 category drawer at Arabic right/English left and corresponding edge swipe, without homepage clutter | PASS (source/VM/browser CI); NOT TESTED (device) | RTL/LTR swipe + Escape tests; categories, levels, sort, actions in drawer; run 39972837571 |
| LT-10 centralize theme controls in Settings | PARTIAL PASS (source/CI); NOT TESTED (device) | Theme gallery and offline persistence implemented; audio/fonts/language settings still pending |
| LT-11 optional playback-only UI effects and ~20 licensed music/nature ambiences; no microphone or TTS | NOT TESTED | License/asset audit, audio-focus, background, offline and CPU/RAM checks |
| LT-12 selectable separate Arabic/English fonts and typography | NOT TESTED | RTL/LTR readability, licensed assets and preserved state |
| LT-13 each substantive development/content batch adds one *genuinely visually different* functional theme, not just a palette shift, while runtime remains smooth | PARTIAL PASS (source/CI); NOT TESTED (theme visual/device performance) | Paper Atlas editorial layout, static compass, warm paper cards; run 39972837571; no Pad 5 FPS/RAM or Paper Atlas screenshot yet |

A plan or screenshot is **not** proof of implementation, and not every small hourly task automatically creates a theme. Track real batched deliveries, with standalone independent recheck when all features are satisfied.


## 2026-10-23 — LT-05 / LT-09 / LT-10 / LT-13: production shell and distinct Paper Atlas
- **Production source SHA:** `ccc8da7a5ba9c5aef5db2173227af6e4323f7fe7` on existing draft PR #1. Added `lingua-shell.js` and `lingua-shell.css`; wired after backup/library/reader wrappers in `index.html`; `library-experience.js` rehomes refreshed discovery controls into the menu; `data-backup.js` accepts `paper-atlas` theme in validated backups.
- **LT-05:** removed redundant brand copy, marketing metrics, repeated descriptions and oversized home controls, preserving cards, reader, offline words, review and backup behind the menu. Browser screenshots show a shorter, content-first library.
- **LT-09:** category/genre drawer opens at top-right in Arabic and top-left in English (based on HTML dir), with corresponding right/left edge swipe, reverse swipe, backdrop click and Escape; favorite/level/sort/search and learning actions remain functional. Tests check directional swipes, closed-drawer inert state, rehome hook and no repeated move.
- **LT-10:** theme picker moved to a dedicated Settings overlay; selection persists in the existing `storylens_uiTheme` key, and old themes remain selectable. Other Settings modules (fonts, language, audio) are **not implemented**.
- **LT-13:** new **Paper Atlas** theme changes page geometry, editorial card orientation, header and hero layout, compass ornament and warm paper palette; not a hue-only swap. Static CSS art avoids animated full-screen filters. **No device performance evidence** yet.
- **PASS GitHub CI on exact production SHA:** [Actions run 39972837571](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/39972837571) completed successfully: Node regression (`PASS: Lingua Tales shell RTL/LTR swipe, theme persistence, backup and Paper Atlas layout gates`), offline dictionary/content tests, Gradle unit tests and Debug APK, browser flow smoke and library/reader/backup screenshots. APK artifact **12509033991**, screenshots **12509473831**. Earlier APK at run 39971652217 was unpacked locally and verified to contain `assets/lingua-shell.js` and `assets/lingua-shell.css`; the latest run's artifact has not yet been unpacked in this record.
- **Additional isolated V8 execution:** actual `lingua-shell.js` verified with RTL swipe, rehome-once, persisted theme, no unknown theme and Escape; **not a substitute** for Android gesture/device tests.
- **NOT TESTED:** Xiaomi Pad 5 visual parity and real FPS/RAM/CPU, Android physical system back, full English locale switch (LT-06), Paper Atlas screenshot at selected theme, all 20 audio assets, fonts, story animations, long books and inline images. No claims of fully completed app or independent second-pass verification.
- **Next:** implement LT-02 story open/close animations preserving scroll/back-stack and reduced-motion, then full LT-06/12 localization/fonts; continue a genuinely different theme per next substantial batch and measure device performance.


## 2026-10-23 — LT-02 reader transitions and second distinct theme
- **Actual production source** on draft PR #1: `lingua-shell.js` now wraps the existing reader open/back path with a cancellable 190ms composited entrance/exit, native same-document history Back handling with a bounded WebView fallback, saved reader chapter scroll and restored library scroll. The system-back handler first dismisses an open modal; translation Back returns to the reader. `prefers-reduced-motion` disables motion. No reader content/lexicon/SRS keys were changed.
- **New LT-13 theme:** **Midnight Library**, fully selectable alongside Paper Atlas/Nebula/Aurora/Aqua. Unlike Paper Atlas, it uses ink-blue and brass, static bookshelf rails, narrow book-spine cards, a centered illuminated title plate and a dark reading treatment. No per-frame particles or live card blur. Offline backup validator accepts `midnight-library`.
- **Source/test commit SHA:** `32f0759628154dc057122e6b03e6357145b76e95`; preceding production commits `cc932ce07a8a7375cc44b52135e6d51a40ca18a6` (navigation/theme registry), `a1871e4d39ead05712f8c06ebc29cd2cc811b7f3` (CSS), `c30f496318aa739e6339ed8a8f3139289f8ebb97` (backup).
- **PASS CI on exact source/test SHA:** [GitHub Actions run 39980833626](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/39980833626) completed success: verified dictionary, offline catalog/JS including production navigation VM (rapid double-back, scroll restoration, modal back, reduced-motion), Gradle Debug APK, packaged-asset checks, Chrome smoke and screenshots. APK artifact **12512897827**, screenshots artifact **12513302194**.
- **LT-02 status:** **PARTIAL PASS (source/CI)**; **NOT TESTED** on real Android system-back gestures, repeated physical transitions, long chapters, rotation, real Pad 5 jank/FPS/RAM and independent device recheck. Browser screenshots were not captured with Midnight Library selected; do not infer visual QA from default-theme screenshots.
- **LT-13 status:** **PARTIAL PASS (source/CI)** for a second visually distinct functional theme, **NOT TESTED** device screenshots/contrast and performance. LT-03 measured CPU/RAM/FPS still NOT TESTED.
- **Next:** exercise reader transitions and Midnight Library on Xiaomi Pad 5; implement LT-06 full bilingual UI and LT-12 font selectors, then LT-07 long books, LT-08 inline art and LT-11 licensed audio in substantive batches with a new distinct theme for each batch. No auto-merge, paid APIs or public release.
