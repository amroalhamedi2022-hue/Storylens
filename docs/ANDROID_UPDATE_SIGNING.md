# Lingua Tales APK installation/update safety

Android will refuse to install a new APK over an existing app with the same
package name but a different signing certificate. GitHub-hosted CI's default
Debug signing keys are ephemeral; increasing versionCode does NOT fix a
certificate conflict.

## From this milestone

- CI Debug builds now have ID com.storylens.reader.preview and launcher label
  "Lingua Tales Preview". They install beside the normal app without deleting
  its existing data. Preview is NOT an update; because its signer may change,
  replacing an older Preview might require removing Preview only.
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
