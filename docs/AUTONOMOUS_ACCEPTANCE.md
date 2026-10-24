# StoryLens — Autonomous acceptance evidence

## 2026-10-24 — Backup quota-safe rollback and malformed card-field rejection (source-only)
- **Production commit:** `58a9f540e45eb26d82f7d72202ec6d7e2e1f0a5b`; **regression commit:** `fd395a46e8127bd5f1fa67ac224a4a4eb3d95f0b` on draft PR #1; `main` unchanged.
- **Fix:** On a storage-quota failure during import, rollback now restores smaller previous values and removes newly created keys before restoring larger old values. This avoids losing previously saved words when a forward-order rollback itself exceeds quota. If rollback cannot finish, the user receives an explicit data-safety warning. Optional saved-card fields now reject numeric/boolean values while retaining absent/null/string compatibility.
- **PASS:** Actual modified production JavaScript parsed and executed in V8 against a byte-limited localStorage mock. Import failed on the third write, all three original values were restored, and a malformed numeric card meaning was rejected. Regression assertions were committed to `tools/data-backup.test.cjs` and its syntax parsed.
- **NOT TESTED:** Full Node test suite, committed regression script under Node, Android SAF quota behavior, physical device, APK, performance and offline acceptance. No APK or GitHub Actions dispatched.
- **Outstanding:** Approved icon source not available in this run; do not invent replacement. LT-01..LT-13 and device gates remain IN_PROGRESS.


