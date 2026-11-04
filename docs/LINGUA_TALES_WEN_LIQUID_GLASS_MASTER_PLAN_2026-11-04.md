# Lingua Tales — Wen Liquid Glass Engine + Complete-Product Roadmap

**Living plan / الخطة الرئيسية للتنفيذ | 4 November 2026**

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
