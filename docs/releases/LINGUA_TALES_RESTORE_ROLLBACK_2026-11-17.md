# Lingua Tales — rollback recovery update (17 November 2026)

## Source and verification
- After the owner-reported severe regression in the 101304 paper-curl update, PR #97's nine engine/test files were restored to their prior approved source at `main` commit `9e1adacb451b6852e8ff4990d0d91e96ece2710d`. Literature, database and existing app data were not altered in this rollback source commit.
- Full Android build and tests: GitHub Actions [run 44035447213, attempt 2](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/44035447213) **SUCCESS**. First attempt failed the Wen Glass browser smoke; second attempt passed. Read source's exact run number **1306**, hence Android versionCode **101306**.
- Offline unsigned CI artifact SHA256 `4ec27d2a51bb445682eb79da48d935bbd44af0e6eb38c66985c31db998fce69c` was verified against CI output then signed locally using the **original retained owner PKCS12 key**; no new key was made and no key/password was committed or sent to GitHub.
- **Signed recovery APK:** `Lingua-Tales-2026-11-17-RESTORE-v101306-OWNER-SIGNED.apk` (attached in user's ChatGPT conversation, not in repository or public Releases). Package `com.storylens.reader`, versionCode `101306`, SHA256 `6af0473ec9a1b8e54f304a192acb3f01ff9d1a800dd3d77719a011ef4d0d4638`, Android signing v2/v3 verified.
- Signing certificate SHA256 is `3df6489eacea84e78b715943ca4d014abb24e3159641e0bf80890ecedcf9da31` — **same certificate as the previously installed 101304 update**, and the compiled reader/curl/CSS and Verne Chapter I assets are byte-identical before and after signing.
- Hardware installation, app-data preservation on this particular device, Xiaomi Pad 5 120Hz performance, and owner visual acceptance remain **UNVERIFIED**. Do not claim repair of all earlier curl problems: this recovery intentionally reverts the PR97 changes.

## Independent library research — separate, NOT in this APK
- Branch `experiments/pageflip-engine-evaluation-20261117` contains executable offline HTML demos/tests for real published `page-flip@2.0.7` vs `@openpageflip/core@0.7.0` with the original first chapter of *Around the World in Eighty Days*.
- [Run 44038340214](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/44038340214) independently tested OpenPageFlip in 4 RTL/LTR phone/spread edge scenarios plus 3 interior **blank-paper** free-grab scenarios; all seven passed after isolating `.source-text,h2` from drag to preserve native text selection/dictionary. The earlier ungated free-grab blocked text selection. StPageFlip had no native RTL and the LTR smoke exposed non-settling back and requestAnimationFrame activity after destroy.
- OpenPageFlip is **candidate only**, not an approved main app engine. The experiment did not change production reader, permissions, database, or signer. A real Android WebView and hardware comparison is mandatory before feature-flagged integration.

Keep [curl visual issue #96](https://github.com/amroalhamedi2022-hue/Storylens/issues/96) open until device-proven acceptance.
