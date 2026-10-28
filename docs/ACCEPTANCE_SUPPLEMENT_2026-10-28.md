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


## 2026-10-28 — LT-03 immediate cancel/reopen race regression (CI NOT VERIFIED)

- Added a focused regression for the narrower race where a reader cancels the long-book load and immediately reopens it while the first local chapter script is still in flight.
- The test requires the new generation to reuse the same in-flight script, the superseded generation to reject, the active generation to restore all 37 chapters, and no asset URL to be requested twice.
- Test commit: `7cca6028f1b18b26003b8e9b5df2381490703767`.
- **Execution status: NOT VERIFIED.** GitHub workflow-run/check lookup did not return a run for this commit. The earlier isolated V8 result covers cancel-then-retry after the first script settles, not this immediate reopen race. No APK is claimed for this test-only change.
- **NOT TESTED:** native Node/Chromium CI, Xiaomi Pad 5/WebView timing and memory, RTL/TalkBack, stable update signing. LT-01..LT-13 remain IN PROGRESS.
