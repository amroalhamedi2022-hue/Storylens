## 2026-10-28 — Accessible bilingual page-turn labels (source/test checkpoint)

- **Production source:** each paged-reader group now exposes a localized accessible name ("صفحة N من M" / "Page N of M") and a localized aria-roledescription; the changing page counter uses aria-live="polite" with aria-atomic="true" so assistive technology receives the whole updated page label.
- **Regression:** tools/contextual-page-turn.test.cjs directly exercises the production label helper in Arabic and English and checks the group/live-region wiring.
- **Source/test SHA:** ac72f5a40573f9b9181bc6c848479d75081b5851.
- **Android CI:** [run 40737942544](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40737942544) is still in progress. Curated content, dictionary/audio checks, Gradle tests, APK assembly and required-resource checks have passed in the current job; Chromium render smoke and artifact upload are not yet complete. No APK is claimed for this head until the run finishes.
- **NOT TESTED:** TalkBack on Xiaomi Pad 5, physical RTL/LTR, focus/announcement quality, frame pacing/RAM/thermal, stable update signing and literary/territory-rights review. LT-01..LT-13 remain IN PROGRESS; this is not final acceptance.
## 2026-10-28 — Prevent stale UI-sound resume after Android audio-focus loss (CI PASS)

- **Production fix (LT-11):** the 24 procedural ambience/music presets now track one-shot UI SFX voices. A pause or native focus-loss event stops and disconnects active click tones; a delayed `AudioContext.resume()` completion is checked against the playback generation, cleaned up, and suspended again rather than restarting sound after focus loss. Focus is not released by a stale SFX completion when a newer playback owns it.
- **Regression:** `tools/ambience.test.cjs` now delays a synthetic AudioContext resume, revokes native focus before it resolves, and verifies that the context ends suspended and focus is released exactly once. This is a lifecycle/control-flow regression, not an acoustic or physical-device test.
- **Test-harness correction:** the first CI attempt exposed that the source edit had dropped the `onNativeAudioFocusLoss` callback; it was restored. The next run exposed Node 22 cross-realm `deepStrictEqual` failures in drawer snapshot tests despite equal values; the test now normalizes VM snapshots before comparison. Both corrections are included in the passing head.
- **PASS — exact-head Android CI:** [run 40706495411](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40706495411), source/test SHA `d6b36821bea806030de30c6524b14a62bdcc052b`. The workflow passed the licensed audio and offline dictionary checks, curated catalog/theme/localization/reader regressions, Gradle tests + Debug assembly, required APK resource checks and Chromium phone/tablet reader journeys.
- **PASS — independent APK integrity:** [Debug APK artifact 12825095100](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40706495411/artifacts/12825095100), extracted APK size **25,752,235 bytes**, SHA-256 `551661fafb756d0e114e3c15558a85b90bb739808c6d52d4d12161444cd72a67`; independently recalculated and matched `APK_SHA256.txt`. [Chromium screenshot artifact 12824501867](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40706495411/artifacts/12824501867).
- **Package check:** adaptive foreground/background/monochrome icon resources, offline FreeDict and all 24 pinned licensed OGG assets are packaged. Existing CI contract confirms no microphone/TTS or INTERNET permission.
- **NOT TESTED:** physical Xiaomi Pad 5 installation/upgrade, real Android audio focus/interruption and screen-off battery, TalkBack/physical RTL, frame pacing/RAM/thermal, stable update-signing continuity, independent Arabic literary proofreading and territory-specific redistribution review. Chromium screenshots are not device evidence. LT-01..LT-13 remain IN PROGRESS; Debug is not final.

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


## 2026-10-28 — Page-turn bookmark restoration (CI PASS)

