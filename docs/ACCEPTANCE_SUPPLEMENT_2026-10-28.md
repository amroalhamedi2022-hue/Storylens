# Acceptance supplement — 2026-10-28

## Lingua Tales — editorial catalog gate

- Root cause: `tools/editorial.test.cjs` retained earlier hard-coded catalog totals after Collections C/D and the `Salt Meridian` novella were added. The failures stopped in the curated-content gate before Gradle; they were stale test expectations.
- Corrected the gate for 18 original stories across batches A–D plus the five-chapter novella (19 editorial entries), 44 combined entries, current genre totals (7 per non-historical genre, 9 historical), and illustration coverage based on each chapter's presence rather than a stale fixed total.
- PASS — production-asset V8 smoke: 44 combined entries, 113 loaded chapters, 804 English/Arabic paragraph pairs and 47 editorial/novella chapter illustrations; no duplicate IDs or missing local scene art.
- PASS — Android CI run 40622556894, source/test SHA `86839cc92586d7b885ea5cd3751555c02c54844b`. Content/theme tests, Gradle tests and Debug APK assembly, offline asset checks and Chromium reader journeys through Chapter XXXVII passed.
- PASS — independent APK integrity: artifact 12788237186, 25,742,231 bytes, SHA-256 `c9f8f151bc58d172a2f0de7f6529bba0d39b36ac83527c14282cbc696a59f98f`, matching `APK_SHA256.txt` after independent recalculation.
- PASS — LT-11 packaging: 24 local OGG assets (20 pinned CC BY 4.0 ambience loops and 4 licensed one-shot effects); no runtime audio download, microphone or TTS.
- NOT TESTED — physical Xiaomi Pad 5 install/upgrade, frame pacing/RAM/thermal, audio focus and screen-off battery behavior, physical RTL/TalkBack/contrast, stable update signing, independent Arabic literary proofreading and territory-specific redistribution review. LT-01..LT-13 remain IN PROGRESS; Debug is not final.
