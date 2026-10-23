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
| LT-05 reduced marketing metadata/clutter without loss of features | NOT TESTED | Compact layout and phone/tablet screenshot/action tests |
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
