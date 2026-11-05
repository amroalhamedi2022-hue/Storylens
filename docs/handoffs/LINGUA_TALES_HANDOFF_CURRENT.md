# 2026-11-05 — NEW 13-REQUEST READER REDESIGN PLAN (NOT CODE)

**NEW USER DIRECTIVE 2026-11-05:** Canonical 13-point reader rebuild `docs/plans/LINGUA_TALES_READER_REDESIGN_2026-11-05.md`; Codex only physical curl `docs/prompts/CODEX_PHYSICAL_PAGE_CURL_2026-11-05.md`. Supersedes old conflicting 58-themes, default silent SFX and nonimmersive paper choices. Docs changes only; NONE of the features in this new checklist implemented by this commit.

Codex owns physical curl engine ONLY; separate design/functionality workstream owns orientation, theme six-only migration, paper presets, no-copy WebView, UI, audio/fonts/icon and signed release, while literature chat owns authentic content and source art. Check latest main SHA/CI before code. Last signed baseline remains 100866; no new APK created by this documentation commit.

---

# Lingua Tales — CURRENT HANDOFF (newest release checkpoint)

## CURRENT CHECKPOINT — 4 November 2026 · tablet art integration + signed update 100866
- Main merge commit [0c98f497](https://github.com/amroalhamedi2022-hue/Storylens/commit/0c98f497e642dbf1c9f2fe35109c1151a32ca502) has EXACT tree SHA `1cc8e6d75c1ae6aec5889a9f43fac8623eb1d0f7` as green PR #6 source and the GitHub synthetic test merge `0a1cb44a8495b0517590b2ea04e98a6724a05937`. [Android, Node, full Chromium PR CI #41833654239](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/41833654239) **SUCCESS**; exact post-merge [main CI #41834411224](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/41834411224) was **IN PROGRESS** at this documentation write (check status before declaring pass).
- ACTUAL owner-private signed production UPDATE: `/Lingua Tales/Releases/Lingua-Tales-1.0.0-Tablet-Art-v100866-SIGNED-UPDATE.apk` and independent report `/Lingua Tales/Releases/Lingua-Tales-1.0.0-Tablet-Art-v100866-VERIFICATION.txt`. VersionCode **100866** (previous official signed build **100857**), package `com.storylens.reader`, versionName `1.0.0`, APK SHA-256 `8e6c2814b80f36895c612149fba5f5918e2dc52937a95383e38f05b6cd747dab`, permanent pinned cert SHA-256 `3df6489eacea84e78b715943ca4d014abb24e3159641e0bf80890ecedcf9da31`, v2/v3 verified and key reader/backup/glass bytes exactly match unsigned CI input. Signer and passwords retained unchanged in PRIVATE Library. No public GitHub signed release.
- Original-source ARC art integration: user has allocated authentic image discovery and provenance to a **separate literature conversation**; **this** design/functionality stream owns image placement/caption/cropping/reader integration. New archival images require `verifiedArchive=true`, `sourceParagraphExact=true`, `distributionReviewApproved=true`, approved `archiveSource`, exact `afterParagraph`, safe local image, `alt`, `credit`, `aspectRatio`. Tablet portrait folios default to a side vignette; phones stack; approved art never crops/sepia-filters; zoom and bilingual pairing preserved. Previously shipped legacy images remain unaffected. **No new art files or books were sourced or inserted in this specific update.** 
- Real Xiaomi Pad 5 and phone installation/performance and actual 120Hz optical/ink validation remain **UNTESTED**. Do not claim physical-device verification or original AGSL pixel refraction parity.
- Signed release evidence: [docs/releases/LINGUA_TALES_1_0_0_TABLET_ART_SIGNED_UPDATE_2026-11-04.md](../releases/LINGUA_TALES_1_0_0_TABLET_ART_SIGNED_UPDATE_2026-11-04.md). Older 100857 and 100851 releases and private keys remain intact.

---

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

### 2026-11-04 — GL03/GL09/GL10 tablet-first optical polish (SOURCE, exact-head CI pending)
- Verified parent main `ce57a4094dc01b89d589d7b23306ecf20b6940f5` passed [Actions #41818620408](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/41818620408). The user prioritises highest-quality tablet glass and fluid motion; phone and accessibility fallbacks must remain.
- Changed only isolated WebView glass CSS/JS, Node/browser QA and handoff/plan. Adds real adjacent-tray optical morph using hit-testing WITHOUT synthetic navigation, velocity-bounded elastic lens stretch, native vertical-scroll arbitration, release cleanup, tablet >=700px multilayer pearl bevel/glints and 7px limited live single-lens backdrop; never blur full cards, paper, text or original colour images.
- Tests updated to assert sibling morph, no duplicate click, scroll release, clear reader ink. NOT native AGSL/iOS exact pixel refraction or a real-device 120Hz pass. Existing physical book curl, complete contextual translations/art rights and same-signature signed update all remain open. Exact-new-HEAD CI is pending at commit time.

### 2026-11-04 — GL03 sibling morph test geometry correction
- The first tablet optics push `9101b79ccefc65eb8bdcffb2705204c3cf0a2d42` failed [Actions #41820028729](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/41820028729) at the *newly added synthetic Node assertion*, before Android/Chromium stages. The lens intentionally follows the **finger-offset inside a sibling** (position ~252px for sibling left=260px), so asserting lens left >=260px was geometrically incorrect. Tightened the assertion to verify the *correct bounded morph range* 240..320px; no production JS/CSS was changed in this repair. Exact new-commit CI pending. Do not describe the failed run as green.

### 2026-11-04 — APK04 SAME-SIGNER update actually produced and verified
- **Exact release source**: `4f3141305261e418bb52e7f95abe544d14ef50fb`, [Android/Node/Chromium Actions #41820304484](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/41820304484) **SUCCESS**, CI run number **857**; this completed the preceding GL03/GL09/GL10 test correction and browser/glass screenshot gates.
- Retrieved the exact **unsigned production** artifact `Lingua-Tales-Unsigned-Production-NOT-INSTALLABLE` (artifact ID `13317325972`), verified CI source SHA, variant, package, unsigned original SHA-256, and monotonic `versionCode=100857 > 100851`. Signed **offline**, using the PREVIOUS private RSA-3072 PKCS12 identity from owner's private Library, alias `lingua-tales-permanent`; **NO new key created**, **NO secret uploaded to public GitHub**. Android `apksigner` independently verified v2/v3 signatures, permanent public certificate `3df6489eacea84e78b715943ca4d014abb24e3159641e0bf80890ecedcf9da31`, and byte-for-byte identical packaged reader/glass/backup assets before vs after signing.
- **Actual installable private signed update**: `/Lingua Tales/Releases/Lingua-Tales-1.0.0-Tablet-Liquid-Glass-SIGNED-UPDATE.apk`; SHA-256 `c6ec45f3c5604cb8bc158a590009dec51d11a0007e9e568ab6a8bd5eb4e8b701`; `applicationId=com.storylens.reader`, `versionName=1.0.0`, `versionCode=100857`. Private verification report `/Lingua Tales/Releases/Lingua-Tales-1.0.0-Tablet-Liquid-Glass-Verification.txt`. Original 1.0.0 baseline APK and permanent private credentials retained untouched, in their own folders.
- **Unverified:** physical in-place update on user's real Xiaomi Pad 5, Android install state, hardware FPS/jank/thermal and manual screenshot opinion. This signed build does NOT imply true native AGSL refraction, complete literature/translation/editorial rights or finished curled-page physics. GitHub retains tested source/unsigned CI artifacts only; privately signed APK resides in user Library, NOT public GitHub Releases. If this documentation commit is newer than signed source, compare to the signed-source SHA and do not mistake documentation-only CI for a new user update.

## 6. CONTENT-ONLY workstream 2026-11-04 — avoid duplicate literature intake

Dedicated literature/archive conversation created for real complete original books + full natural opposite-language translation, old world real covers/embedded original vintage art. Branch `content/moonstone-original-and-plates-20261104` proposes authentic **1868 Wilkie Collins The Moonstone** from fixed upstream `81eafac7022dbdb26f52fa90377fb7bba9996808`, 53 narrative XHTML units + 3 structural headings, original LICENSE, SHA-pinned manifest and CI-integrated checksum test; additional three verified historic print **research leads**, NOT image binaries or APK artwork. See `docs/literature/LIBRARY_CONTENT_PIPELINE.md`, `docs/LITERATURE_SOURCE_QUEUE.md`, `docs/LITERATURE_PROVENANCE.md`. No full AR translation; nothing in Android library; no new signed APK. Exact source CI required for main. A daily ChatGPT content audit is enabled independently of GitHub Actions. GL engine/reader data/signer and physical-device work remain completely separate.


### 2026-11-04 — design/functionality-only tablet keyboard + multitouch glass safety (CI pending)
- Workstream separation: another conversation independently owns sourced original books, full natural translations and true historical cover/in-chapter imagery. This batch changes **NO** literature/staging/image/source rights, package/signature/data/backup/SRS files. Preserve existing signed update `100857` and private signer.
- RD02/QA: Paged reader adds focusable paper surface with RTL/LTR-aware physical `PageDown`/`PageUp` and arrow keyboard navigation for tablet/Bluetooth keyboard. It calls the existing `move(delta,'keyboard')` path to preserve chapter/page position and optional sound, without accidental exit at book end. Keyboard input is ignored from tokens, controls, dialogs, selected text and modifier combinations.
- GL09/GL10: Second contact cancels decorative lens to leave pinch/scroll/selection native; stale keyboard glass highlight clears on focus loss/blur; subtle paper focus ring, never changes ink/illustrations. Node regression covers directional binding, final-page guard, multitouch cancel and keyboard cleanup.
- SOURCE IN REVIEW on feature branch `design/reader-keyboard-glass-input-safety-20261104`; exact new-HEAD Actions and real tablet/phone hardware acceptance **PENDING**. Do not call a new signed APK produced. Next: verify PR exact-source Android+Chromium CI before merging to main, then real tablet RTL and keyboard tests.

### 2026-11-04 — PR #4 accepted and merged after exact source tests
- Source `c9ddb4e5abf8e48e65a1370fac0edc677229d2c8` passed [full PR Android/Node/Chromium CI #41823205151](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/41823205151) **SUCCESS**. [PR #4](https://github.com/amroalhamedi2022-hue/Storylens/pull/4) was merged on `main` at `2aad0607e5f76fcef01e34c7d2f961d6a5b5e349` (clean, expected head). This supersedes the prior “source in review” note.
- Post-merge exact `main` Actions [#41823932937](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/41823932937) **PENDING** at this documentation checkpoint; check real conclusion. Previous main content-merge run #41822409425 failed in Chromium Wen Glass browser fixture, and its attempted rerun was cancelled by new main workflow concurrency; do not call that old failure green or blame staged literary contents without a reproduced root cause.
- Tablet page keyboard navigation and two-finger decoration safety are **SOURCE + PR CI VERIFIED**; actual Xiaomi Pad 5, phone gesture/touch, FPS/thermal, 58-theme screenshots and future same-signer APK **NOT YET DEVICE/RELEASE VERIFIED**. Signed 100857 APK remains last real update. Content and historical artwork remain the separate stream.


### 2026-11-04 — UX04 tablet art integration + signed update preparation
- User delegated all historical image SOURCING, licence/provenance collection, and narrative image suggestions to the separate literature chat. This design/functionality stream owns **actual on-page positioning, margins, scale, responsive wrap, intact colours, captions, zoom and image/paragraph reading QA**. Source/translation/art files from that stream remain untouched.
- Reader source now keeps legacy local art placement intact and applies an opt-in archival metadata contract (verifiedArchive, sourceParagraphExact, distributionReviewApproved, allowed archiveSource, credit, aspectRatio) to new sourced art. Invalid/incomplete archival claims are rejected, not rendered. Exactly approved portrait folios default to a tablet edge vignette, while the same art stacks naturally on a phone; authors can explicitly request wide/left/right. Archive images ALWAYS use uncropped full-frame object-fit, regardless of a conflicting crop flag. The image still mounts after the exact paragraph AND its bilingual companion and uses the same offline magnifier/Android Back.
- Added isolated responsive CSS and pure source-level QA. Does not change books, images, translations, source staging, keystore, app ID, backups, dictionary or financial app. Source changes need exact Android/Chromium CI and physical Xiaomi Pad 5 approval; permanent-key signed update must be generated from a GREEN source SHA with versionCode >100857. Branch/PR CI pending at documentation write.


### 2026-11-04 — Content recovery from PR #5 onto current main (staging only)
- Recovered byte-identical source Git blobs from content/verne-completion-war-of-worlds-20261104, preserving the current main tablet art/reader and signing baseline. The War of the Worlds: 27 original English narrative chapters plus structural XHTML, original source manifest and licence. Added four Verne historical plate *source leads*, not downloaded image files. Included dedicated deterministic tests in Android CI.
- This is an independent clean-base content recovery because PR #5 was merge-conflicted. No new translation or image binaries, no published APK books, no global-rights approval; Arabic 0/27 and historic art distribution/scene approval OPEN. Do not claim PR #5 merged or count this as a second independent book.
- New source/CI result pending until GitHub Actions finishes. Preserve original PR #5 as historical provenance until new PR is verified and merged.

### 2026-11-05 — RDR-01 physical HTML curl (source branch; CI pending)

- Isolated `feature/physical-page-curl-20261105`, originally based on green main `15fd0facfe625946150d46c3adb37008c49da1e8` (Actions #41976705425). Refreshed concurrent main to `d0fc13a`; its fonts/materials/six-theme work is being preserved through a merge, not overwritten.
- Adds a tapered 22-facet HTML sheet, visible adjacent-page reverse, actual underpage, velocity-aware spring release, correct source-language binding and two-page landscape spreads. Original dictionary nodes and existing storage remain intact. Native Back gets only the narrow fold-cancel hook. API and StPageFlip 2.0.7 research: `docs/PHYSICAL_PAGE_CURL_API.md`.
- Local validation before concurrent-main integration: all 106 Node test files PASS; new real Chromium acceptance PASS in LTR/RTL portrait/spread, including no-commit cancellation, exactly-one commit, dictionary single invocation, chapter boundaries and rotation/rebuild/saved anchors. Existing Python signing/update contract (5 cases), JS syntax and audio-focus checks PASS. Full existing Chromium suite and Android/Actions are still pending.
- Not a signed APK or device acceptance. Xiaomi Pad 5 touch feel, 120Hz/frame pacing, GPU memory/thermal and TalkBack remain unverified. The model is a ruled geometric approximation, not finite-element physics; adjacent-chapter previews are bounded source text. No key/package/content/user-data changes.
