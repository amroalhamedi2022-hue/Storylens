# Lingua Tales: 16 November 2026 — owner video curl acceptance

## Source evidence

Owner's 17.9-second portrait Android recording `1000080416.mp4` was inspected frame by frame. Observed: narrow ribbon-like leaf folds, distorted ink on the strip, and a transient empty region near 16.5 seconds. The video does not establish whether a given fold used the WebGL2 path or the 22-facet fallback.

## This code change

- Portrait underlay is the actual destination page, not an unrelated following/prior page. This avoids showing one page underneath before abruptly committing another.
- Portrait reverse is blank paper instead of duplicating the destination on both underlay and folded face.
- WebGL2 idle snapshots can prime a single printed page. Landscape retains its separate front, verso and underlying page.
- No literary content, database, package ID, signing material, native permissions or finance app modified.
- Source is not a signed installable update. Existing signature requirements remain binding.

## Not yet accepted

1. Device re-test of full 17.9-second portrait gestures, release/re-grab and chapter boundaries.
2. Rework of strip/ribbon artifact, distorted folding ink, GPU/HTML handoff, and legacy facet fallback. This patch does not claim those problems solved.
3. Landscape facing pages, RTL/LTR, reader controls, dictionary tap/selection and real 120Hz jank measurements.
4. Exact-commit GitHub Android and browser CI, then separately an owner-signed update with the permanent certificate.

Source before change: `d44a885d78e31ebe0065cc0975294ccbfce7d4ac`. Screenshots from Chromium are not Android hardware visual acceptance.


## 17 November 2026 — paper curl repair and signed release (CI verified, device acceptance open)

- PR [#97](https://github.com/amroalhamedi2022-hue/Storylens/pull/97) merged to `main` as `720414d57b73588de1db6c04780b8b828bc080aa`; merged tree `6677250425504289209545ba3b0e4438e394909c` **exactly matches** synthetic CI build tree and feature branch `dceb6d053bede23da8be6548006f5da6c7bbdd24`.
- Full Android/Node/Chromium reader CI [#44032449581](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/44032449581) **SUCCESS**; separate WebGL2 and cold HTML fallback [#44032449580](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/44032449580) **SUCCESS**. Screenshots are from the actual Chromium-rendered app (not Android hardware).
- Removed the exposed 22-facet CSS fallback in favor of a single HTML page sheet; fixed full-width pointer movement mapping (old implementation used 2× sheet width); introduced held-finger-aware restrained mesh deformation; expanded GPU viewport across the facing page in landscape; shifted page commit before curl-overlay cleanup to avoid a blank or stale intermediate frame; removed instant cold button-turn jumps. Updated regression and browser fixtures rather than disabling tests.
- Original owner PKCS12 signer used OFFLINE: package `com.storylens.reader`, versionCode `101304`, release APK SHA-256 `2de5fe30d42096cae9a2a90fab02abdf0bbdf3aeccf3b73f7388f15ea61864e4`, signing certificate `3df6489eacea84e78b715943ca4d014abb24e3159641e0bf80890ecedcf9da31`, v2/v3 verified and key JS/CSS asset hashes unchanged. **The APK was attached directly to the user conversation**, not published to GitHub Releases; do NOT claim a public download URL or fabricate a Library link.
- Hardware installation and performance/120Hz, visual user acceptance and full phone/Pad 5 regression remain **UNVERIFIED**. Issue [#96](https://github.com/amroalhamedi2022-hue/Storylens/issues/96) must stay open until user/device comparison confirms that the reported ribbon, text distortion and blank frame no longer reproduce. No changes to literature source text, content rights or update identity.