- **Production change:** saved reader bookmarks now record the active four-paragraph page as well as chapter/scroll/paragraph anchor. Jumping to a bookmark restores that page **before** rendering and measuring the paragraph anchor, avoiding attempts to scroll to a paragraph hidden on another page. Older paragraph bookmarks without the new field derive the page from the existing four-paragraph pagination rule; old scroll-only bookmarks remain compatible.
- **Regression tests:** `tools/bookmark-navigation.test.cjs` covers page save/restore and legacy paragraph fallback; `tools/contextual-page-turn.test.cjs` pins the shared page-size rule and restoration wiring.
- **PASS — Android CI:** [run 40667188476](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40667188476) completed SUCCESS on source/test SHA `70af49e18ba6d02faec7b7b37ea356bc249ccb2b`. The curated Node regression suite, Gradle unit tests + Debug assembly, offline asset checks and browser render smoke passed. The earlier attempt on `ff95a82b248770043baf7cfa978a553682297a7b` failed because two newly added regex assertions were over-escaped; corrected in the final tested SHA.
- **PASS — independent APK integrity:** Debug artifact [12805779575](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40667188476/artifacts/12805779575), 25,749,207 bytes, SHA-256 `fcbd1396ee3b729663702d0bd42b3cc0e2a1f0d658f54657b7aab193164d5a88`; extracted and independently re-hashed from the artifact ZIP. Confirmed `reader-experience.js`, `reader-experience.css`, `lingua-chapter-navigation.js` and the adaptive launcher icon are packaged.
- **NOT TESTED:** physical Xiaomi Pad 5, live swipe/button animation timing, TalkBack page announcements, frame pacing/RAM/thermal and stable update signing. CI/source acceptance is not device acceptance; LT-01..LT-13 remain IN PROGRESS and Debug is not final. No main write or merge.

- **Production change:** saved reader bookmarks now record the active four-paragraph page as well as chapter/scroll/paragraph anchor. Jumping to a bookmark restores that page **before** rendering and measuring the paragraph anchor, avoiding attempts to scroll to a paragraph hidden on another page. Older paragraph bookmarks without the new field derive the page from the existing four-paragraph pagination rule; old scroll-only bookmarks remain compatible.
- **Regression tests:** `tools/bookmark-navigation.test.cjs` covers page save/restore and legacy paragraph fallback; `tools/contextual-page-turn.test.cjs` pins the shared page-size rule and restoration wiring.
- **PASS — direct source-contract inspection:** the page size constant is shared by pagination and legacy bookmark fallback; all new source/test assertions are present. This does not replace Node CI or browser interaction.
- **CI:** run [40667188476](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40667188476) is **IN PROGRESS** on test SHA `70af49e18ba6d02faec7b7b37ea356bc249ccb2b`. The earlier run on production commit `ff95a82b248770043baf7cfa978a553682297a7b` failed in the curated-content gate; the test's regex assertions were over-escaped and have been corrected in the current SHA. No APK is claimed for this milestone yet.
- **NOT TESTED:** Chromium button/swipe interaction for this exact head, physical Xiaomi Pad 5, screen-reader page announcements, frame pacing and update signing. LT-01..LT-13 remain IN PROGRESS; no main write or merge.


## 2026-10-28 — Chapter XXXIV contextual glossary correction (exact-head CI NOT VERIFIED)

- **Production:** corrected the Arabic gloss for `fatal` in the arrest/deadline context from the misleading `قاضٍ / مدمّر` to `كارثيّ / ضربة قاصمة`. The English source, chapter text, Arabic paragraph translations, source digest and reading progress are unchanged.
- **Regression:** `tools/verne-towle-ch33.test.cjs` already executes the Chapter XXXIV source and now pins the corrected glossary meaning; the workflow invokes this test.
- **Source commits:** production `d1c2782949ada58c13d71f5c94d8b145a88b28e6`; regression `b4f636accdb8fe91f7a0ef5635d64e9afcdb2e87`.
- **PASS — direct source contract:** Chapter XXXIV still contains 22 English/Arabic paragraph pairs and 972 English words; the contextual term is present and the regression assertion is wired into the existing content test.
- **CI: NOT VERIFIED for this exact head.** The last confirmed build remains [40667188476](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40667188476), which predates this glossary correction. No new APK is claimed for this change.
- **NOT TESTED:** independent bilingual literary proofreading, territory-specific redistribution review, Xiaomi Pad 5 visual/RTL/TalkBack/performance acceptance and stable update signing. LT-01..LT-13 remain IN PROGRESS; Debug is not final.


