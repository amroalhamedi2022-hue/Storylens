# Lingua Tales — Android update and signing contract (2026-10-29)

## Why Android reports "Conflict with installed"

Android checks **all three** before replacing an installed app:

1. The application ID must match: `com.storylens.reader`.
2. The new APK must be signed by a certificate compatible with the installed APK.
3. The candidate `versionCode` cannot be lower than the installed code.

The existing GitHub-hosted `StoryLens-Debug-APK` is signed using an ephemeral CI debug key. It is a **test/install artifact**, not a promised in-place update. Different CI debug runs are not guaranteed to have the same certificate. A change to a different `applicationId` is NOT a fix: it silently installs a separate app and does not keep the existing WebView's progress.

## What this branch now enforces

- `app/build.gradle.kts` retains applicationId and uses `100000 + GITHUB_RUN_NUMBER` for CI builds, while local builds retain versionCode 6.
- The Android workflow runs `tools/test_apk_update.py` and validates the produced APK's actual package, versionCode, signing certificate SHA-256 and signature using Android SDK tools.
- Each GitHub Artifact includes `APK_INSTALL_IDENTITY.txt`. A Debug artifact explicitly warns that CI debug signing may not match a previous installation.
- With all four existing private signing secrets, the workflow produces a separate **Lingua-Tales-Stable-Signed-Release**. Partial configuration fails closed.
- Optional `LT_SIGNING_CERT_SHA256` pins the *expected installed certificate*. A mismatch stops the signed-release artifact to prevent publishing a knowingly incompatible update. Without a pinned installed fingerprint, the release can build but **its upgrade compatibility remains unverified**.
- The portable offline backup now contains `storylens_licensedAudioPrefs` as well as learning progress, saved vocabulary and existing settings.

Passing CI means package/signature metadata and source tests passed. Real on-device upgrade, persistence and Android dialog behavior remain **NOT TESTED** until performed on the device.

## Safe diagnosis without deleting user data

**Do not uninstall Lingua Tales first.** While the old app still opens, export its offline backup using the in-app Backup control and store a second copy outside the device if possible. Verify that the JSON file exists and is nonempty. The import path asks for confirmation and does not perform an automatic wipe.

On a computer with Android Platform Tools/SDK, optionally obtain the already-installed APK:

```sh
adb shell pm path com.storylens.reader
# Use the base.apk path printed by the command, for example:
adb pull /data/app/.../base.apk installed-lingua.apk
python3 tools/check_apk_update.py --installed installed-lingua.apk --candidate candidate.apk
```

The diagnostic requires `aapt` and `apksigner` on PATH (or specify their full paths with `--aapt` and `--apksigner`). It changes nothing on the device. Its findings are `DIFFERENT_PACKAGE`, `SIGNATURE_MISMATCH`, `VERSION_DOWNGRADE`, or `METADATA_COMPATIBLE`; the last is not a physical installation test.

## Stable signing without exposing secrets

If the **original private signing key** for the currently installed app is available, configure these repository *Actions secrets*, not source files or chat messages:

- `LT_SIGNING_KEYSTORE_BASE64` — base64 of the exact existing keystore file
- `LT_SIGNING_STORE_PASSWORD`
- `LT_SIGNING_KEY_ALIAS`
- `LT_SIGNING_KEY_PASSWORD`
- `LT_SIGNING_CERT_SHA256` — optional expected *installed* signing certificate SHA-256, not a private key

Do not commit keystores or secret passwords into this public repository. Preserve an encrypted offline copy of the stable keystore for all subsequent upgrades. Export the signing certificate from the existing keystore using `keytool -list -v`, then compare its SHA-256 certificate fingerprint with the installed APK before claiming in-place compatibility. Always distribute the **stable-signed release** artifact for updates, not the CI Debug artifact.

If the currently installed app was signed with an ephemeral CI debug key and **that original private key cannot be recovered**, Android cannot safely accept a differently signed APK as an update. Do not suggest bypassing Android's signature check. Instead:

1. Export and check an offline backup from the installed app **before** removing it.
2. Obtain a stable release signed with a newly retained private key.
3. Only after securing the backup, uninstall the incompatible old app and install that stable release.
4. Restore the backup through the app, verify vocabulary, review scheduling, bookmarks, language and audio preferences.
5. Pin the new stable signing certificate and use the same secret for every following version.

A one-time reinstall may be required in this case. This is **not** the same as a seamless upgrade, and must never be reported as one.

## Verification checklist

- CI source tests: `python3 tools/test_apk_update.py` and `node tools/data-backup.test.cjs`.
- GitHub Actions: Gradle build plus `apksigner verify --print-certs` and `aapt dump badging` for actual APK files.
- Device, when available: test stable APK over **the installed version** without uninstall, then confirm saved words, SRS cards, chapter position, bookmarks, locale, font, and sound settings remain intact.
- If no matching key is available: verify export → reinstall → import, **mark upgrade-in-place NOT TESTED / BLOCKED**, and retain backup.

## Stable baseline and future updates (2026-11-02)

Mainline code now uses visible version `1.0.0`; the production package remains `com.storylens.reader` and the Preview suffix only belongs to Debug CI. Release is an **explicit manual workflow option** `stable-release`, never inferred from successful source CI. All five secret inputs (keystore base64, store/key passwords, key alias, pinned SHA-256 certificate) are mandatory. The workflow enforces signature/version/content equivalence and produces a privately downloadable `Lingua-Tales-Stable-Signed-Release` artifact only after all tests pass. Without the original signer, an update **over the installed app** cannot be promised. Do not uninstall until the user's offline backup has been verified.

## NEW: one-time fresh production install authorised — 2026-11-02

The user chose a **clean first install with a newly created stable key** instead of requiring signature compatibility with their older preview/test APK. This changes ONLY the first-install gate; every later version must use exactly the SAME key and original production package. The complete reproducible instructions are in `docs/FIRST_STABLE_INSTALL.md`. Run `pwsh -File tools/bootstrap_first_release.ps1` on a Windows computer with PowerShell 7, GitHub CLI and a JDK; it does not overwrite an existing key. After successful signed CI, the owner can download `Lingua-Tales-Stable-Signed-Release` from GitHub Actions or the owner-only DRAFT Release. Public releases remain blocked by copyright/editorial and physical-device acceptance. If an older `com.storylens.reader` app is installed under another signer, export/save its backup before uninstalling once. Preview `com.storylens.reader.preview` can remain installed separately, but the stable app is `com.storylens.reader`. Back up the new private keystore securely; without it, future updates will fail.
