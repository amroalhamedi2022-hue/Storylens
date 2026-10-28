# Acceptance supplement — 2026-10-28

## Lingua Tales — editorial catalog gate

- Root cause: `tools/editorial.test.cjs` retained earlier hard-coded catalog totals after Collections C/D and the `Salt Meridian` novella were added. The failures stopped in the curated-content gate before Gradle; they were stale test expectations.
- Corrected the gate for 18 original stories across batches A–D plus the five-chapter novella (19 editorial entries), 44 combined entries, current genre totals (7 per non-historical genre, 9 historical), and illustration coverage based on each chapter's presence rather than a stale fixed total.
- PASS — production-asset V8 smoke: 44 combined entries, 113 loaded chapters, 804 English/Arabic paragraph pairs and 47 editorial/novella chapter illustrations; no duplicate IDs or missing local scene art.
- PASS — Android CI run 40622556894, source/test SHA `86839cc92586d7b885ea5cd3751555c02c54844b`. Content/theme tests, Gradle tests and Debug APK assembly, offline asset checks and Chromium reader journeys through Chapter XXXVII passed.
- PASS — independent APK integrity: artifact 12788237186, 25,742,231 bytes, SHA-256 `c9f8f151bc58d172a2f0de7f6529bba0d39b36ac83527c14282cbc696a59f98f`, matching `APK_SHA256.txt` after independent recalculation.
- PASS — LT-11 packaging: 24 local OGG assets (20 pinned CC BY 4.0 ambience loops and 4 licensed one-shot effects); no runtime audio download, microphone or TTS.
- NOT TESTED — physical Xiaomi Pad 5 install/upgrade, frame pacing/RAM/thermal, audio focus and screen-off battery behavior, physical RTL/TalkBack/contrast, stable update signing, independent Arabic literary proofreading and territory-specific redistribution review. LT-01..LT-13 remain IN PROGRESS; Debug is not final.


## 2026-10-28 — LT-03 cancelable lazy long-book loading (exact-head CI NOT VERIFIED)

- **Production:** the lazy loader now captures a load generation, deduplicates in-flight local assets, and stops requesting later chapter/art scripts when the reader cancels or navigates to another story. An already-started local script may finish; no subsequent chapter scripts are requested. A later deliberate retry reuses completed local assets without duplicating chapter registration.
- **Regression coverage added:** the loader harness now defers an in-flight first-chapter script, cancels the load, verifies that the library becomes interactive and that the remaining chapter assets are not requested, then retries and verifies the 37-chapter catalog is restored. Navigation-away coverage also asserts that the old book load cannot continue stealing work.
- **Source commits:** production loader `99086658cea10e9d1be866c294adbbb2e437a770`; regression test `71700aad6be11de94038b7c29e156d68954081ad`.
- **PASS — isolated V8 execution:** executed the committed `tools/content-loader.test.cjs` against the branch's actual `index.html` and `lingua-content-loader.js` using a Node-API compatibility shim. The deferred-load/cancel/no-follow-on-load/retry path passed. This is not native Node CI, Chromium, or device evidence.
- **CI status: NOT VERIFIED for this exact head.** The last verified Android CI run remains [40622556894](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40622556894) on the earlier source/test SHA `86839cc92586d7b885ea5cd3751555c02c54844b`; it is not evidence for these new changes. No APK is claimed for this batch because the targeted question is whether cancellation halts the sequential asset loader; Node/Chromium CI must prove that first, while a routine APK alone cannot answer real Pad 5 frame pacing.
- **NOT TESTED:** native Node/Chromium CI on the new head, physical Xiaomi Pad 5 cancel/retry timing and memory, actual WebView frame pacing, RTL/TalkBack and stable update signing. LT-01..LT-13 remain IN PROGRESS; no final release or main merge.


## 2026-10-28 — LT-03 immediate cancel/reopen race regression (CI PASS)

- The regression added at test commit `7cca6028f1b18b26003b8e9b5df2381490703767` is an ancestor of the tested functional SHA `4162fcad840de4f8d021f381f07f0b021baf4154`.
- **PASS — Android CI run 40640774324:** the workflow's curated-content step executed `node tools/content-loader.test.cjs` successfully along with the complete Node content/theme/audio/localization suite, Gradle unit tests + Debug assembly, required APK asset checks and Chromium reader journeys.
- **PASS — race assertions:** immediate cancel/reopen shares the one in-flight first-chapter request; the superseded generation rejects; the active generation restores and publishes all 37 chapters; no asset URL is requested twice.
- **PASS — matching Debug APK integrity:** artifact 12796045904, 25,743,251 bytes, independently recomputed SHA-256 `4e6f20c0c33b86839058972c77cbd4c72a56a53be2e9cac6aa5d24c202c8df25`, matching the packaged checksum.
- **NOT TESTED:** physical Xiaomi Pad 5/WebView race timing and memory, actual frame pacing, RTL/TalkBack, stable update signing, independent Arabic literary proofreading and territory-specific rights review. The CI result is not device evidence; LT-01..LT-13 remain IN PROGRESS and Debug is not final.

