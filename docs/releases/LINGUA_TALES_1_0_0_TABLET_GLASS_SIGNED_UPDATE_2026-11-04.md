# Lingua Tales — Tablet Liquid Glass same-signer official APK update (2026-11-04)

## Verified identity and provenance

- Signed package: `com.storylens.reader` **versionName 1.0.0**, **versionCode 100857**; minimum Android SDK 26.
- Exact SOURCE Git SHA: `4f3141305261e418bb52e7f95abe544d14ef50fb`.
- GitHub full Android, Node, Chromium (RTL phone/tablet and glass fixture) CI [#41820304484](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/41820304484): **SUCCESS**. Artifact ID `13317325972` (unsigned production input; NOT installable).
- SHA-256 of final **installable signed UPDATE**: `c6ec45f3c5604cb8bc158a590009dec51d11a0007e9e568ab6a8bd5eb4e8b701`.
- APK v2 and v3 signature verification: **PASS**. Signing certificate SHA-256: `3df6489eacea84e78b715943ca4d014abb24e3159641e0bf80890ecedcf9da31`, exactly the **same certificate** as the private v1.0.0 clean-install release (versionCode `100851`). This is an update, not a preview or a differently signed app.
- Offline source asset parity checked: `index.html`, `lt-wen-glass-engine.js/css`, `reader-experience.js`, `lingua-shell.js`, `data-backup.js` match unsigned source bytes after signing.

## Owner's private delivery locations

- Signed APK: `/Lingua Tales/Releases/Lingua-Tales-1.0.0-Tablet-Liquid-Glass-SIGNED-UPDATE.apk`
- Signature/checksum proof: `/Lingua Tales/Releases/Lingua-Tales-1.0.0-Tablet-Liquid-Glass-Verification.txt`
- Existing permanent signer and recovery password are **unchanged** at `/Lingua Tales/Private Signing/` (never commit/print/upload them). Original signed first-install APK stays untouched in `/Lingua Tales/Releases/`.

## Safety and remaining validation

- Device install/upgrade, backup persistence, on-device RTL gestures, physical 120Hz frame pacing and visuals are **NOT YET VERIFIED**; user must check on their tablet before relying on the update. Install over original signer only; never uninstall an app containing user data to force an update.
- This update's GL changes are WebView-simulated optical material, not AGSL/native iOS pixel refractive parity. Classic-books, bilingual editorial review, rights-cleared historical imagery and true deformable page curl have separate completion gates.
- GitHub may have a newer documentation-only HEAD after this release; do not confuse its future CI source build/versionCode with this signed and verified exact-SHA binary.
