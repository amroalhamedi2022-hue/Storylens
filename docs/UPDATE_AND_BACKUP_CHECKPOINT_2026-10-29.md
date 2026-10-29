# Lingua Tales — 2026-10-29 update/install and backup checkpoint

## Verified baseline / scope

- Active development PR: https://github.com/amroalhamedi2022-hue/Storylens/pull/1 — remains open and unmerged.
- Verified functional SOURCE/TEST SHA: `523822c93dde9e1b3b50e37961fe9009addd6e91`.
- **PASS** exact-SHA GitHub Actions run: https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40927895163 (run number 615).
- PASS in this run: offline dictionary and pinned audio packaging; curated language/library/backup regression tests; Gradle unit tests and APK assemble; AAPT package/version verification; apksigner verification; packaged resources; Chromium tablet/phone/reading workflows; artifacts uploaded.
- Verified Preview Artifact: `12919749998`, `Lingua-Tales-Preview-NOT-PRODUCTION-UPDATE`. Locally extracted APK size **25,754,587 bytes**; SHA-256 **`b6c32b853333c3388d792103a489be41811e186087db95d0547ea7dd67fadfa5`**, independently recomputed and equal to artifact `APK_SHA256.txt`. ZIP CRC and mandatory APK entries passed.
- Installed metadata from CI: `com.storylens.reader.preview`, versionCode `100615`, certificate SHA-256 `101a16f0e8982d69b6dd3aada1a946dec5a7779033e2b516f64dd2725af875c5`.
- No signed production Release was built; `Lingua-Tales-Stable-Signed-Release` upload **SKIPPED** because repository signing secrets are absent.

## What was changed

1. `app/src/main/assets/data-backup.js` now includes `storylens_licensedAudioPrefs`; `tools/data-backup.test.cjs` verifies safe export/import and malicious data refusal.
2. The same backup module now preserves `readpage_*`, semantic `reading_anchor_*`, library scroll, the reader's Liquid Glass palette/tint/reduced-transparency/high-contrast, and its font profile. Existing `storylens.backup` JSON version 1 is retained for compatibility.
3. Backup key cap increased from 900 to 5000 under the same 1.5-MB UTF-8 size ceiling to cover expanding story/chapter reading state. Updated regression verifies both refusal beyond 5000 and valid roundtrips.
4. `app/build.gradle.kts` retains the production ID `com.storylens.reader`, isolates disposable CI Preview under `.preview`, uses a CI monotonic versionCode `100000 + GITHUB_RUN_NUMBER`, and signs **both Preview and Release with the retained private stable keystore if configured**. Without that keystore, Preview still uses runner-generated ephemeral Debug signing.
5. `tools/check_apk_update.py` + tests diagnose mismatched package, version downgrade and certificate mismatch against actual old/new APKs, without uninstalling. CI verifies built APK signer/version identity and refuses incomplete signing secret configurations.
6. `docs/ANDROID_UPDATE_SIGNING.md` explains one-time safe migration and how to preserve signing identity. No keystores/private passwords were committed.

## Important confirmed limitation

The **previous Preview** from [run 40925100451](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40925100451) had certificate SHA-256 `4551cf620e95ef6fc08049968ce54ceea80b361d24f5fbae548cd0b8d6de1290`, while current Preview uses `101a16f0e8982d69b6dd3aada1a946dec5a7779033e2b516f64dd2725af875c5`. Both share package `com.storylens.reader.preview`; **an update-in-place from that previous Preview to this one is incompatible**. Do not represent the new Preview as a seamless updater.

If the owner has already installed Preview, export a backup from that Preview before uninstalling **Preview only** and installing the new Preview; production `com.storylens.reader` need not be uninstalled. If previous Preview has no useful data, simply uninstall that Preview. When stable signing secrets are securely configured, subsequent Preview builds will reuse the key and increasing versionCode and can update previous Preview installs signed with the **same** key.

The old production `com.storylens.reader` installation also cannot be seamlessly replaced by a new differently signed Release. When its original signing key is unavailable, perform a **one-time backup → uninstall production → install retained-key Release → restore backup**; verify learning progress afterward. Never claim this is an in-place upgrade. Never put the keystore or passwords in a public repository.

## Acceptance still NOT TESTED

- Real Xiaomi Pad 5 / user's phone installation, actual offline operation, frame pacing/thermal/battery, TalkBack, audio focus, backup import on real device, and production-in-place upgrade.
- Retained stable signing secret provisioning and matching installed certificate.
- Independent Arabic literary proofreading and territory-specific redistribution clearance for the 37-chapter Towle bilingual companion.
- Complete 120-story editorial target and final product review.

This checkpoint documents real source tests + CI + inspected APK only, not device/final acceptance. No main merge, release publication, paid service, microphone or TTS.