## 2026-10-28 — LT-06 reader locale integration CI and APK integrity

- **PASS — exact functional source/test SHA:** `4162fcad840de4f8d021f381f07f0b021baf4154`; [Android CI run 40640774324](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40640774324) succeeded. This run includes the reader-local Arabic/English selector staying inside `lingua-i18n.js`, scroll-position preservation, no duplicate selector on repeated Settings opens, and the full Node/content/audio/theme/localization suite, Gradle unit tests + Debug assembly, APK resource checks and Chromium journeys.
- **PASS — independent APK verification:** downloaded Debug artifact [12796045904](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40640774324/artifacts/12796045904), extracted `app-debug.apk` (25,743,251 bytes) and independently recomputed SHA-256 `4e6f20c0c33b86839058972c77cbd4c72a56a53be2e9cac6aa5d24c202c8df25`; it matches the artifact's `APK_SHA256.txt`. Screenshot artifact: [12796115706](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40640774324/artifacts/12796115706).
- **Source/CI boundary:** the tested functional SHA is `4162fcad840de4f8d021f381f07f0b021baf4154`; subsequent branch updates recorded acceptance evidence only. No production source change is implied by this documentation entry.
- **NOT TESTED:** physical Xiaomi Pad 5 installation/upgrade, real Android launcher-mask appearance, RTL/TalkBack, actual page-turn gesture latency/FPS/RAM/thermal, audio focus/screen-off behavior, independent Arabic literary proofreading, and territorial rights review. Stable update-signing secrets are absent; this Debug APK is not an in-place update for an app signed with another key. LT-01..LT-13 remain IN PROGRESS.


## LT-05 — remove stale promotional counters (2026-10-28)

- **Production commit:** `5d813ef819f693bfb4defb81c1102e5932bd126c`. The localized library shell now removes the old hard-coded story-count, genre-count and “100% offline” metric strip. Those values were promotional rather than useful navigation and became stale as the catalog expanded; the approved content-first layout keeps the story library prominent.
- **Regression gate:** `tools/test_lingua_launcher.py` checks the removal contract, and `tools/hero-declutter.test.cjs` executes the exact production `localizeLibrary()` function for Arabic and English; the existing CI step invokes the Node regression. Static guard commit `eeb118297f4fa6aafbaad8bd18fc90e9b2f12888`, Node test commit `0526b1a0fa87a729e06ad66d67ab04073d9e748a`, CI wiring commit `1e9707a99e736dfdb866222be78ab4fe194aead0`.
- **PASS — isolated V8:** the exact production `localizeLibrary()` function was extracted from `lingua-i18n.js` and executed with a minimal DOM stub for both Arabic and English; the metrics node was removed in both locales. Full source syntax and the new contract assertions also passed; Python acceptance snippet syntax check passed.
- **CI: NOT VERIFIED** for the new source/test head; the available workflow-run/status lookup returned no run/check for these API-created commits. The last confirmed CI does not include this LT-05 change. **No APK is claimed for this change.**
- **NOT TESTED:** visual result in real Chromium/WebView on Xiaomi Pad 5, layout balance across all themes, RTL/TalkBack/contrast and frame pacing. This is a focused content-first UX change, not final acceptance.


## LT-06 — keep the reader language selector synchronized (2026-10-28)

- **Production fix:** when Settings reuses the existing reader locale row, it now refreshes the visible label, accessibility name, and selected option from the active document locale. This prevents an Arabic label/selection from remaining stale after switching the reader UI to English (and vice versa), without adding duplicate controls.
- **Regression:** expanded `tools/full-localization.test.cjs` to switch Arabic → English → Arabic against the exact extracted production helper; verifies the label, accessible name, selected locale and single-row invariant.
- **CI: NOT VERIFIED for these new source/test commits.** The existing workflow includes `tools/full-localization.test.cjs`, but source-only inspection is not evidence of execution; no new APK is claimed.
- **NOT TESTED:** Chromium/WebView rendering, locale persistence after process death, RTL/TalkBack and Xiaomi Pad 5. English learning text and Arabic translations remain unchanged.