## 2026-10-28 — Directional paper-edge page-turn animation (exact-head CI NOT VERIFIED)

- **Production:** upgraded the reader's incoming-page motion from a small 13-degree nudge to a short 42-degree 3D edge turn with a composited opacity/transform shade overlay. LTR turns pivot at the right edge for Next and left edge for Back; RTL reverses the pivot and motion. The effect remains 420 ms and uses transform/opacity only; reduced-motion disables both the page and shade animations.
- **Regression:** `tools/contextual-page-turn.test.cjs` now pins LTR angle, mirrored RTL pivots/shading and reduced-motion behavior. The existing Android workflow already invokes this test.
- **Source commits:** CSS `8501042c0ec6ccb72bc83e74991ed8ade3195d06`; test `262415c82ac3753c793bc919819fe075c8b8fa6d`.
- **PASS — direct CSS/source contract:** all eight focused checks passed; stylesheet braces are balanced (201/201), and the production chapter-turn duration remains aligned with the 420 ms class cleanup.
- **CI: NOT VERIFIED for this exact head.** Last confirmed build [40667188476](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40667188476) predates the directional animation and glossary correction. No new APK is claimed.
- **NOT TESTED:** actual WebView rendering, physical Xiaomi Pad 5 swipe/button timing, frame pacing, screen-reader behavior, contrast, stable update signing, Arabic literary proofreading and territory-specific redistribution rights. LT-01..LT-13 remain IN PROGRESS; Debug is not final.


## 2026-10-28 — Contextual gloss must not mislabel English source text (exact-head CI NOT VERIFIED)

- **Production fix:** contextualMeaning now treats entry.context as an authored Arabic contextual gloss only when it actually contains Arabic-script text. Historical glossary entries use this field for English source excerpts; those excerpts must not be displayed under the Arabic “contextual meaning” label.
- When an English excerpt is present, the resolver continues through the bounded Arabic senses and sentence-overlap heuristic; if no supported sense matches, it retains the honest “no verified single-word meaning” fallback rather than inventing one.
- **Content correction:** the Chapter XXXV idiom “Never too late” now uses the natural Arabic meaning “لم يفت الأوان بعد” instead of the awkward “لا وقت يفوت أبدًا”. The English source paragraphs and source digest are unchanged.
- **Regression tests:** tools/contextual-page-turn.test.cjs verifies an English source excerpt cannot be returned as an Arabic gloss while an explicitly Arabic-authored context remains supported; tools/verne-towle-ch35.test.cjs pins the idiom correction.
- **Source commits:** resolver 5c09cf890ae62b91d58f8c3fe7cf9c2b7e170fe2; Chapter XXXV 000de7081cfa0eb15f2d34cef7548f0861680da5; contextual regression 8e32c8da05126b853ea786c575b6ea15471f8b2c; chapter regression c8ca2ffb5af66655de91dd2ec23ec18cbac958d8.
- **PASS — direct V8 production smoke:** the exact helper returned “سكان / قاطنو” for the Chapter XXXV-style English source excerpt and retained “ينطلق في رحلة” for an explicitly Arabic-authored context.
- **CI: NOT VERIFIED** for the exact functional head c8ca2ffb5af66655de91dd2ec23ec18cbac958d8. The workflow-run/status connector has not yet returned a run/check for this head; the prior CI is not evidence for this correction. No new APK is claimed.
- **NOT TESTED:** full Node/Chromium CI, WebView dictionary-sheet visual QA, independent Arabic literary proofreading, physical Xiaomi Pad 5 and territory-specific redistribution review. LT-01..LT-13 remain IN PROGRESS; no main write or merge.


## 2026-10-28 — Ambiguous contextual dictionary senses now abstain (source smoke PASS; exact-head CI NOT VERIFIED)

