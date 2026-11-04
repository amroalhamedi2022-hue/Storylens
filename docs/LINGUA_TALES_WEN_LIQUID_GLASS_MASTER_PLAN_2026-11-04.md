# Lingua Tales — Wen Liquid Glass Engine + Complete-Product Roadmap

**Living plan / الخطة الرئيسية للتنفيذ | 4 November 2026**

**Current verified project checkpoint:** [docs/handoffs/LINGUA_TALES_HANDOFF_CURRENT.md](handoffs/LINGUA_TALES_HANDOFF_CURRENT.md), source `31b895e` passed [Android + real Chromium CI #41816102388](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/41816102388). The earlier new-test failure was fixed; do NOT reimplement initial port. Newer visual-only Wen branch also inspected at `f14f1d6e8ed3fb7629bfda7583f0b107f57ef4b8`.

**Primary repository:** `amroalhamedi2022-hue/Storylens`, branch `main`. Existing documentation: `AGENTS.md`, `docs/LINGUA_TALES_MASTER_PLAN.md`, `docs/LINGUA_TALES_LIVE_STATUS.md`, `docs/LITERATURE_SOURCE_QUEUE.md`, and `docs/releases/LINGUA_TALES_1_0_0_INITIAL_SIGNED_HANDOFF_2026-11-03.md`.

**Reference engine (read only):** `amroalhamedi2022-hue/Wen-sarafet`, `design/wen-full-unlocked-sandbox-20261101`, its `glass-engine/` Android Java library, `GlassMotion`, `WenNavigationLensDrawable`, `WenOpticalNavigationOverlay`, `WenLiquidRuntimeOptics`, `WenGlassBackdropDrawable`, `WenFabBubbleDrawable`, and `docs/design/wen-glass-design-tokens.json`. The newer `design/wen-188-visual-only-review-20261104` branch is a parallel visual review and must be checked for later advances before subsequent batches. **NEVER edit the financial app, financial logic, databases, encryption, SMS, or its protected Safe Zone** while porting visuals.

## A. Technical decision / طريقة النقل

Wen Sarafet renders **native Android Views/Canvas/AGSL**; Lingua Tales renders its interface in an **Android WebView**. Native Java drawables are NOT drop-in compatible with browser DOM. Port the source design system, refractive edge treatment, dynamic spring behaviour, motion curves and finite gesture lifecycle into an isolated **WebView CSS + JS engine**, then optionally investigate Android-native compositing where backed by measured real-device benefit. Honest terminology: the initial CSS treatment is an optical **approximation**, not the native AGSL shader or a verified identical copy of iOS.

**Reference parameters:** liquid follow factor **0.60**, release/viscosity settle **265 ms**, source overshoot approx **0.24**, bounded drag, one shared navigation lens, anti-aliased pearl rim, upper specular crown, tinted lower edge, layered depth, subtle tint without rainbow ghosting, stable resting state, no idle animation or recurring timers.

**Always preserve:** `com.storylens.reader`, signed 1.0.0 permanent public cert SHA-256 `3df6489eacea84e78b715943ca4d014abb24e3159641e0bf80890ecedcf9da31`, retained PRIVATE signing key stored outside public GitHub; the current 1.0 baseline `versionCode=100851`, all updates require **higher** versionCode and the identical signing certificate. Preserve existing stories, text, translations, backups, SRS words, preferences, bookmarks, chapter positions, app accessibility, art and audio. A successful source push is NOT itself a signed update.

## B. Glass surface rollout (design only)

| ID | Target | Visual treatment | Non-negotiable safeguard | Acceptance |
|---|---|---|---|---|
| GL01 | Reusable engine | `lt-wen-glass-engine.css/js`; palette from user themes; gesture-safe touch layer | Isolated opt-in CSS class; no application data or click replacements | Node + Chromium press/cancel tests |
| GL02 | Home title/header, menu icon | Compact pearl glass, upper highlight, curved edge, responsive layout | Existing scroll hide/show; RTL, no selectable menu icon | Phone/tablet screenshot + scroll |
| GL03 | Library search, genre chips/filter and nav | Single optical follower lens, 0.60 movement/265 ms settle | Correct native click semantics; hold-drag never double navigates | RTL/LTR click-count & gesture E2E |
| GL04 | Book covers and cards | Static frosted edges, real vintage cover artwork, light interaction | **NO per-card backdrop blur**, no modifying/cropping historic art | 40+ card scroll smoothness |
| GL05 | Side drawer/categories | Frosted shell, real tracking lens, cancel/Back, polished tap feedback | Focus trapping/inert; no taps behind drawer | Keyboard/Android Back / gesture |
| GL06 | Theme gallery/editor, settings dialogs | Layered glass over legible opaque controls | Long-hold theme customisation and colour input keep working | RTL/theme + keyboard E2E |
| GL07 | Reading toolbar, chapter selector, page controls | Lightweight optical glass controls **around** paper | **Never blur prose, bilingual sentences, dictionary tokens, original figures or curved page** | Reader text/selection/pagination & art tests |
| GL08 | Word lookup, SRS, bookmarks, progress, audio | Consistent glass on buttons/sheets, adequate contrast | Dictionary/backup/audio handlers never overridden | Offline dictionary + SRS + backup tests |
| GL09 | Floating controls, elastic hold/drag | Lens reacts to touch/hold/release without stutter | No scroll hijack, pointer capture leak or double events | Real 120Hz device gesture video |
| GL10 | Visual QA, adaptive degradation | Both light/dark/period-paper themes; reduced-motion/transparency; low-memory fallback | Accessibility text contrast/44px targets; energy/thermal budget | Screenshot diffs, Android GPU profiling |

**Reader exception:** Apply glass to surrounding *controls on every screen*, never to the paper/text/image reading surface. Never distort original coloured artwork or fake historical images. The visual engine must never rewrite story content or translate text.

## C. Phased execution, live acceptance

**Phase 1 — Isolated WebView port [IN PROGRESS: GL01/02/04/05/06/07].** Create shared CSS/JS assets; link them once; single delegated pointer manager; pointer cancel, lostpointercapture, blur/visibility release; press near touch position, static glass backgrounds and shared lens; no idle timers or native click interception. Pin exact Wen source commit. Add Node source/gesture contract, actual Chromium fixture `qa-wen-glass.html`, and Android APK asset-presence CI. Required evidence: actual newly pushed HEAD & run success. Do not call hardware verified.

**Phase 2 — Finite optical polish [OPEN].** Tune real visual thickness, adaptive backdrop/edge displacement, directional glint, actual hold viscosity and dock snap, spring overshoot, slow/fast gesture variants. Screenshot comparisons in Arabic/English light/dark and 460px/1280px. Verify the moving lens is drawn **above** its background and **below** labels; no blur or rectangular hitbox over text. QA for 1 finger, 2 fingers, cancelled capture and WebView Back. Do not claim native AGSL refraction unless implemented and demonstrated.

**Phase 3 — Reader and interaction fidelity [OPEN/PARTIAL].** True deformable held paper rather than strip/flat page-only illusion, preserved RTL/LTR reading edge and next/previous chapter, actual historical art in the associated passages, image double-tap and pinch, no text clipping, no repeated JS render loops, stable word selection. Keep page position and saved words through language/font/theme changes.

**Phase 4 — Content/editorial completion [OPEN].** Genuine complete historically sourced adult novels and Arabic heritage volumes, not AI-authored filler. The 37-chapter Verne bilingual work exists as source but remains editorial QA dependent; *The Hound of the Baskervilles* (15/15 EN) and *The Sign of the Four* (12/12 EN) are full-source staged **outside published APK**, missing complete natural Arabic counterparts, approved original scene-specific interior artwork and separate legal/editorial review. Full Arabic *Kalila wa Dimna* and *One Thousand and One Nights* editions + complete contextual English companion are still incomplete; check all rights by edition/translation/art and region before publication. Broaden genres: crime, mystery, historical, travel, psychology, classic sci-fi, gothic, Arabic literary heritage. Respect genuine book shape/title and real historical images **inside** the reading pages.

**Phase 5 — Accessibility/QA/performance [OPEN].** Actual Xiaomi Pad 5 + phone launch, reading, drawer/long hold, Arabic/English, rotation, 120Hz frame pacing (trace p50/p95/p99 and jank), battery/temperature, backup restore, audio focus, font choice, offline mode, large-text/reduced-motion/high-contrast, screenshot review. A CI browser test is not a real-device acceptance test.

**Phase 6 — Repeatable permanent signed UPDATE [PARTIAL].** Stable first signed app 1.0.0 was privately delivered and its signer public pin preserved. New source commits on `main`; signed APK must use the **same** private key from the user's private Library, versionCode **above 100851**, exact APK signer/SHA/apksigner verification, source/Node/Android/Chromium CI. GitHub encrypted Secrets/Release upload remain a separate deployment concern; never commit the private keystore or copy it to a public artifact. Keep an actual signed update APK and verification report accessible to the user.

## D. Completion scorecard (evidence, not optimistic percentage)

| Workstream | Current verified state | Remaining work | Release gate |
|---|---|---|---|
| Android production build | **v1.0.0 real signed APK** + successful old source CI in handoff; not installed on user's phone/tablet | Same-key update and on-device upgrade/backup verification | APK/device |
| Glass/UI | Multiple Lingua themes/touch animations already exist; new Wen cross-runtime glass port is current batch | True optical sampling, dock hold-drag navigation, pixel QA on device, safe theme preservation | GL01–GL10 |
| Readers/curl | RTL/bilingual paging and historical in-prose art for some approved chapters; visual curl partial | Physically convincing fold, multi-touch and real-device jank/paragraph fit | RD01/RD02 |
| Language/dictionary | Offline bilingual lookup, saved words/SRS, themed settings in source | Editorial contextual meaning coverage and round-trip backup QA | DICT01/LANG01 |
| Classic content | Partial published catalog; source-staged authentic Sherlock novels | Full translation, rights, historical illustrations, more genuine adult genres, human editing | C01–C05/UX04 |
| Audio & performance | Licensed audio assets and browser tests | Hardware focus/interrupt/offline/thermal/120Hz | AU01/PERF01 |
| QA | Latest checked source main `1586835f0b919989ba900b85bc28e44a81175f52` Android/Chromium Actions #41644054837 **SUCCESS**, prior to this port | New exact-head CI, screenshots, real device tests | QA01/QA02 |

## E. Hard safety rules and continuation

1. On each session check latest `main` HEAD, Actions, and parallel agents before code; inspect source and do not repeat a completed commit. Merge only CI-green source into `main` (user authorised) while keeping release/rights/hardware checks separate.
2. No edits to «وين صرفت» financial repo during this visual import; no Android DB/finance/activation/SMS code reuse. No changes to Lingua Tales saved data/storage, signers, bundle/package identity, source text, translations or copyrighted art in a visuals-only batch.
3. Each meaningful code commit updates `docs/LINGUA_TALES_LIVE_STATUS.md` and this living plan with actual DONE/IN PROGRESS/BLOCKED states; exact SHA and CI URL. Never claim success while Actions is pending. Provide device acceptance only after device testing.
4. Generate before/after screenshots and readable default UI. For scroll cards keep background blur **off** to protect 120Hz; shared lens and gradients only, no idle loop. Reduced-motion/transparency and keyboard screen readers are compulsory.
5. Preserve signer's private key and recovery password ONLY in private ownership; do not upload either to public GitHub. On next signed update fetch the same original signer, never create a new key. If the private key is not accessible, explain the blocker, do not silently sign with an incompatible one.

**Resume prompt:** “Continue Lingua Tales from `docs/LINGUA_TALES_WEN_LIQUID_GLASS_MASTER_PLAN_2026-11-04.md`. Compare current Storylens main and Wen-sarafet reference engine branches/Actions, implement the next unfinished GL ID in isolated WebView assets, update the plan + LIVE_STATUS in the same commit, run exact-HEAD CI and screenshot tests, and keep source/rights/device/signing gates honest.”
### Run log — 2026-11-04 GL01 corrective follow-up
- Implementation landed on Storylens `main` at `1c0e84fa4b128c40af391d5bdcbc8d927e11fead`; its CI #41815804696 failed in a **new Node fixture text assertion**, before running full Android/browser tests. The first corrector commit updates only the test's static acceptance fixture marker and fake-DOM keyboard query; production behaviour is unchanged. Next exact-head CI and screenshots determine whether the entire batch is accepted. **Do not label GL01 CI-green until actual Actions success.**

### 2026-11-04 verified checkpoint: first port accepted by CI, hardware acceptance still open

Initial engine port landed `1c0e84f`, corrected synthetic DOM test only in `31b895e`. [Exact-source Android/Chromium CI #41816102388](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/41816102388) **SUCCESS**. This covers source/Node/Chrome/APK asset verification and phone/tablet synthetic screenshots, NOT physical screen/gesture or signed APK update acceptance. GL01 code + CI PASS, GL02–GL08 initial surface coverage PARTIAL, GL09 held slide-navigation and physical viscosity PARTIAL/OPEN, GL10 hardware and 58-theme visual comparison OPEN. For correct next work read the CURRENT handoff link at top. No duplicate commits, no reset of permanent signer or protected reader data.

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


### 2026-11-04 — design/functionality-only tablet keyboard + multitouch glass safety (CI pending)
- Workstream separation: another conversation independently owns sourced original books, full natural translations and true historical cover/in-chapter imagery. This batch changes **NO** literature/staging/image/source rights, package/signature/data/backup/SRS files. Preserve existing signed update `100857` and private signer.
- RD02/QA: Paged reader adds focusable paper surface with RTL/LTR-aware physical `PageDown`/`PageUp` and arrow keyboard navigation for tablet/Bluetooth keyboard. It calls the existing `move(delta,'keyboard')` path to preserve chapter/page position and optional sound, without accidental exit at book end. Keyboard input is ignored from tokens, controls, dialogs, selected text and modifier combinations.
- GL09/GL10: Second contact cancels decorative lens to leave pinch/scroll/selection native; stale keyboard glass highlight clears on focus loss/blur; subtle paper focus ring, never changes ink/illustrations. Node regression covers directional binding, final-page guard, multitouch cancel and keyboard cleanup.
- SOURCE IN REVIEW on feature branch `design/reader-keyboard-glass-input-safety-20261104`; exact new-HEAD Actions and real tablet/phone hardware acceptance **PENDING**. Do not call a new signed APK produced. Next: verify PR exact-source Android+Chromium CI before merging to main, then real tablet RTL and keyboard tests.

### 2026-11-04 — PR #4 accepted and merged after exact source tests
- Source `c9ddb4e5abf8e48e65a1370fac0edc677229d2c8` passed [full PR Android/Node/Chromium CI #41823205151](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/41823205151) **SUCCESS**. [PR #4](https://github.com/amroalhamedi2022-hue/Storylens/pull/4) was merged on `main` at `2aad0607e5f76fcef01e34c7d2f961d6a5b5e349` (clean, expected head). This supersedes the prior “source in review” note.
- Post-merge exact `main` Actions [#41823932937](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/41823932937) **PENDING** at this documentation checkpoint; check real conclusion. Previous main content-merge run #41822409425 failed in Chromium Wen Glass browser fixture, and its attempted rerun was cancelled by new main workflow concurrency; do not call that old failure green or blame staged literary contents without a reproduced root cause.
- Tablet page keyboard navigation and two-finger decoration safety are **SOURCE + PR CI VERIFIED**; actual Xiaomi Pad 5, phone gesture/touch, FPS/thermal, 58-theme screenshots and future same-signer APK **NOT YET DEVICE/RELEASE VERIFIED**. Signed 100857 APK remains last real update. Content and historical artwork remain the separate stream.
