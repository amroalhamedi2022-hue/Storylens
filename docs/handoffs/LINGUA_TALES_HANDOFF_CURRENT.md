# Lingua Tales — CURRENT PROJECT HANDOFF

**Updated: 4 November 2026 (Asia/Gaza). This is the canonical CURRENT handoff, not an old PR #1 note.**
**Repository:** https://github.com/amroalhamedi2022-hue/Storylens — `main`.
**Last TESTED source HEAD:** `31b895efa6028e356b55a49a0d514a2239ff000d`.
**Exact-head Android/Chromium CI:** https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/41816102388 — **SUCCESS** (including new Wen Glass regression, real Chromium optical fixture and phone/tablet RTL screenshots).
**Earlier glass implementation HEAD:** `1c0e84fa4b128c40af391d5bdcbc8d927e11fead` — CI #41815804696 **FAILED only in newly authored fixture test**, corrected by `31b895e`. Do not repeat the fix.
**This handoff is documentation; its own Git commit will have a newer HEAD whose CI is independently pending until run.** Always refresh latest HEAD/Actions at session start.

## 1. User's binding requests / decisions

- Build **Lingua Tales** as a premium, offline-first, long-form **real literature** Android reader. Source on GitHub; merge ready source to `main`, no redundant branches/commits. Never generate fictional new books, substitute abridgements for originals, add children’s retellings, or claim staged books are shipped.
- **Port the REAL Wen Sarafet Liquid Glass design/gesture engine and improve it across all Lingua Tales interactive surfaces**, while preserving native reading/dictionary/translation/backup/app logic. The paper, printed text and original colour artwork must stay opaque, sharp and distortion-free.
- User approved a **one-time fresh signed official v1.0 install**; every subsequent APK must be an in-place update using the **SAME private signing key**. No new keystore, no `.preview` package, no destructive migration without verified backup.
- Keep evolving a single comprehensive plan and a continuously updated GitHub handoff AND private Library plan for conversation changes. Read current HEAD before committing; update `docs/LINGUA_TALES_LIVE_STATUS.md` in the same meaningful code commit.

## 2. Source and current Wen Glass status

**Reference repo is read-only for this task:** `amroalhamedi2022-hue/Wen-sarafet`.
Source branch `design/wen-full-unlocked-sandbox-20261101@b57dcd3c71df7273acf5cd316687472f60c11d80`:
`glass-engine/src/main/java/app/wensarafet/glass/{GlassMotion,WenNavigationLensDrawable,WenOpticalNavigationOverlay,WenLiquidRuntimeOptics,WenGlassBackdropDrawable,WenFabBubbleDrawable}.java`, `docs/design/wen-glass-design-tokens.json`.
More recent visual-only branch `design/wen-188-visual-only-review-20261104@f14f1d6e8ed3fb7629bfda7583f0b107f57ef4b8` includes `NavigationLiquidMaterial.java` wrapping third-party MIT LiquidGlassView/AGSL and `NavigationVisualDecorator.java`. Check branch HEAD again before subsequent porting. **Never edit Wen finance/source/Safe Zone.**

**Different runtimes:** Wen uses Android View/Canvas/AGSL; Lingua Tales uses HTML/WebView. We built a **WebView CSS/JS optical approximation**, NOT the identical native shader. Ported gesture `FOLLOW=.60`, `RELEASE_MS=265`, cached/specular pearl material, single touch-through lens per option track, delegated finite press/move/up/cancel/lostpointercapture, reduced-motion/transparency, keyboard/RTL and no idle animation/synthetic click. No live refraction of underlying pixels and no demonstrated true iOS/native AGSL parity. Prioritise measured improvement, not false visual claims.

