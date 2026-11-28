# Native Android 13 smoke pilot — 2026-11-27

Scope: CI only. The existing Android workflow already runs Gradle, content checks and extensive Chromium tests. This pilot adds an Android emulator job after a successful verification build; it reuses the existing preview artifact instead of rebuilding or signing.

The test installs the isolated preview package on API 33, disables Wi-Fi and mobile data, launches the real Activity, checks resumed Activity and process survival, captures portrait and landscape screenshots, validates image dimensions, and checks the app crash buffer. Evidence is retained for one day. No paid runner, external API, new key, source change, production release or automatic merge is required. Standard public-repository runner compute is free, subject to GitHub policies and storage limits.

Status: proposed on an isolated branch; exact-head CI must be checked before merging. A successful smoke is NOT a complete UI/UX, translation, touch, hardware GPU, 120 Hz, or physical-device acceptance. Continue the separate reader and literature workstreams unchanged. The canonical live status file could not be decoded through the connector; this document records the pilot without overwriting it.

## Follow-up, 2026-11-27
Run 45968118439: existing Android build PASS, native smoke CANCELLED during install/boot step with no progress beyond adb daemon startup. Exact cause unverified. This revision bounds adb commands and cleanup, selects an explicit emulator serial, checks acceleration and emulator process, logs boot progress, and retains diagnostics. One new verification run is justified; no new signing/release. Added eight repo-local agent skills; checked source manifests, not live agent discovery. Existing AGENTS.md preserved. No app source edits.