- **Production:** the Arabic sentence-overlap resolver now deduplicates repeated words within each candidate gloss and ranks by distinct overlap. If two different senses have the same best score and the same amount of evidence, it returns the existing honest “no verified single-word meaning” fallback instead of choosing whichever sense appears first. A later candidate with stronger evidence can still win; duplicate copies of the same gloss do not create a false ambiguity.
- **Regression:** `tools/contextual-page-turn.test.cjs` covers an ordinary supported riverbank sense, explicitly authored Arabic context, English source excerpts that must not be labelled Arabic meaning, equally supported competing senses, duplicate glosses, and unsupported senses.
- **PASS — direct production V8 smoke:** compiled the complete `reader-experience.js` source for syntax and executed the actual extracted `contextualMeaning` helper. All 6 targeted cases passed, including ambiguity abstention and duplicate-gloss handling. This does not substitute for the full Node/Chromium workflow.
- **Functional commits:** resolver `53d5ea280603f51361b3b4b98484c1d522a16ead`; focused regression `e551c1c05b38aad5ac1e8aab16ab283a921d729e`. The Android workflow includes `node tools/contextual-page-turn.test.cjs`.
- **CI: NOT VERIFIED for this exact head.** The connected status lookup returned no pull-request run for the new commits; the last confirmed run `40640774324` predates this change. No APK or CI pass is claimed for this fix.
- **NOT TESTED:** dictionary-sheet rendering on WebView/Xiaomi Pad 5, independent Arabic editorial review, physical RTL/TalkBack and overall LT-01..LT-13 acceptance. No source story text or translations were altered; no main write or merge.


## 2026-10-28 — Page-swipe endpoint safety (exact-head CI NOT VERIFIED)

- **Production:** page-turn gestures now check the surface at both the start and end coordinates. A horizontal swipe that begins in ordinary reading text but ends over a button/link/form/accessibility control is ignored, avoiding accidental page changes when the gesture crosses a control.
- **Regression:** the production-helper test covers plain reading surfaces, selection, controls at either endpoint, nested text targets and null-safe behavior; it also asserts that touchend resolves the ending element with `document.elementFromPoint` and passes both endpoints through the shared guard.
- **Source commit:** `8138f7b7b94d2b61a7dfd4691150af1d86be378f`; test commit `949d25b42349723bfdd77fd637b4fb97f4a90f52`.
- **CI NOT VERIFIED** for this exact source/test head; no current workflow row was returned by the connected run/status surface. The last confirmed CI run `40667188476` predates this endpoint guard. No APK is claimed for this change.
- **NOT TESTED:** physical Xiaomi Pad 5 swipe/button interaction, RTL feel, TalkBack and frame pacing. LT-01..LT-13 remain IN PROGRESS; no main write or merge.

## LT-09 — Reciprocal drawer swipe restores accessibility focus (2026-10-28)

- **Production fix:** when a reciprocal swipe closes the Arabic or English library drawer, the handler now calls `closeDrawer(true)`. Previously it passed `false`, leaving keyboard/screen-reader focus inside the drawer after that subtree became inert.
- **Regression:** expanded the existing `tools/library-shell-layout.test.cjs` (already wired into Android CI) to execute the exact production touch-listener bodies. Seven cases cover Arabic right-edge opening, English left-edge opening, rejecting non-edge gestures in both locales, reciprocal close/focus restoration in both locales, and ignoring a slow swipe.
- **PASS — direct production V8 execution:** fetched current `lingua-shell.js` blob `eef24158d195a650b01a579c3a2f1dc863ffe31d`; all 7 gesture cases passed against the exact callback bodies.
- **Test source commit:** `83f0997e192bd6ddf9a24b76b6298ef1b9ddb2c5`. The test harness uses the same production callbacks, not a separately reimplemented gesture algorithm.
- **Android CI: NOT VERIFIED for this exact head.** The connected workflow-run lookup returned no PR-triggered run for the new head, so this record does not claim Node/Gradle/Chromium execution or a new APK. The next gate is a successful workflow run for the current source/test head.
- **NOT TESTED:** physical Xiaomi Pad 5/WebView, TalkBack focus announcements, real gesture latency/frame pacing, and visual drawer placement in every theme. LT-01..LT-13 remain IN PROGRESS; no final APK or release claim.

