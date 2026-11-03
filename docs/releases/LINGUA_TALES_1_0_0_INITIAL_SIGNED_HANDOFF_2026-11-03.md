# Lingua Tales 1.0.0 — FIRST permanent signed APK handoff (2026-11-03)

## Verified deliverable
- **SIGNED installable APK**: `Lingua-Tales-1.0.0-Official-SIGNED.apk` (28,971,036 bytes, Android APK Signature Scheme v2 and v3 both verified).
- Production Android application ID: `com.storylens.reader` (NOT the CI `.preview` application ID).
- Visible name/version: `Lingua Tales` / `1.0.0`.
- Android `versionCode=100851`; first installed signed baseline; **future releases must have higher versionCode**.
- Signed file SHA-256: `dee01c94dba9110afe3d5c73a2be1f998a5348c7277e0c8c8a9ac8a65d2fcca9`.
- Permanent public certificate SHA-256: `3df6489eacea84e78b715943ca4d014abb24e3159641e0bf80890ecedcf9da31`.
- Permanent signing key: locally generated RSA-3072 PKCS12, self-signed 30-year X.509 certificate, alias `lingua-tales-permanent`.
- Exact checked-in source parent: `55a48790eb769d7ab663874ca3bd4b25d7a2c85d`.
- Source GitHub Android/Chromium successful CI: https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/41642200812 ; source artifact `Lingua-Tales-Unsigned-Production-NOT-INSTALLABLE`.
- Reproducible offline signed-release code: `tools/sign_lingua_offline.py`. It rechecks CI artifact SHA, exact package/version/commit, validates unsigned input, uses retained private key to sign with official Android `apksigner.jar`, verifies the final SHA-256 signer and sample offline packaged source bytes. Actual signed APK verified using APK Signature Scheme v2/v3 with the Android SDK jar.

## Where the actual files live

**Important distinction**: GitHub currently holds source, tested unsigned production APK artifact, test results and this public certificate/release manifest. The **signed APK itself** has been saved for the user in their **private ChatGPT Library**, path:
`/Lingua Tales/Releases/Lingua-Tales-1.0.0-Official-SIGNED.apk`.
Its full signer/bytes/CI verification report is beside it as `Lingua-Tales-1.0.0-APK-VERIFICATION.txt`. A downloadable copy was also attached to the originating ChatGPT conversation.

The signing keystore and recovery password have been **separately saved outside this public GitHub repository** in the owner's private ChatGPT Library:
`/Lingua Tales/Private Signing/Lingua-Tales-v1.0-PERMANENT-PRIVATE-SIGNING-KEY.p12`
and
`/Lingua Tales/Private Signing/Lingua-Tales-v1.0-KEY-RECOVERY-PASSWORD.txt`.

**NEVER print, commit, upload to public GitHub, attach to Actions artifacts or share the keystore/password. NEVER create a second release signing key.** Store personal offline backups. A lost signer requires another destructive reinstall rather than a normal update. The available GitHub integration cannot write GitHub Actions Secrets or publish a binary Release asset directly, so no GitHub `stable-release` dispatch or GitHub Release APK has been falsely claimed.

For each future source update, compile the same `com.storylens.reader` Release in CI with monotonically higher versionCode, use the unchanged **retained** PKCS12 private key from private Library, compare APK signing cert SHA-256 to the public pin above, and attach signed APK privately to the user. When GitHub encrypted Actions secrets become securely configurable, migrate this SAME existing key there and let CI issue the signed APK directly. Never replace the key.

## First-install and outstanding acceptance
- User explicitly allowed one-time fresh install replacing an older differently signed app. BEFORE uninstalling an older production `com.storylens.reader` install, export/check its JSON backup if it contains reading progress, words, bookmarks or preferences.
- An older `com.storylens.reader.preview` may coexist but is not the permanent official package.
- This APK is cryptographically verified, **not yet physically installed/tested on the owner's Xiaomi Pad 5 or phone**. Hardware touch/120Hz/FPS/restore/Android Back and screenshot acceptance require actual device trials.
- Newly staged authentic English source novels still need full natural contextual Arabic counterpart, historical in-prose art rights and thorough editorial/territory review before promotion. Do **not** call the literary catalog fully finished or rights-cleared.
