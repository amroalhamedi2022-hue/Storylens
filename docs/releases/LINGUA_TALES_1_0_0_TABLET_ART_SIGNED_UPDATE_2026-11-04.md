# Lingua Tales — Tablet Art Integration: signed in-place update (2026-11-04)

## Actual verified package

- **Download remains private in owner's ChatGPT Library:** `/Lingua Tales/Releases/Lingua-Tales-1.0.0-Tablet-Art-v100866-SIGNED-UPDATE.apk`
- Android package: `com.storylens.reader`; `versionName=1.0.0`; `versionCode=100866` (**greater than previous signed update 100857**).
- Signed APK SHA-256: `8e6c2814b80f36895c612149fba5f5918e2dc52937a95383e38f05b6cd747dab`.
- SAME permanent RSA-3072 PKCS12 signing identity as original and 100857: public certificate SHA-256 `3df6489eacea84e78b715943ca4d014abb24e3159641e0bf80890ecedcf9da31`. Android v2/v3 both verified with official `apksigner`.
- GitHub CI test: [#41833654239](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/41833654239) **SUCCESS** from PR #6 tested merge SHA `0a1cb44a8495b0517590b2ea04e98a6724a05937`, CI run `41833654239`, raw production APK SHA verified before offline signing.
- Proven identical code tree: PR source `1cc63343995d044b90ef6ffce1ac23d0840e53ca`, synthetic test merge `0a1cb44a8495b0517590b2ea04e98a6724a05937`, and main merge `0c98f497e642dbf1c9f2fe35109c1151a32ca502` all have exactly Git tree `1cc8e6d75c1ae6aec5889a9f43fac8623eb1d0f7`. So the signed PR artifact is the EXACT committed main contents, only its build commit ID/run number is different.
- Original offline assets and `reader-experience.js/css`, `lt-device-acceptance.css`, `lt-wen-glass-engine.js/css`, `lingua-shell.js`, `data-backup.js` and `index.html` byte-compared before/after signing.
- Audit: `/Lingua Tales/Releases/Lingua-Tales-1.0.0-Tablet-Art-v100866-VERIFICATION.txt`.
- **Do NOT regenerate the key or commit it to GitHub.** Existing older signed packages + private signer preserved in user Library.

## Implemented in this package

- Historical image-placement adapter in the original and companion reader: verified scene exact paragraph anchor, metadata/rights assertions for newly submitted archival pictures, portrait edge float on tablet, full-width stacked figure on phone, uncropped original colour/folio, preserved credit, offline magnifier and bilingual adjacent layout.
- Existing Verne/legacy printed pictures and historical colour scenes continue working; existing book content, word-saves, SRS, local backups, Android ID and DB untouched.
- Literature/period art SOURCE ACQUISITION is owned by the user's parallel content conversation. This update adds the **integration path**; it does not fabricate or package new image binaries or complete translation assets.

## Still open

- Exact post-merge main workflow [#41834411224](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/41834411224) **PENDING at documentation update**; check eventual conclusion independently.
- Physical installation/upgrading on Xiaomi Pad 5/phone, scrolling/reading performance/120Hz/FPS/thermal, long-hold paper curl, 58-theme visual QA.
- Complete verified long-fiction translations, rights clearance and original chapter art intake remain independent editorial tasks. No GitHub public signed-release asset or configured encrypted signing secrets.
