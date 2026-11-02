# Lingua Tales APK installation/update safety

Android will refuse to install a new APK over an existing app with the same
package name but a different signing certificate. GitHub-hosted CI's default
Debug signing keys are ephemeral; increasing versionCode does NOT fix a
certificate conflict.

## From this milestone

- CI Debug builds now have ID com.storylens.reader.preview and launcher label
  "Lingua Tales Preview". They install beside the normal app without deleting
  its existing data. Preview is NOT an update to the production application.
  **When stable signing secrets are configured**, Preview also uses that retained
  signing key; subsequent Preview APKs with increasing versionCode can update
  earlier Preview installs without uninstalling. Without those secrets, the
  CI runner Debug key can change and another Preview update may conflict.
  Only remove Preview after exporting its backup; NEVER remove production
  merely to fix a Preview installation.
- The main app remains com.storylens.reader and keeps existing data/storage
  when installed over an earlier copy with the SAME signing certificate.
- CI sets a monotonic versionCode from GITHUB_RUN_NUMBER and inspects
  application ID, versionCode and signing certificate of each built APK.
- A production update requires a stable private signing keystore in GitHub
  secrets LT_SIGNING_KEYSTORE_BASE64, LT_SIGNING_STORE_PASSWORD,
  LT_SIGNING_KEY_ALIAS and LT_SIGNING_KEY_PASSWORD. Never commit or expose keys.
  The optional LT_SIGNING_CERT_SHA256 secret pins the public certificate
  fingerprint for cross-build verification; set it to the actual installed
  production certificate if you have it.
- The only prospective production update artifact is
  Lingua-Tales-Stable-Signed-Release, NOT the CI Preview artifact.

## When existing installed signer differs

Do NOT uninstall immediately. First open the existing app, export a JSON
backup from Settings/Data & Backup, confirm the file was saved and preserve
another copy. The app keeps words, SRS, bookmarks and reading progress in
WebView localStorage; uninstall can remove them.

If you still own the key that signed the installed build, reuse that signing
key and an adequate versionCode for a real in-place update.
If the old key is irretrievably lost, Android does not allow silently
overriding that signature check. Following verified export, remove the OLD
production app once, install a Release signed with the permanent private
key and import the JSON backup. Future updates can then be installed on top
using that same private key.

To compare APKs using Android Build Tools:
    python3 tools/check_apk_update.py --installed old.apk --candidate new.apk

CI metadata checks are not proof of installation onto an uninspected device.
Pad 5 installation, backup restore, and physical performance remain NOT TESTED.

## 2026-11-02 — explicit v1.0 stable release workflow

- Source on `main` is NOT a publicly distributed final APK. When the original, retained private signing key is available, configure four `LT_SIGNING_*` secrets and a certificate fingerprint `LT_SIGNING_CERT_SHA256` in repository Settings → Secrets and variables → Actions. Never paste the keystore or passwords into a public issue/chat/commit.
- Run GitHub Actions → **Android APK • validate • unit tests** → Run workflow → branch `main` → **release_channel = stable-release**. The workflow refuses a stable-release request if any required secret (including fingerprint) is absent. It builds Release `com.storylens.reader`, validates the signer and increasing `versionCode`, checks core asset parity with tested Debug, runs Chromium QA, and uploads **Lingua-Tales-Stable-Signed-Release**. No Preview download is published for this deliberate stable-release run.
- `versionName=1.0.0` identifies the first intended stable update baseline; it is **NOT** a claim of complete books, human editorial approval, original physical-device tests or global redistribution rights. The signed APK is an installable private candidate only after the user verifies its certificate against the already installed app.
- To preserve data with future updates, **retain that exact private key and its certificate for all later builds**; increment `versionCode` (CI derives it from the run number). Signing mismatch cannot be bypassed by renaming the APK or altering `versionName`. First-install migration from an incompatible existing preview/production signer requires an independently verified backup, then one controlled uninstall/import; never automate that step.
- Without the retained signing credentials, the only CI output remains a side-by-side Preview QA artifact; there is NO verified signed production APK. Do not share it as the user's requested final release.