## 2026-10-24 — Reader accessibility: preserve spoken story text (source-only)
- **Production SHA:** `b90e164678903dc98153b94c22c7a15afea5b067`; **regression SHA:** `9234fd21681fb8e9d43aacc2dd696b868b0ea891` (draft PR #1; `main` untouched).
- **Fix:** Replaced generic per-sentence `aria-label` with `aria-description` in `reader-experience.js`. An `aria-label` masks the actual English sentence for screen readers; the optional instructions now accompany, rather than replace, the source story text. Arabic translations remain unchanged.
- **PASS:** Executed the committed reader, bookmark-navigation and inline-illustration regression scripts in a V8 CommonJS/VM compatibility harness using the actual committed production source (3 scripts). Production JavaScript and regression script syntax parsed successfully.
- **NOT TESTED:** Native Node.js execution of the full suite, Android TalkBack behavior, Android packaging/installation, actual sentence pronunciation by screen reader, performance and offline device QA. V8 compatibility is not a device accessibility test.
- **CI policy:** `[skip ci]` commits; 0 PR workflow runs reported for regression SHA when checked. No APK created or Actions build dispatched.
- **Open:** LT-01..LT-13 remain incomplete; user-approved icon asset is not yet integrated. No Library/Handoff access.


AUTOMATION_COMPLETE: IN_PROGRESS

## 2026-10-24 — Backup consistency and bilingual control hardening (source-only)
- **Production commit** `cb5a71fc8e1012ed293bda78abd800a627f16b02`; **test commit** `84a8e307e81bdca4eb1f8e2cbd82d1c5011728ac` (PR #1, no main write).
- **Fix:** `data-backup.js` now refuses exports with more than 900 valid keys instead of producing a JSON archive its own importer rejects; English interface shows English Backup label/accessibility name; a superseded/invalid backup preview revokes its old confirmation button, preventing accidental restoration of another snapshot.
- **PASS:** 6 direct V8 executions of the modified production backup module: English button and accessibility label, valid backup export, >900-entry export refusal, valid preview, stale confirmation refusing to mutate, latest confirmation restoring the intended snapshot. Test file JavaScript syntax checked in V8.
- **NOT TESTED:** full Node regression suite (`node tools/data-backup.test.cjs`), Android CI, APK packaging, actual SAF import/export, physical device upgrade and independent recheck. Node regression assertions were committed but **not executed** in this run.
- **Build policy:** all new commits carry `[skip ci]`; no build or workflow dispatch requested. PR head at source/test checkpoint `84a8e307` had no PR workflow runs when checked. The existing PR workflow assembles an APK, so source-only commits must continue to skip it until final acceptance.
- **Outstanding:** exact user-approved **icon with its text** must be separated from the approved visual reference and integrated as Android launcher resources; do not substitute an invented icon. LT-01..LT-13 and real-device acceptance remain IN_PROGRESS.


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


## 2026-10-23 — LT-01 launcher and LT-09 native system Back integration
- **Production changes on existing draft PR #1:** Android `MainActivity.kt` now checks `LinguaShell.isDrawerOpen()` and closes the library drawer before finishing the activity or navigating backward; the HTML/JS drawer gesture implementation remains unchanged. Android launcher label is now **Lingua Tales** in `AndroidManifest.xml`, native backup export filename becomes `LinguaTales-backup.json`, and offline document `<title>` is now Lingua Tales. **No change to `applicationId=com.storylens.reader`, localStorage keys, backup JSON format or package namespace.**
- **Source commits:** native back/backup `db82ae74cee4ad1a1cfa63db9d314219b7604674`; launcher label `36c4ee684effdc17956d14d21385f3e8217333ca`; Node CI regression `6e6654036e4be75efbb542a473f5c2c60a8a3985`; document title `ecb6842a3711eb03582efb06b14510ccefd2ae35`.
- **PASS GitHub CI** on exact earlier source/test SHA `6e6654036e4be75efbb542a473f5c2c60a8a3985`: [run 39988932481](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/39988932481), including Android Gradle debug APK, existing dictionary/reader/backup checks and new manifest/package/Back static contract checks. APK artifact `12516577711`, screenshots artifact `12517236287`. ZIP digest `sha256:9823dd17335025de35dcafd19b0e67038f92e9849e982fa325a173f3d1a3dac8`. This CI run **does not** cover the subsequent HTML title commit.
- **PASS latest title-change source SHA** `ecb6842a3711eb03582efb06b14510ccefd2ae35`: [run 39989290251](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/39989290251) completed success with Android Gradle Debug APK, offline content/lexicon and native source-contract tests, browser smoke/screenshots. APK artifact **12516193613** (ZIP sha256 `fa8a0ab9fb615deebc9fe3be47ab9925f0dac910740d03e2ffe427d43df72279`), screenshot artifact **12516343329**. Extracted Debug APK integrity checked (sha256 `b45a5412201ff50f04b3b25681bcd51ab09aad5afb6ec4a2f7bdadc3432d4d80`). This is not a real-device test.
- **LT-01 PARTIAL PASS** (Android launcher label, backup export name and HTML document title) but full legacy branding audit, UI translation and real update-in-place data continuity **NOT TESTED**.
- **LT-09 PARTIAL PASS** (native Back routing source+static CI) but Android physical Back/gesture, modal priority and repeated rapid Back **NOT TESTED**.
- **LT-03 NOT TESTED:** no Xiaomi Pad 5 CPU/RAM/FPS baseline or after-change measurements. This is a small compatibility batch, not a new LT-13 theme delivery. Previously completed Paper Atlas and Midnight Library remain.
- **Next:** full bilingual UI LT-06 with Arabic translation preserved in English mode, font settings LT-12 and device-backed performance measurements. No auto-merge or release.


## 2026-10-23 — LT-12 independent offline font selectors (production + tests)
- **Production commits:** `e6497d099688d4f2b00470cf7844a3255e42d076` adds separate Arabic (modern/Naskh) and English (literary serif/modern sans) selectors inside Settings, with strict value allowlists and offline persistence under `storylens_fontArabic` and `storylens_fontEnglish`; `6adff243bf6d1016ae98d89f21b67c96c6a5f4ca` adds font-stack CSS for reader text and translations, no remote font requests; `844d6b91d5f4bdbe71d6e316ffb402db9ecc14d7` includes these keys in validated JSON backup/restore.
- **Tests:** `7b4b89b9d3e5a1c6dc08387ee867b9b7e4fc0e04` exercises preference isolation, persistence and malicious value rejection in the real shell VM; `b2d208ec5cd50ad212105bf75f7b7186f154b085` adds backup roundtrip/invalid-font checks.
- **PASS CI on exact source+test SHA `b2d208ec5cd50ad212105bf75f7b7186f154b085`:** [Actions run 39996774207](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/39996774207), build job `120562233677`, Android Gradle unit/build, offline dictionary/catalog tests, JS tests, APK asset verification and browser screenshot steps all succeeded. Debug APK artifact `12520381114`; screenshots artifact `12520700643`. Artifact ZIP and APK archives extracted and integrity-checked locally. Debug APK SHA-256 `72f5808108c2142b18ee506a66b72447c709d708a7b31bd17d4e3d0046818fd1` (4,211,874 bytes). ZIP SHA-256 `e58fd2b30b5f4d8d40ca32da54eaa468a29fafffd9c9390cdbb523e549901214`.
- **PARTIAL PASS (source/CI)** for LT-12, **NOT TESTED** font availability/rendering and RTL shaping on Xiaomi Pad 5; fallback stacks are device-dependent, no bundled font licenses or binary assets. LT-06 full UI bilingual translation, LT-03 physical FPS/RAM, LT-04 approved icon integration, LT-07 long literature, LT-08 in-reader images, LT-11 licensed audio and full independent recheck remain **NOT TESTED**. No new LT-13 theme claimed: this was a focused typography batch.
- **Automation state:** `IN_PROGRESS`. No main write, paid API, auto-merge or public release.

## 2026-10-23 — LT-06 bounded bilingual shell implementation (no APK build)
- **Production changed:** YES. Settings now offers an explicit Arabic/English interface-language selector; `uiLocale` persists under the existing `storylens_` storage prefix, restores on startup, changes `html[lang]`/`html[dir]`, re-renders the library without clearing progress, and localizes the shell header, menu, search and learning shortcuts. The English story body and Arabic learning translations are not rewritten.
- **Backup:** the same version-1 backup format now includes `uiLocale` with an allowlist of `ar`/`en`; unknown locale values are rejected. No applicationId or storage migration.
- **Tests added:** Node VM locale/direction/persistence/rejection and backup allowlist assertions in `tools/library-experience.test.cjs`. A JS syntax/VM smoke was performed in the development runner; full Node suite and Android runtime are **NOT TESTED** in this round.
- **LT-06 status:** PARTIAL / NOT TESTED for full UI translation (reader, dictionary, review, errors and accessibility strings still need a full catalog and bilingual audit). **No APK build or GitHub Actions build requested** per user's final-only build policy.
- **Next:** complete all remaining UI localization via a maintainable catalog, test both directions and persisted reading state, then continue LT-07/08/11 and the approved icon integration when its original asset is accessible.

- **Exact production/test commit:** `0499c900f1c1f123b5b43ef86a6680216f298015` ([PR #1](https://github.com/amroalhamedi2022-hue/Storylens/pull/1)). V8 actual-shell locale smoke **PASS**; full Node suite, Android CI and device **NOT TESTED**. Commit used `[skip ci]` to honor the no-interim-APK policy.

## 2026-10-23 — LT-06 reader-control bilingual pass (source-only; no APK)
- **Production changed: YES.** `reader-experience.js` now chooses Arabic/English interface labels at render time for reader sentence accessibility, saved-bookmark tooltip, chapter progress, reader navigation, bookmark/jump buttons and help text. English source text and the existing Arabic sentence translations are untouched; the older user-facing StoryLens hero eyebrow was rebranded Lingua Tales.
- **Production SHA:** `41ef0d45c0ac9e069cf6ccb92c4e770b825e0deb`; **regression SHA:** `06c7a02ba022307ecda3b1d9e455550c5ad93d32` on existing PR #1.
- **PASS (source test, in-memory V8 harness):** executed committed `tools/reader-experience.test.cjs` against committed `reader-experience.js` with a Node filesystem/VM shim; **24 assertions** passed, including Arabic/English labels, bookmarks, chapter navigation, progress and unchanged Arabic translation. Also parsed production/test JavaScript successfully.
- **NOT TESTED:** native `node tools/reader-experience.test.cjs` in full checkout, whole-suite tests, current SHA GitHub CI, Android compilation, physical Pad 5, complete LT-06 string inventory and offline device state/rotation. **No APK was built**; commits include `[skip ci]` to avoid triggering the PR Android packaging workflow. Current source SHA had no PR workflow run when checked.
- **Next:** complete full LT-06 UI catalog (reader, dictionary, SRS, backup, errors), icon integration LT-04 and remaining LT-07..13, with source tests only until final acceptance build.


## 2026-10-23 — LT-06 backup bilingual UI and immediate locale/font restore (source-only)
- **Production changed: YES.** The real offline JSON backup sheet now renders Arabic or English labels, controls, confirmation and completion feedback from the active UI locale. It preserves version-1 backup compatibility and the legacy `storylens_` storage keys. After explicit restore confirmation, imported `uiLocale`, `fontArabic` and `fontEnglish` are reapplied through `LinguaShell` immediately, before the library redraw; no restart needed. Invalid follow-up import clears staged data. No network, permissions or app identity changes.
- **Production + regression commit:** `02df291d373e7e050df6b09c5a058f25da158109` on draft PR #1. `tools/data-backup.test.cjs` adds a real-module VM bilingual dialog/confirmed-restore/invalid-input regression.
- **PASS (isolated actual production JS):** executed the modified `data-backup.js` in an in-memory V8 DOM/storage harness; English and Arabic sheet text, confirmed restore of locale + both fonts, and malformed JSON rejection passed. JS syntax parsed successfully. **NOT TESTED:** native `node tools/data-backup.test.cjs` against a full checkout, full Node suite, Android CI on this SHA, real device import and restart. The repository test is authored but was not executed here.
- **CI:** deliberately skipped via `[skip ci]` in the commit message under the final-only APK policy. **APK:** none built for this SHA. **LT-06/LT-12:** PARTIAL source PASS; full localization/font rendering remains NOT TESTED. No new LT-13 theme or icon is claimed.
- **Next:** finish dictionary/review/error i18n, restore validation and all LT-01..13 requirements, then single final Android build and independent real-device recheck. `AUTOMATION_COMPLETE: IN_PROGRESS`.

## 2026-10-24 — LT-06 Settings continuity and bilingual discovery/dictionary controls (source-only)
- **Production:** `lingua-shell.js` now preserves the open Settings dialog when changing UI language, reopens it in the selected locale and restores focus to the language selector after a library redraw; preserves library scroll and offline `uiLocale` preference. Commit `128006dc6e3a98f4e91af174ffda7df92b7b9844`.
- **Production:** `library-experience.js` now localizes discovery favorites, level/sort selectors, counts, empty states, accessibility labels, reading-comfort settings and dictionary sense-choice **UI labels** in Arabic/English. The underlying Arabic dictionary senses, original English stories, storage keys and translation content are unchanged. Commit `0ec872b0d6b86d813245aa6fab33be03e2c7dc24`.
- **Tests authored:** `tools/library-experience.test.cjs` now exercises the exact locale-switch handler in a Node VM (Settings close/reopen/focus/scroll), bilingual helper behavior, label coverage and Arabic dictionary-sense preservation. Test commits `1ff528e0f496b5b4d96e5b2fd8500a16b39bd3f1`, `7a54d25ff9537bb63df75ac60d8cc7954b02440b`.
- **PASS (isolated source execution):** production `applyLocale` extracted from latest branch and executed in V8; observed persisted `en`, close → library redraw → scroll restore → reopen Settings → focus locale selector. Parsed all three modified JavaScript files in V8; production locale helper returned Arabic/English correctly; nine new English labels and unchanged dictionary-sense assignment verified. **This is not a full Node suite run.**
- **NOT TESTED:** native `node tools/library-experience.test.cjs` in complete checkout, full JS suite, Android CI/APK, actual Pad 5 UI, complete LT-06 localization audit, approved text-bearing adaptive icon, LT-07/08/11 content/media and independent device recheck.
- **Build policy:** commits include `[skip ci]`; no interim APK or workflow was intentionally launched. `AUTOMATION_COMPLETE: IN_PROGRESS`.

## 2026-10-24 — Keyboard-accessible dialogs (source-only)
- **Production commit:** `339772e2c7dcf304a2b17e7d66474231e702c0f8` updates `lingua-shell.js`. Settings and genre drawer now trap forward/reverse Tab inside the active dialog; Escape dismisses the topmost dialog and restores menu focus after Settings. One global listener avoids multiplying handlers on library redraws.
- **Regression commit:** `59ca73ad58a9119b1c3e18987ea04a22807fb9fa` extends the existing Node shell suite with Tab, Shift+Tab, Settings Escape and focus restoration cases.
- **PASS (isolated V8):** syntax parse of the exact updated production JS; extracted production keyboard handler executed in 3 focused cases (Tab, reverse Tab, drawer Escape). **NOT TESTED:** complete repository Node test suite, new Settings regression execution, Android accessibility/TalkBack, keyboard hardware, actual launcher icon and device recheck. No APK, no GitHub Actions trigger, no main write or auto-merge.
- **Next:** complete bilingual UI and exact approved text-bearing icon asset, test all navigation with keyboard/TalkBack and physical Pad 5 before the single final APK.


## 2026-10-24 — LT-08 offline inline illustration rendering infrastructure (no APK)
- **Production source:** `reader-experience.js` renders optional chapter `inlineArt` entries immediately after their matching `paragraphs[index]` sentences. Each entry may specify `afterParagraph`, packaged relative `src` under `art/`, mandatory accessible `alt`, optional `credit`, and `position` (`wide`, `edge-start`, `edge-end`). Rendering uses DOM `textContent`, not HTML interpolation. CSS has responsive no-overlap fallbacks and lazy image decoding.
- **Security/offline:** external URLs, absolute paths, traversal, missing alt, duplicate paragraph anchors and unsupported formats are skipped; no `INTERNET` permission or remote image dependency added. Existing English text and Arabic translations are untouched.
- **Source/test SHA:** production `5b2095b601d409c040a7721c5eb13e1792419433`, CSS `c57d96bab84a98f422f54003da1fd7bf836f23e1`, regression `9439ef0f191ced5601b465b928fae926cdd1ce69`.
- **PASS:** executed actual committed reader JavaScript in V8 with simulated DOM: 2 valid images placed at expected anchors; rejected remote/traversal/duplicate; checked alt and lazy loading. **NOT TESTED:** committed Node test on Node, Android renderer, accessibility screen reader, image crop/contrast and offline loading from a packaged real illustration.
- **LT-08 PARTIAL ONLY:** this is the renderer and safety contract; **no approved, licensed, scene-matched art files have been bundled**. No new LT-13 theme claimed for this narrowly scoped infrastructure batch. The original user-approved text-inclusive launcher icon is still **NOT INTEGRATED**. No interim APK or Actions build.

## 2026-10-24 — LT-08 safe inline-art budget (source-only)
- **Production SHA:** `02f0bb74d8bfcff284f1850c9b6dd5075dbd3b02`; **regression SHA:** `902c838da7a6285c935a99e4d96453d8db00dbd3` on draft PR #1.
- **Fix:** invalid/remote/traversal/unlabeled illustration entries no longer consume the 12-valid-image budget. Reader scans at most 64 candidates to avoid unbounded work from a malformed catalog; duplicates remain excluded and local-path/alt allowlist is preserved.
- **PASS:** executed the modified **actual production** `reader-experience.js` in V8 with a fake DOM: 14 rejected remote entries followed by two safe anchored illustrations both render; 20 valid illustrations render only the first 12. No original Arabic paragraph text was altered.
- **NOT TESTED:** full Node test file execution, Android/WebView layout, image asset licensing and editorial review, physical-device scroll/memory, accessibility and independent recheck. No final licensed art has been supplied by this patch. **No APK build requested**; commits use `[skip ci]`.
- **Status:** LT-08 remains PARTIAL / IN_PROGRESS; approved text-bearing launcher icon and full LT-01..13 acceptance remain pending.


## 2026-10-24 — Corrupt bookmark navigation hardening (source-only)
- **Production commit:** `97e95b8aa4d6816e978f4069cbdb6172566b2683` in `reader-experience.js`. Restoring an old/imported bookmark now rejects non-integer, NaN and negative chapter indices; clamps chapters removed by content updates; sanitizes non-finite/negative scroll offsets. Direct chapter navigation rejects non-integers. Existing numeric bookmarks remain supported.
- **Regression commit:** `313a5425e0b9d78cd34c40731ae26ef1419e8fe1` adds `tools/bookmark-navigation.test.cjs` with invalid/valid chapter and scroll cases.
- **PASS:** executed the **actual modified production JS** from the PR in a V8 harness: four bookmark restoration scenarios (invalid chapter, infinite scroll, out-of-range chapter/negative scroll, valid chapter/scroll). Production file blob SHA `8cae8d93557cb8c5e003ce8b8d342d64d125a642`.
- **NOT TESTED:** Node test file through the full repository runner, Android browser/Pad 5, upgrade migration, device gestures, icon and media. No APK or Actions run intentionally triggered. Existing CI workflow remains unchanged. Status: **IN_PROGRESS**.


## 2026-10-24 — Legacy chapter progress and scroll safety (source-only)
- **Production commit:** `a4b74caea89612d34e2231d57fbcd3ded9134e97`; **regression commits:** `0564243b88ee532b2cf3c692f4e79073619b6694`, `c7f93cde9da14113212e5b983f1fad46bfe689b5` (draft PR #1, never main).
- **Fix:** reader's library/continue chapter index rejects fractional, NaN and non-finite saved progress, clamps removed chapters; chapter-picker restores only finite, nonnegative, bounded scroll offsets. This complements the earlier bookmark jump guard and does not alter story text or saved data formats.
- **PASS:** parsed and executed modified production JavaScript inside V8 with a mocked reader and storage; checked invalid/fractional/oversized chapter progress, infinite and negative scroll, and valid scroll restoration. Separately verified the committed regression test parses and its source-extraction regex matches the real production helper; 4 index cases passed in V8.
- **NOT TESTED:** full committed Node test suite, Android WebView/Pad 5, live migration, FPS, icon integration, final licensed art, full bilingual UI, independent recheck.
- **Build:** no APK, no workflow dispatch, no merge, no paid API; existing workflows unchanged. Status: **IN_PROGRESS**.

## 2026-10-24 — Fail-closed offline backup export (source-only)
- **Production commit:** `3304cdbf93aed5f20bc062d680290c0ead122851` updates `app/src/main/assets/data-backup.js`. An allowed learning/progress key with malformed JSON or an invalid schema now stops export with the exact key identified, rather than silently disappearing from an apparently successful backup. Unrelated storage keys remain excluded. Legacy `storylens_` keys and backup format remain unchanged.
- **Regression commit:** `693fc80b0e016a6e26656470febff82e5277230a` adds malformed cards, wrong-shaped cards and invalid chapter progress tests to `tools/data-backup.test.cjs`.
- **PASS (production V8 smoke):** executed the actual modified JavaScript export function with mock localStorage: corrupt JSON and wrong-shaped allowed values rejected; valid data exported; unrelated key excluded.
- **NOT TESTED:** complete Node test suite, Android/WebView storage-quota behavior, real restore/device upgrade and independent QA. No APK build, no Actions dispatch, no paid API, no main write or merge. **IN_PROGRESS.**

## 2026-10-24 — UTF-8-safe offline backup boundaries (source-only)
- **Production commit:** `7ed6ce311b36f97951b284dc0cf618a04e6fa952`; **regression commit:** `10055cb720853fbe36b6f767ba0df97d2e454026` on Storylens PR #1 (not `main`).
- **Fix:** backup export and pasted/imported JSON now enforce the 1,500,000 limit in actual UTF-8 bytes rather than UTF-16 code units. This prevents Arabic/CJK/emoji data from passing the WebView check only to exceed Android's UTF-8 SAF file limit. Correct surrogate-pair and malformed-surrogate replacement byte accounting; existing v1 format and `storylens_` storage identifiers unchanged.
- **PASS:** executed the exact committed production JS inside V8 with fake offline localStorage; 5 checks: CJK oversized export/import, valid Arabic backup roundtrip, mixed-script backup, emoji oversized import. Regression file parsed successfully. **No Node/Android APK build.**
- **NOT TESTED:** full `node tools/data-backup.test.cjs` in a complete checkout, full Node suite, Android SAF roundtrip, physical device, final approved icon and LT-01..LT-13 acceptance.
- **CI:** no PR workflow run on code/test head when checked. All commits use `[skip ci]`. **Status:** IN_PROGRESS.
