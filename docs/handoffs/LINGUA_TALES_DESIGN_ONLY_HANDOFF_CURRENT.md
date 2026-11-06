# Design-only visual recheck — 2026-11-06

### 2026-11-06 — visual recheck + Wen Reader Sanctuary V2 (CI pending)
- DESIGN ONLY, no Codex curl or chapter navigation edits, no data/content/audio/signing changes.
- All six user-approved app themes are guaranteed visible in settings, regardless of old hidden preference; added five Wen Sarafet-inspired editorial colour presets to the **existing** theme editor, not five extra themes.
- New late CSS has clearer neutral liquid-lens highlights and user custom gradient propagation; corrects old reader.dark/selected-paper text contrast, shows original historical images without crop/tint, centres 48px controls, gives tablet portrait more usable book width and hides redundant metadata visually without changing saved progress.
- Node plus true headless Chromium visual gate at 460x860, 768x1024, 1280x840; checks six theme appearances, six papers, contrast >=7:1, RTL, uncropped art, novel shelf isolation and reduced-effects. QA screenshot is a fixture, not an installed-app capture.
- `docs/design/LINGUA_TALES_VISUAL_RECHECK_2026-11-06.md` is the persistent request-by-request audit. Exact-head CI and hardware Pad 5 testing still OPEN.

See docs/design/LINGUA_TALES_VISUAL_RECHECK_2026-11-06.md

---

# Lingua Tales — Design Only Handoff (2026-11-05)

**Permanent ownership:** This conversation edits ONLY visual design/themes, reader comfort, optical materials, image presentation, accessibility of visual controls, and UI layout. Codex owns functional physical page curl (PR #19); the separate chapter/gallery workstream owns chapter navigation (PR #18); literature chats own authentic text and art acquisition. Do not modify app storage, user data, dictionary, audio functions, Kotlin financial code, signing or Android package identity here.

## Wen Reader Sanctuary — Verified Merge
- Source PR [#22](https://github.com/amroalhamedi2022-hue/Storylens/pull/22) merged as commit `4714ae728e8fe0d2f54dc5bcfd994b14b4aaa82c`.
- Final code `73083ef16f0b1601507e13b564a88d6a61b7494d` passed complete [GitHub Actions #42095101320](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/42095101320) Android / Node / Chromium tests **SUCCESS**. First optical screenshot run #42094430676 failed because a single historical novel cover lost its centre alignment; fixed by excluding special `lt-novel-shelf` / `lt-novel-card` from generic two-column shelf rules and verified green.
- Visual source `app/src/main/assets/lt-wen-reader-sanctuary.css`. Six approved theme IDs only: liquid-27, aurora, aqua, nebula, paper-atlas, midnight-library. Adds passive Wen-inspired atmosphere, a stronger crown on the EXISTING single active lens, 44px centred controls, normal 2-column tablet / 1-column phone cards, original-colour uncut manuscript art and no glass on real paper/ink; no animations when idle.
- Existing `lt-wen-glass-engine.js/css` ports Wen Sarafet `glass-engine` aesthetic optics and 0.60 follow/265ms release. Android AGSL native pixel refraction is NOT equivalent to CSS WebView optics. Do not duplicate input engine or claim pixel-exact parity.
- QA: `tools/wen-reader-sanctuary.test.cjs` and `qa-wen-reader-sanctuary.html` with two Chromium viewport sizes. Screenshot artifact in run #42095101320 is a test fixture preview, not a photo of the final production build.
- No new APK or private signer touched. Real Pad 5 landscape/portrait, 120Hz, thermal and native hardware QA remain open.

**Design sources:** https://developer.apple.com/design/human-interface-guidelines/materials and https://doi.org/10.1006/ijhc.2001.0458 .

Always check newest HEAD / PRs and keep design changes separate from Codex, chapter layout and literary content.