**Already committed on main:**
- `1c0e84fa4b128c40af391d5bdcbc8d927e11fead` — `app/src/main/assets/lt-wen-glass-engine.js`, `.css`, linked once in `index.html`; genre/drawer/settings/search/card/reader-toolbar controls; `qa-wen-glass.html`; `tools/wen-glass-port.test.cjs`; expanded Android CI Node/Chromium screenshots and APK asset gates; master plan and AGENTS.
- `31b895efa6028e356b55a49a0d514a2239ff000d` — fixed fresh test text assertion and fake keyboard DOM, preserving product logic; **exact SHA CI green**.
- Screenshots/artifacts on [CI #41816102388](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/41816102388): `StoryLens-UI-Screenshots`, `Lingua-Tales-Unsigned-Production-NOT-INSTALLABLE`, `Lingua-Tales-Preview-NOT-PRODUCTION-UPDATE`. **Unsigned/Preview artifacts are NOT the signed user update**. Real phone/tablet is NOT yet tested.

**Current GL01–GL10 acceptance:** WebView material and pointer lifecycle are **SOURCE + CI VERIFIED** for initial surfaces. GL02–GL08 partial: uniform look under all 58 themes, visual reviews and control-specific regression remain. GL03/GL09 held-drag-to-select sibling navigation is NOT complete; current lens follows touch but never synthesises navigation (intentional). GL10 hardware FPS/thermal/120Hz, TalkBack and device gesture proof OPEN. Native AGSL-style real refraction OPEN. Preserve `lt-tap-feedback.js` semantics and reader word/image touch ownership.

## 3. Permanently signed Android baseline (DO NOT lose)

**Actual prior first-install APK exists** only in user's **private ChatGPT Library**, NOT in a public GitHub Release:
`/Lingua Tales/Releases/Lingua-Tales-1.0.0-Official-SIGNED.apk`
and its validation file beside it. It was signed offline after successful CI #41642200812; Android APK Signature Scheme v2/v3 verified. User installation on device has NOT been confirmed.

- Production ID: `com.storylens.reader`, visible `1.0.0`, baseline `versionCode=100851`.
- APK SHA-256 `dee01c94dba9110afe3d5c73a2be1f998a5348c7277e0c8c8a9ac8a65d2fcca9`.
- PUBLIC signing certificate SHA-256 `3df6489eacea84e78b715943ca4d014abb24e3159641e0bf80890ecedcf9da31`.
- Private PKCS12 signer and recovery credentials: **private Library only** `/Lingua Tales/Private Signing/`; never echo, post or commit any secret, keystore or recovery password. Never generate a second signer.
- Canonical first signed APK handoff: `docs/releases/LINGUA_TALES_1_0_0_INITIAL_SIGNED_HANDOFF_2026-11-03.md`. Safe source-to-release helper `tools/sign_lingua_offline.py` has the OLD 1.0 source SHA pinned and must be carefully parameterised/updated for each NEW source CI run, while retaining the original key/certificate and a strictly higher versionCode. GitHub Actions Secrets are not configured and GitHub has no signed Release binary at this handoff. An update using new glass source is NOT YET signed/delivered.

## 4. Completion priorities — do not confuse code existence with completion

| ID | Status | Finish gate |
|---|---|---|
| GL01 | Implemented / exact-head CI PASS | Validate against actual device and all non-Glass themes, opt-out behaviour |
| GL02–GL08 | Initial wide UI coverage / PARTIAL | Polish header, cards, search, drawer, theme editor, reader toolbar, word/SRS/audio/dialog controls without corrupting reading/handlers; compare phone/tablet RTL/LTR screenshots |
| GL09 | PARTIAL | Genuine held lens fluidity, hysteresis, viscosity, bounded spring, hold-slide-to-target only with correct native click semantics; cancellation/scroll and multi-pointer proof |
| GL10 | PARTIAL | 58 themes, light/dark, opacity/contrast, reduced-motion/transparency, keyboard/TalkBack, low-RAM/120Hz and thermal benchmarks on actual Xiaomi Pad 5 and phone |
| RD01 | PARTIAL | Real tactile deformable held page curl (existing visual fold != fully physical sheet), RTL/LTR, ink never distorted, no text/image clipping |
| UX01–UX04 | PARTIAL | Premium curated shelves/home, historical covers with title, images INSIDE exact scenes with documented credits/rights, menu never text-selectable, compact scrolling |
| C01–C05 | STAGED/PARTIAL | Full unabridged existing adult classics + whole Arabic heritage, multi-genre; 15-chapter Hound and 12-chapter Sign of Four in repo STAGED outside APK; rights and complete contextual AR translations + historic in-chapter art still missing |
| LANG/DICT/AUDIO | SOURCE/PARTIAL | Natural complete AR/EN human editorial, correct original language/translations, dictionary senses, SRS and optional offline playback physical verification |
| PERF/QA | CI source PASS; device OPEN | Real install/upgrade, frame pacing/120Hz, search/pagination/swipe, offline, backup/restore and no data loss |
| APK follow-up | OPEN | From latest green main compile official package; sign with EXACT private 1.0 signer, increase versionCode >100851, verify cert+APK hash, deliver a new installable signed update privately |

Content queue and provenance: `docs/LITERATURE_SOURCE_QUEUE.md`, `docs/LITERATURE_PROVENANCE.md`, `docs/literature/staging/`. Verify region-specific original/translation/art rights separately. No fake “120 novels completed”; no AI-written fiction. Kalila wa Dimna Arabic full-source staged outside APK; One Thousand and One Nights authentic whole edition still unresolved. Verne Towle 37 chapters already in product but editorial acceptance unfinished.

## 5. Canonical update/resume procedure

1. Inspect **actual newest** `main` HEAD, merged PRs/parallel agent commits and Actions; do not rely on this fixed SHAs as immutable future HEAD.
2. Read **`AGENTS.md`**, **THIS handoff**, **`docs/LINGUA_TALES_MASTER_PLAN.md`**, **`docs/LINGUA_TALES_LIVE_STATUS.md`**, **`docs/LINGUA_TALES_WEN_LIQUID_GLASS_MASTER_PLAN_2026-11-04.md`**, **`docs/LITERATURE_SOURCE_QUEUE.md`** and signed baseline handoff.
3. Continue only unfinished GL items, working code and automated+real browser QA; DO NOT change financial repo or reader/storage logic while porting style. Prioritise visual evidence, actual reader/control integrity and bounded work over more checklists.
4. Before each source merge ensure exact changed-head tests passed; update live status in same commit. If tests fail, diagnose/log and fix, never label failed/pending as green. Update plan/handoff as scope shifts.
5. Reuse original key on future APK updates, and verify artifact signature + increasing versionCode. A green GitHub unsigned production build IS NOT a deliverable signed update.
6. In future conversations use: **“Continue Lingua Tales from docs/handoffs/LINGUA_TALES_HANDOFF_CURRENT.md. Check latest main & Actions; implement only outstanding GL01–GL10 and master-plan items, update live status/handoff in same commit, preserve signed v1.0 key, no duplicate work or invented books.”**

**Private Library copies:** `/Lingua Tales/Plans/LINGUA_TALES_HANDOFF_CURRENT.md` and `/Lingua Tales/Plans/LINGUA_TALES_WEN_LIQUID_GLASS_MASTER_PLAN_2026-11-04.md`. The current handoff is source-verified via CI #41816102388; this documentation-only update must be retested as its own HEAD if needed.