## LT-10 — Settings modal focus isolation (2026-10-28; source/test smoke PASS, Android CI NOT VERIFIED)

- **Production fix:** the custom Settings sheet now captures a safe return target, marks the app root inert while `.lt-settings-overlay` is active, and restores the prior inert state plus focus only after the sheet is actually dismissed. It avoids returning focus into a drawer that has become inert and falls back to the visible menu toggle when the original target is detached.
- **Regression:** expanded `tools/library-shell-layout.test.cjs` (already invoked by Android CI) to execute the actual production helpers. It covers normal close, an outside click that does not dismiss, preserving a previously-inert root, drawer-origin focus and a detached return target.
- **PASS — direct production V8 smoke:** 10/10 assertions passed against the fetched production helper, including the Settings wiring order. Source commit `ac378284a0e5205e01616cbef600da8609ee844d`; test commit `a036f97a2973c18eb3aa2d04183a77c8cd1ef8be`.
- **Android CI: NOT VERIFIED** for this exact source/test head. No new APK or Android/Chromium pass is claimed.
- **NOT TESTED:** physical Xiaomi Pad 5, TalkBack focus announcements, modal behavior across every theme, and final LT-01..LT-13 acceptance.

## LT-02 — Prevent stale page-turn timers from cancelling newer turns (2026-10-28)

- **Production fix:** `animatePageTurn` now tracks timeout ownership per page, cancels the previous timer before restarting the same page, and verifies ownership again in the timeout callback. This handles the WebView race where a callback may already be queued when cancellation occurs; an older turn can no longer strip CSS classes from a newer reverse/forward animation.
- **Regression:** `tools/contextual-page-turn.test.cjs` executes the production helper with controllable timers and explicitly invokes a stale queued callback after a newer turn starts.
- **PASS — direct V8 execution:** the committed test was run against the current production JS/CSS with a small Node-compatible harness: **95 assertions passed**, including the overlapping-timer case; production JS and test source syntax also passed.
- **Source commit:** `87beccaf0d9d31d59ab12a5bf52680dd0a9b7075`; regression/test fix: `b981fff440adccaeca19aece90f699b40e8066b7`.
- **Exact-head Android CI: NOT VERIFIED.** The connected workflow lookup returned no PR-triggered run for the API-created commits. No Node/Gradle/Chromium CI pass or new APK is claimed for this fix.
- **NOT TESTED:** Xiaomi Pad 5/WebView rapid repeated page turns, frame pacing, reduced-motion behavior on Android, TalkBack and visual review. LT-01..LT-13 remain IN PROGRESS; no main write or merge.

## 2026-10-28 — reduced-motion page-turn fast path (exact-head CI PASS)

- **Production:** `animatePageTurn` now invalidates the previous timer owner before branching and, when `prefers-reduced-motion: reduce` is active, removes turn classes without forcing layout or scheduling a cleanup timer. A timeout already queued by WebView cannot regain ownership after the skipped turn.
- **Regression:** `tools/contextual-page-turn.test.cjs` covers same-page rapid reversal, a callback already queued before cancellation, independent timers on two different page nodes, and the reduced-motion path (no extra forced layout/timer).
- **PASS — exact-head Android CI:** [run 40728414372](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40728414372), test head `e1741f2e02795e18bfa5bdde24c0003877bccdc3`. The workflow completed the Node/content suite, Gradle Debug build, asset checks and Chromium phone/tablet journeys.
- **PASS — independently rehashed Debug APK:** artifact [12834077571](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40728414372/artifacts/12834077571); extracted APK **25,752,655 bytes**, SHA-256 `30583620acc6a9de97e2ef735b8404de0c3fab7b78f7b276aff98a0b66dc623d`, matching `APK_SHA256.txt`.
- **NOT TESTED:** Xiaomi Pad 5, Android system reduced-motion setting, TalkBack/physical RTL, real frame pacing/RAM/thermal, in-place upgrade signing, Arabic literary proofreading and territory-specific redistribution clearance. Chromium and CI do not substitute for physical-device acceptance. LT-01..LT-13 remain IN PROGRESS; Debug is not final.
