# Lingua Tales — Gold Icon Owner Update (2026-11-07)

- **Signed APK**: `Lingua-Tales-v101044-Golden-Paper-Official-SIGNED-UPDATE.apk` (private ChatGPT Library at `/Lingua Tales/Releases/`).
- **Production identity**: `com.storylens.reader`, versionName `1.0.0`, versionCode `101044`. Previous owner release: `101038`.
- **Retained signing certificate SHA256**: `3df6489eacea84e78b715943ca4d014abb24e3159641e0bf80890ecedcf9da31`. Private .p12/password never placed in GitHub.
- **Signed APK SHA256**: `f71c975b6faa85e8f63db01f6bbabe2d267f56354d97c0e23199dcfa43831558`; verified APK Signature Scheme v2/v3.
- **Source**: verified Android production source [CI run 42190578603](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/42190578603), commit `8555bcc0089ec68ecb2760c79264629167784d30`; newer source changes before the owner signing were `docs/literature/` staging only, not released reader art.
- **Exact user-approved golden book/world/moon/quill/castle icon**: 1024x1024, no lettering, PNG SHA256 `757427720c7e9669aaae1de0f9e86ae67a8c9c6f89bb6e945dd8e2a4e73d38ef`. In the private signed APK both `res/VO.png` and legacy `res/t_.png` are replaced with this exact PNG, all other original unsigned archive entries verified byte-identical.
- **Permanent source fix**: `app/src/main/res/drawable-nodpi/lingua_tales_approved.png` now carries exactly the same golden artwork; `tools/GenerateTextlessLauncher.java` makes byte-exact `lingua_tales_textless.png` and rejects any changed source SHA. Launcher test verifies exact art and 1024 dimensions. Future Android builds cannot silently revert the original neon icon.
- **Paper**: antique bound-book CSS, local static fibre SVG, approved image placement and curl engine remain unchanged. Real historic illustrations need separate provenance and rights approval; no new unapproved art is auto-injected.
- **Tests**: production source CI and v2/v3 packaging passed; actual owner hardware installation, backup/restore, 120Hz/thermal validation not yet performed.
- **Next signed update** must retain certificate/package and use versionCode >101044, preferably from new exact-head CI once golden image source is verified.
