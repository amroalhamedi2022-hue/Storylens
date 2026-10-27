# Lingua Tales — approved rebrand, UX, performance and localization plan

**Added 2026-10-23 after user review of StoryLens Android screenshot.**
**Status: ACTIVE IMPLEMENTATION — per-gate evidence and unresolved acceptance are tracked in `docs/AUTONOMOUS_ACCEPTANCE.md`; do not infer completion from individual milestones.**
Source repository (unchanged for continuity): `amroalhamedi2022-hue/Storylens`.
Authoritative development base: inspect `main`, existing open PR #1 and its branch `automation/storylens-dictionary-saved-words-20261023` before modifying production code. Preserve prior dictionary and reader regression work.

## 0. Product naming and migration — LT-01
- New **user-visible brand / launcher name:** **Lingua Tales** (two words).
- Use **LinguaTales** (one word) in code-oriented identifiers or compact surfaces if needed. Either spelling represents the *same app*, not a second edition.
- Replace visible "StoryLens" labels, in-app brand text, settings, Android launcher label, notification/share/export titles, offline/help/about labels and any relevant accessibility strings with Lingua Tales. Keep old `Storylens` repository name unless a separately approved repository rename is later warranted.
- **Do NOT change `applicationId`/`namespace` (currently `com.storylens.reader`) merely to rebrand**: preserve installs, dictionary assets, progress, favorites, saved vocabulary, backup formats, preferences and upgrade continuity. Audit any web storage keys/Android identifiers before changing them. If user later specifically wants package-name migration, create a tested separate plan, not an accidental data-breaking re-install.
- Audit brand strings in both Arabic and English, not only homepage header. Use naming consistently (no mix of old and new branding).
- **Acceptance:** old installation updates in place; reading history, saved words, favorites, bookmarks and offline assets remain. No visible StoryLens user-facing string after migration (except deliberately retained legacy compatibility metadata).

## 1. Story opening AND closing animations — LT-02
- Implement elegant, **short and responsive** enter/exit transitions from selected story card to reader and back, visually harmonious with existing glossy Liquid/Nebula style: card-to-page continuity where reliable, subtle scale/translation/fade or shared-element illusion.
- Story close/back must animate on in-app back, Android system back (where interceptable), toolbar back and swipe/navigation where supported; gracefully complete/interrupt on repeated rapid taps and navigation.
- Preserve exact return scroll position, selected filters, story/chapter state, keyboard focus and reading progress. Avoid duplicate listeners and UI dead ends.
- Use composited `transform` + `opacity`, avoid animated `backdrop-filter`/expensive blur and layout thrashing. Never freeze taps during long transitions.
- Respect OS/browser `prefers-reduced-motion`: instant/minimal fade fallback; respect Android lifecycle interruptions.
- **Acceptance:** 20 repeated open/close cycles, rapid double back, direct story open, portrait/landscape, no stuck overlays / lost progress; screenshot and video evidence. Animations implemented but benchmarked so they do not worsen performance.

## 2. Improve performance **without sacrificing visual quality** — LT-03 (high priority)
- First **measure** current launch, story-open, story-close, scroll FPS/frame times, memory and loading on the user's Android target (Xiaomi Pad 5 primarily), with repeatable scenario. Never invent FPS/CPU measurements from desktop emulation.
- Identify real bottlenecks: stacking large `backdrop-filter`/shadows, full-screen gradient repaints, animated large orbs, oversized background images, synchronous render/search/filter operations, DOM re-creation, excessive listeners/observers, large offline corpus startup parsing, image decode, localStorage synchronous writes. Profile and fix causes; do not simply hide attractive design elements.
- Preserve the approved sophisticated purple/pink/cyan liquid-glass design, depth, gradients, legibility and story illustrations. Prefer precomposed cached visuals/optimized CSS layers, static glass regions, composited lightweight transitions, adaptive reduced-effects fallback only when hardware needs it, virtual/lazy story cards/images, efficient search, smart caching and debounced persistence.
- No accidental change to original story content, translations or accessibility. Android remains **offline-first** and no new INTERNET/microphone/audio permission.
- **Acceptance:** current-vs-improved measurements on same device/scenario; noticeable reduction in jank/stalls and responsive taps with no severe visual regression, screenshots side-by-side; baseline and actual numbers in acceptance ledger. Avoid specifying fabricated performance wins or guaranteeing 60fps without device evidence.

## 3. Distinctive modern adaptive app icon — LT-04
- Redesign launcher icon to the same **quality direction** as the previously approved user's `Wen Sarafet` icon (modern glossy/liquid-gradient aesthetic), **not** a clone or shared source asset. Icon must clearly represent learning through illustrated stories/language: e.g. an open book/page motif transformed into two speech bubbles / lexical spark, restrained gradient and high-contrast silhouette.
- Ask automation to retrieve the authorized existing Wen Sarafet icon asset from a connected source only if accessible; otherwise follow the direction above and record missing precise reference. **Never modify the Wen Sarafet repository.**
- Provide a fully compatible Android adaptive foreground/background and monochrome/themed icon if project structure supports it, not merely an image embedded in a screenshot. Test launcher circle/squircle/round mask, small sizes, light/dark wallpaper, no clipped logo.
- **Acceptance:** icon resources included in real APK at all required densities or vector/adaptive formats; visual comparison to approved direction and real Android launcher screenshot. Do not use external copyrighted brand marks or leak private graphics.

## 4. De-clutter screen, reduce metadata/marketing copy — LT-05
- User screenshot documents current homepage: oversized intro + repeated brand/hero lines; long subtitle; `36 STORIES`, `6 GENRES`, `100% OFFLINE` pills; verbose library counts, genre/filter row, metadata and blur-heavy card shells. **These are targets for information hierarchy cleanup**, not a mandate to strip functionality.
- Keep the strong hero/liquid art but make the **content/story library** the protagonist: reduce header height and redundant text, shorten the hero subtitle to at most one optional clear line or omit it, remove redundant marketing counters and duplicate descriptions, compact category/filter controls and sort/search bars.
- On story cards prioritize **cover, title, level, one concise hook, continue/progress**, accessible bookmark affordance. Put secondary details in expandable details rather than showing generic repeated explanation everywhere. Prefer meaningful content over repeated "36 stories / 6 genres" and stock microcopy.
- Fix narrow/mobile layout clipping and excessive vertical whitespace, maintain beautiful touch targets and readable contrast. The screenshot shows Android text-selection toolbar overlay at top; do not style or attempt to remove system-owned text-selection UI in general; optionally suppress accidental selection of non-content decorative marketing text without breaking selection/copy in the story reader.
- Ensure essentials (dictionary access, saved vocabulary, review schedule, backup, language switch, search, offline status) stay discoverable and functional, even if their labels become shorter.
- **Acceptance:** compare before/after Android phone and tablet home screenshots; content above fold, no clipped filters/buttons, no lost navigation/action, fewer redundant lines, RTL/LTR legibility.

## 5. Full Arabic/English **app interface** toggle — LT-06
- Add a visible **Language / اللغة** setting with `العربية` and `English`. Switch every user-facing **app UI string**: home/hero/buttons, search/filter/sort, library/counts/plurals, tabs, story controls, dialog/toast/errors/empty states, dictionary sheet UI, flashcards/SRS/review, preferences, backup/restore, permission and help/about, accessibility labels and Android-side UI when applicable.
- Store the selected locale offline/persistently and restore it reliably on cold start, navigation, process restart and app upgrade. Optionally default based on device language on first run, but always allow user override.
- Arabic UI: correct RTL layout, alignment, Arabic plural/count handling and bidi. English UI: LTR layout and natural English labels; handle embedded English words, titles, numbers and Arabic translations with isolated text direction where needed. Language switching must not reinitialize story state.
- **Critical separation:** English source story remains English regardless of app UI locale. The existing Arabic translation of sentences, paragraphs and vocabulary must **remain Arabic even when interface language is English**, as user explicitly requested; do not translate learning content to English or make Arabic translation disappear. Keep contextual gloss logic intact.
- Use one maintainable localization catalog/layer rather than brittle global string replacements. Audit full UI for hardcoded strings and add automated completeness/no-missing-key tests, RTL screenshot regression and both-language navigation tests.
- **Acceptance:** exercise every major screen/action/errors under both languages, offline, after app restart; validate reader English + Arabic meaning still correct under English UI, and reading progress untouched.

## Prioritization and development workflow
1. Preserve existing PR #1 dictionary/navigation work; re-fetch current code and latest PR/CI before each implementation. Begin LT-03 measured baseline and LT-02 navigation transitions (performance-sensitive), then LT-05 de-cluttering, LT-06 full localization, LT-01 branding and LT-04 icon, or reorganize dependencies only with a recorded rationale. Make actual changes only during **future autonomous development runs** as requested, not in this plan-writing run.
2. Execute bounded production changes + meaningful tests on a StoryLens-only branch and open/update a StoryLens PR; preserve established data and existing source. No main direct writes, no unrelated projects, no auto merge, no paid API.
3. Maintain `docs/AUTONOMOUS_ACCEPTANCE.md` with **LT-01 through LT-06 all NOT TESTED until proven**, exact source SHA, tested CI run, actual APK and (when possible) device evidence. Do not claim success from a design mockup or desktop simulation.
4. Keep existing dictionary/context/idiom/story quality/SRS/offline requirements first-class. Rebrand/UX changes cannot regress lexical and translation functionality. Do not introduce audio/microphone.
5. After all previous and new user requirements are met, perform independent second-pass recheck with app install/upgrade, full Arabic + English user journey, reader transitions, performance measurements, real Android icon and screens, 100% offline operation, backup/recovery, accessibility and negative tests. Mark unresolved cases NOT TESTED or BLOCKED.

**Evidence reference:** user-shared Android screenshot from 2026-10-23, 16:08, showing existing Nebula Flow home, selection controls, oversized hero and story cards. Screenshot itself is a user-provided reference, **not a committed project asset**.



---

# Additional approved roadmap — 2026-10-23 (LT-07 to LT-13)
**MANAGEMENT UPDATE ONLY.** No source, app assets, UI, sound packs, stories or image resources are modified by adding this section. These items supersede older prohibitions or targets if conflicting. Keep all prior LT-01..06 gates.

## LT-07 — Genuine medium-to-long literature in continuing batches
- Prioritize engaging **authentic literary works** of medium-to-long length, including classics such as Jules Verne's *Around the World in Eighty Days* with Phileas Fogg and Passepartout. Keep correct authorship, original plot/characters and faithful chapter structure. Original full English editions may be public domain in many jurisdictions, but **copyright must be verified for each exact English translation/edition and territory**; never assume modern translations/illustrations are public domain.
- Original public-domain books, other appropriately licensed real stories and clearly labeled original commissioned stories can coexist; do not claim invented stories are historic/public-domain fiction.
- Expand the catalog in **reviewable batches** at every suitable content-delivery milestone, rather than promising fabricated quotas each hourly run. Each approved batch includes meaningful chapters, consistent original source URL + license/provenance, English full text, high-quality natural Arabic sentence/chapter translation, CEFR level, vocabulary/idiom annotations, QA and image placement. Avoid filler/AI-generated repetitive plots.
- Preserve existing 120-story target as a **minimum editorial catalog ambition**, while tracking how many actually pass editorial and coverage QA; genuine longer books may count as one work with many chapters, not artificially inflated story totals. Reading progress and resume must work by work and chapter.

## LT-08 — Context-aware inline storytelling imagery
- Covers are not enough: support optional *inline* illustrations between paragraphs, aligned to corners/edges, slim full-width panoramic strips and text-integrated vignettes. Placement should be editorially sensible; the user should read fluidly without arbitrary image interruptions.
- Define per-image metadata (scene/chapter/paragraph anchor, source attribution/license, aspect ratio, focal point, crop rules, alt text, light/dark theme, optional position/opacity). Prefer natural compositions, soft feather/gradient boundaries into the page and restrained text wrap without overlapping glyphs. Never crop faces or salient objects awkwardly, stretch into thin strips or impair readability.
- Source search: use legally reusable historical/public-domain illustrations or properly licensed web images *verified per asset*; if none fits and **image generation is actually available free under current tools**, generate bespoke visuals matching characters, era, scene, story context and coherent per-book art direction; otherwise leave an explicitly tracked placeholder, not an invented image or an unlicensed hotlink. Do not treat web search image results as reuse permission.
- Offline-available local images, optimize texture memory/decode size and lazy-load/cached scale appropriate to viewport; app install size may be large **but scroll performance, frame stability, RAM and battery cannot suffer**. No background network requirement.
- QA: editor checks meaningful alignment across Arabic/English UI, portrait/tablet, different reader fonts and font sizes, image focal points, accessibility alt descriptions, loading and chapter resumes.

## LT-09 — Clean home navigation with locale-aware drawer and edge swipe
- Simplify the home: remove excessive accordions, promo labels, redundant widgets and on-page category chips. Move categories/genres to a **single drawer/menu toggle**: **top-right for Arabic UI**, **top-left for English UI**, with correct RTL/LTR semantics.
- Open the same menu via **edge swipe from the corresponding right edge in Arabic or left edge in English**; close using reciprocal swipe, outside tap, explicit close and Android system back. Avoid hijacking horizontal gestures inside reader/content/images, and provide touch-accessible buttons and TalkBack focus handling.
- Keep search, progress, library browsing, learning features and navigation discoverable even as the homepage becomes content-first. No accidental selected-text controls or cut-off panels.
- Test LTR/RTL, back-stack, screen rotation, slow/fast swipes, drawer scroll and interactions without keyboard or pointer.

## LT-10 — Themes and appearance belong under Settings
- Consolidate theme, typography, animation/reduced motion and audio controls in a clear **Settings / الإعدادات** screen. Avoid multiple prominent home theme controls or redundant navigation.
- Theme switching must be instant enough, persist offline, preserve reading location and pass accessibility contrast checks. Core reading modes may retain accessible quick controls only when genuinely useful and unobtrusive.

## LT-11 — User-requested optional UI sounds, music and ambient environments
- This **explicitly supersedes** prior blanket "no audio features" restriction. **Still no microphone, speech recording, TTS, voice input or speech permissions.** Playback-only sound is now approved.
- Offer **separate switches and volume sliders** for UI feedback SFX and background audio, plus track/category selection, play/pause and disable-all. Default to nonintrusive/silent until opted in; respect system silent mode/audio focus, phone interruptions, screen off and app lifecycle.
- Build an **approximately 20-item background sound/music catalog**: low-key instrumental melodies, soft piano/ambient, rain, rain with distant thunder, forest, forest with birds/animals, nocturnal nature, cozy interiors etc., with non-fatiguing volume and gapless/loop-appropriate masters when feasible. Distinguish music from looping atmospheres and allow ambient-only playback; no auto-play on launch.
- Research and document sources (file URL, explicit license, attribution, modification/redistribution permission, checksum, duration, bitrate and expected size); **CC0, genuine public-domain or compatible license preferred**, excluding copyrighted commercial audio and misleading royalty-free claims. Original composition is acceptable when genuinely deliverable within free resources.
- Compress/stream from local assets carefully, predecode only when needed, load one active stream, never keep ~20 tracks simultaneously decoded in RAM, avoid frame-rate drops or high standby battery drain. App file size is allowed to be larger, **runtime smoothness is nonnegotiable**.
- Test app running while music plays, transitions, background/foreground, Android audio focus, user accessibility, full offline mode and low-end hardware. Avoid unnecessary Android permissions.

## LT-12 — Independent Arabic + English typography options
- Add readable, curated licensed fonts selected independently for Arabic interface/translation and English interface/story text; store preferences offline.
- Respect separate weight/line-height/letter-spacing profiles, responsive paragraphs, Arabic shaping and mixed-script direction isolation. Users can adjust sizes and spacing without clipping/cut lines or disrupting image crop.
- Don't embed downloaded font files into handoff documents; bundle only properly licensed font assets inside the app build if needed.

## LT-13 — **A genuinely new visual theme at every suitable development/content batch**
- User priority: **each successive substantial development/content batch introduces one distinct, fully usable, polished theme** in the Settings theme gallery. Not merely a different accent color or renamed duplicate. Track the delivered theme's unique **palette, color contrasts, layout language, geometry, decorative illustrations/textures, typography treatment, reading-surface styling, cards/nav controls and animations**, while preserving identical user features and accessibility.
- Keep the existing **Nebula Flow** theme as a baseline. Suggested clearly different progression (names are placeholders): **Paper Atlas** (warm editorial parchment/map geometry), **Midnight Library** (ink/navy/bronze shelves), **Rain Glass** (cool desaturated slate/aqua rainy panes), **Forest Folio** (green/sand organic botanical composition), **Sunset Journey** (terracotta/copper/cream vintage-travel), **Aurora Notes** (blue/lilac quiet luminous), etc. Creative differences must be visible in arrangement and atmosphere, not just hues; do not promise that all these exist before they are coded.
- Each theme has theme tokens/components rather than full duplicated DOM/UI logic or permanently running particle systems. **Large APK is acceptable; heavy runtime is NOT**: avoid expensive animated full-screen blur, excess SVG filters, duplicated background canvases, eager image decodes, extra music preloading and repeated listeners. Cache static artwork and provide low-cost fallback without dulling the core design.
- A theme is **delivered only with actual production code + tests + screenshots on the target device**. If a scheduled run is too small, continue that batch until it genuinely ships; do not claim a new theme every hour without a finished implementation.
- Persist selected theme and verify all major pages (home/library/reader/word sheet/SRS/settings/backup) in **Arabic and English**, font changes, long stories with inline images, UI animations, offline, contrast, reduced motion, low RAM and Android rotation.
- Every batch log names its new theme, distinctive design elements, measured performance impact, test/CI SHA, remaining issues, and whether it is only proposed or actually added. Use only freely usable assets; do not include content with missing rights.

## Updated order and non-negotiables
1. Preserve existing behavior; baseline performance and navigation, start LT-09/LT-10 and LT-03 with measurements.
2. Implement LT-06/LT-12 and LT-02, then long-story content LT-07 and inline art LT-08 in continuous reviewed batches.
3. Implement optional LT-11 audio using licensed *playback-only* assets, persist controls and avoid memory overhead.
4. LT-13 is **ongoing**, not a one-off final task: every substantive batch should aim for a *new visually distinct functional theme*, with gating by real implementation/test evidence.
5. Complete LT-01/LT-04 rebrand/icon without breaking existing Android app identity or saved data. Cross-check all old features; finish with independent device acceptance and separate recheck.
6. No paid API, no extra expense, no auto-merge or publishing user-private assets. Asset download/generation is conditional on availability and license; never fabricate its completion.


## 2026-10-26 — Long-book continuation checkpoint

Chapter XXII (Yokohama) is now integrated and has passed its targeted Node regression, Android asset packaging/required-file inspection, Chromium reader checks in Arabic and English, and independent APK SHA-256 verification. The previous run exposed a stale Chapter XXI fixture that still treated XXI as the last available chapter; that test now correctly expects navigation to XXII, while XXII is the current last bundled chapter.

- **Verified CI:** [Run 40338750217](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40338750217), head `1f40c4978cfc21ec5ddce1bffb450d057845fcf9`, all steps PASS.
- **Debug APK:** 4,587,889 bytes; SHA-256 `dcba12d3545c5736b27d68d672d284c3d5d38f1bfec674c3f91e39d8b2253f6d`; artifact 12658901284.
- **Chromium evidence:** [Screenshot artifact 12658451869](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40338750217/artifacts/12658451869), including Chapter XXI normal-navigation and Chapter XXII terminal-state screenshots in Arabic and English.
- **Scope:** 22/37 chapters bundled. The Yokohama Lantern theme is implemented and packaged, but LT-13 remains **IN PROGRESS** under the plan's stricter criterion until real-device screenshots, accessibility/contrast and runtime performance are checked on Xiaomi Pad 5. Arabic literary proofreading and territory-specific redistribution rights remain **NOT TESTED**. Debug is not final.


## 2026-10-26 — Chapter XXIV + bilingual reader-progress acceptance

- **PASS — source integration:** the bundled novel now contains Chapters I–XXIV (24/37). Chapter XXIII contains 53 aligned English/Arabic paragraphs, 1,933 English words, 35 source-occurring vocabulary/idiom entries and the distinct offline **Paper Lantern Circus** illustration/theme. Chapter XXIV contains 36 aligned English/Arabic paragraphs, 1,955 English words, 38 source-occurring entries and the distinct offline **Pacific Meridian** illustration/theme.
- **PASS — independent source comparison:** after stripping XHTML markup/entities and normalizing whitespace/typographic quote forms, all 53/53 Chapter XXIII narrative paragraphs and 36/36 Chapter XXIV narrative paragraphs match the recorded Standard Ebooks Towle sources. Corrected the Chapter XXIII `etc. ,` punctuation drift to the source's `etc.,`; added a regression assertion.
- **PASS — LT-06 reader-label subgate:** the reader progress label now localizes to `الفصل N من 37` in Arabic and `N of 37` in English. The English story title and locale-specific progress are isolated with `<bdi>` and explicit direction. Chromium fixtures explicitly exercise Arabic `lang=ar/dir=rtl` and English `lang=en/dir=ltr`, including chapter progress, mixed-script label isolation and the full reader/word-sheet/bookmark/translation/theme journey.
- **PASS — purposeful CI/build:** [run 40354034944](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40354034944), source SHA `a276604507c6cf9b36666f056585403a0a43c2ad`. Content/Node regressions, Gradle unit tests/build, APK required-asset inspection, Chromium Chapters XIV–XXIV in Arabic and English, and the complete functional browser journey passed.
- **PASS — independently recomputed APK SHA-256:** Debug APK is 4,621,341 bytes; SHA-256 `2b6ef7d0b8b323c56f0fca372fb5cf3f6abc7f787cfed22288d8566469771dcb`, matching `APK_SHA256.txt`. [APK artifact 12664738273](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40354034944/artifacts/12664738273). [Chromium screenshot artifact 12665236971](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40354034944/artifacts/12665236971) includes Arabic/English captures for Chapters XXII–XXIV.
- **Historical FAILs, superseded by this passing run:** intermediate runs exposed stale progress expectations and English-only expectations in Arabic fixtures; the production label, explicit locale setup, bidi checks and E2E assertions were corrected. Do not count those intermediate failures as acceptance; run 40354034944 is the verified result for this source SHA.
- **NOT TESTED:** installation/upgrade and actual touch/RTL/TalkBack/contrast on Xiaomi Pad 5; device frame pacing/RAM/thermal; independent Arabic literary proofreading; territory-specific redistribution clearance. Chromium captures are not device captures. The novel is still incomplete at 24/37; LT-01..LT-13 and LT-13 device acceptance remain **IN PROGRESS**. Debug is not final.


## 2026-10-26 — Chapter XXV continuation batch

- Added the complete Standard Ebooks/Towle Chapter XXV source text for San Francisco (50 aligned passages; 2011 English words), 50 Arabic translation drafts, 38 source-bound lexical entries, original offline civic-waterfront SVG, and **Civic Panorama** as a visually distinct selectable theme.
- Chapter XXIV now navigates forward; Chapter XXV is marked 25/37, not as the end of the novel. Arabic/English browser fixtures verify reader progress and mixed-direction labels.
- Purposeful CI/build is required for asset packaging and browser integration. Xiaomi Pad 5 runtime, accessibility, performance, independent Arabic proofreading and territory-specific rights remain open acceptance gates.


### 2026-10-26 — Chapter XXV integration verified

- **PASS:** [Android CI run 40363830394](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40363830394) on `aeec188d7401ea3781d92ad313a0b7791b2f7806`; Node/content tests, Gradle build, asset packaging and Arabic/English Chromium Chapter XXIV–XXV journeys passed.
- **PASS:** independently verified Debug APK `6754bae4af6f9284b1336e47e0795899c1c5b5cd8cf92482b14e6c2efdc3c1b1` (4,638,069 bytes), artifact 12669048661.
- **PASS:** all 50/50 English Chapter XXV paragraphs match the recorded Standard Ebooks XHTML after normalization; 2,011 words, 50 aligned Arabic draft passages and 38 source-occurring terms.
- **NOT TESTED:** Xiaomi Pad 5 runtime/accessibility/performance, independent Arabic proofreading and territory-specific redistribution clearance. Continue to Chapter XXVI; 25/37 chapters are bundled.


## 2026-10-26 — Chapter XXVI / Prairie Signal continuation batch

- Added the source-transcribed Standard Ebooks/Towle Chapter XXVI (25 aligned English paragraphs, 1,605 English words), 25 Arabic translation drafts and 36 source-bound dictionary/phrase entries.
- Added original offline Sierra Nevada steam-train/buffalo SVG artwork and the visually distinct Prairie Signal theme, with gallery swatch, backup allowlist and reduced-motion fallback.
- Chapter XXV now advances to XXVI; the serial reader remains honestly incomplete at 26/37. English source is pinned to Standard Ebooks repository tree 56c82e97ff5d4f8950afca05b71af72688a8da34 and chapter blob SHA d81f9235390ec9dac8c7e27ed08ba76ecf55a709.
- **PASS CI/build:** [run 40371715604](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40371715604) on source/test SHA 942bf86e4ac0c9727f54aa5d1e136336f83eddb4; content/Node regressions, Gradle tests/build, APK asset verification and Arabic/English Chromium Chapter XXV–XXVI journeys passed.
- **PASS independent APK SHA-256:** 8c41d05ea0239c11ecb948872e68002ac6a5219439db4c613c637bf9bb543709 (4,653,761 bytes), artifact 12671654499. Bilingual progress label and separate available-chapter note have computed-style and placement assertions.
- **NOT TESTED:** Xiaomi Pad 5 install/upgrade, actual touch gestures, real-device RTL/TalkBack/contrast, frame pacing/RAM/thermal, independent Arabic literary proofreading and territory-specific redistribution clearance. Chapter XXVI brings the bundled novel to 26/37; LT-01..LT-13 remain IN PROGRESS.


## 2026-10-26 — Chapter XXVII continuation batch
- Added the complete Standard Ebooks/Towle Chapter XXVII source text: 25 aligned English/Arabic-draft passages, 1,952 normalized English words and 38 source-occurring vocabulary/phrase cards.
- Added an original offline SVG of the train beside the Great Salt Lake and a visually distinct **Salt Lake Dispatch** theme with Settings-gallery, persistence and backup-whitelist wiring.
- Updated chapter order, truthful progress, Arabic/English Chromium fixtures and required APK asset/test gates. The build is purposeful because source-only checks cannot prove Android packaging or reader rendering.
- Arabic independent proofreading, territory-specific redistribution rights, Xiaomi Pad 5 interaction/accessibility/performance and final signing remain separate acceptance gates.


## Progress update — 2026-10-27 (LT-07 / LT-08 / LT-13 batch)

- The public-domain Towle sequence now has **29 of 37 chapters** packaged, including Chapter XXIX with full English source, aligned Arabic draft, 42 contextual glossary surfaces, a local SVG scene and the distinct Plum Creek Signal theme.
- Chapter navigation and the available-content boundary are updated; new Node and Chromium acceptance checks are wired into CI.
- This does not close LT-07/LT-08: eight chapters remain, the Arabic draft needs independent review, and territory-specific rights checks remain open.
- LT-13 remains open until the complete visual system and performance/accessibility are independently checked on Xiaomi Pad 5. Microphone/TTS remain excluded.


## 2026-10-27 — LT-07 / LT-08 / LT-13 functional batch: Chapter XXX

- Added the complete Towle Chapter XXX source from the pinned Standard Ebooks edition: 67 body paragraphs, 2,133 English words, normalized-text SHA-256 `cc6571f506f550e03e3627476ae0c534bb9fc7cb8d179ed08809ba3e6c5575ef`, source commit `56c82e97ff5d4f8950afca05b71af72688a8da34`, blob `d26e028ef931fea90caa1a625b91ca8f4310f244`.
- Added 67 paragraph-aligned Arabic draft translations and 41 source-bound contextual glossary entries, including the anatomical term `groin → الأربية`. Arabic prose remains an unreviewed draft; independent literary review is still required.
- Added an original offline SVG scene for Fort Kearney in the snow and the visually distinct **Snowbound Telegraph** theme. Registered the theme in the picker, CSS, reduced-motion contract and backup/import allowlist.
- Updated browser fixtures so Chapter XXIX enables Chapter XXX, Chapter XXX honestly keeps Chapter XXXI unavailable, and screenshot fixtures close the settings sheet after toggling translations. A separate RTL theme fixture checks the new reader border and screenshot.
- CI Run 40419513853: **PASS** — chapter/source hash test, glossary checks, theme catalog, Android Debug assembly, packaged-asset verification, Chromium RTL/LTR chapter journeys and Snowbound Telegraph visual check.
- Debug APK: 4,730,537 bytes; SHA-256 `23ade4fe075f47bb374640920705b0b50b700cd2915386e6d5496e19ff7e3634`; Artifact 12696587055.
- Content progress: 30/37 chapters (about 81% of this novel only; not the app completion percentage). Physical Xiaomi Pad 5 performance, touch/RTL/TalkBack acceptance and independent Arabic review remain **NOT TESTED**. LT-11's request for a curated library of ~20 externally licensed recordings remains open; procedural melodies do not satisfy that license requirement.


## 2026-10-27 — LT-11 stale-resume lifecycle regression

- **Finding:** if the document became hidden while `AudioContext.resume()` was pending, the visibility pause could run before the context reached `running`; the late resume was prevented from creating sound, but could leave the context running silently.
- **Change:** a stale/hidden play request now re-suspends a late-running context when no newer playback is active. The regression fixture explicitly delays `resume()` and asserts the context returns to `suspended` after the visibility pause.
- **PASS — CI/source/build/browser:** [run 40427307659](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40427307659), source SHA `bd16885cabe8490a7eb60129d253301710e768f7`. Node tests, Android Debug assembly, required offline-asset/adaptive-icon packaging, Chromium reader journey and screenshot upload all passed.
- **PASS — APK integrity:** Debug APK 4,746,929 bytes; SHA-256 `8fa1a7145080e8e453ebb24054fb9963f6cf94a7075f73021f359b4ddb9b657d`. Recomputed independently from the downloaded artifact and matched `APK_SHA256.txt`. [APK artifact 12699928561](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40427307659/artifacts/12699928561); [browser evidence 12700058460](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40427307659/artifacts/12700058460).
- **NOT TESTED:** real Android audio focus, screen-off behavior, Xiaomi Pad 5 sound quality, battery use, frame pacing, TalkBack and device installation. Synthesized previews still do not satisfy the separately required curated ~20 licensed recordings/music library. No microphone/TTS.


## 2026-10-27 — Chapter XXXII–XXXIII browser-acceptance repair

- **Root cause:** the catalog grew from 31 to 33 available chapters, but the generated browser fixtures still expected a 31-chapter catalog and described Chapter XXXI as the terminal chapter. The failure was a stale acceptance fixture, not a Gradle or content-packaging failure.
- **Fix:** synchronized the generated catalog/availability assertions with the current 33 chapters; Chapter XXVI's Arabic navigation assertion now reports the correct expectation; Chapter XXXI is tested as a normal chapter with Chapter XXXII enabled; added Arabic and English Chromium journeys for Chapters XXXII and XXXIII plus an RTL **Atlantic Passage** theme fixture.
- **Content progress:** 33/37 Towle chapters are now packaged. Chapter XXXII remains bundled in the Chapter XXXI loader asset; its 50 aligned translation drafts are verified. Chapter XXXIII has 67 source paragraphs / 2,482 English words and 67 Arabic draft companions. Normalized English SHA-256: `baebea11a8d79e4458973a88d541efe432a4f1723718ce6cd4d53234601db441`.
- **PASS — CI/build/browser:** [run 40440113181](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40440113181), tested source/test head `22954f9b12f0db21d442ac0eaff88790fa1a3189`. Node/content checks, Gradle tests and Debug APK assembly, packaged offline asset checks, Chromium Arabic/English journeys through Chapters XXXII–XXXIII, Atlantic Passage styling and the full reader/word-sheet/bookmark/translation/theme journey passed.
- **PASS — APK integrity:** Debug APK 4,776,817 bytes; SHA-256 `bf03553a8ed36d5a4e2a22098bfaf12784ea46972ac910e2a60e0ab754b86b59`, independently recalculated from Artifact `12705158884` and matched `APK_SHA256.txt`. [Artifact](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40440113181/artifacts/12705158884).
- **PASS — visual evidence:** [Chromium screenshot artifact 12704999038](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40440113181/artifacts/12704999038) contains 44 UI screenshots, including Chapter XXXII–XXXIII Arabic/English and Atlantic Passage.
- **NOT TESTED:** Xiaomi Pad 5 install/upgrade and touch behavior, physical RTL/TalkBack/contrast, frame pacing/RAM/thermal, independent Arabic literary review, and territory-specific redistribution clearance. The Debug APK is not a final release. LT-11's curated externally licensed ~20-recording library remains open; procedural melodies do not satisfy that requirement.


## 2026-10-27 — Chapter XXXIV functional milestone (CI PASS; device NOT TESTED)

- Serial novel progress: **34/37 chapters available** (chapter-count progress only, not whole-app completion).
- Chapter XXXIV is pinned to Standard Ebooks/Towle source blob `d78ec1d3014c2bb027c60645be33e0c0331ea7d3`; 22 narrative paragraphs / 972 English words, 22 aligned Arabic draft paragraphs, 20 contextual glossary entries, normalized English SHA-256 `b99d773a896ea121836a443ffc1290e67041718ccbb59f5341a19bc78246e6d9`.
- New original SVG scene and distinct **The Last Five Minutes** theme registered in selection, CSS, reduced-motion and backup validation.
- **PASS — CI Run 40446487903:** Chapter XXXIV Arabic/English Chromium journeys, new theme styling, 53-theme catalog, offline asset packaging and Debug APK build. Debug APK SHA-256 `d364e29aea175f2dbcd29885efd5878c203bdf3b8498ed266c76bf2245f09472`.
- Open gates: three remaining novel chapters; independent Arabic literary review; regional rights review; curated licensed audio; Xiaomi Pad 5 smoothness, RAM/thermal, TalkBack, and physical RTL/contrast. Do not mark LT-01..LT-13 complete from this chapter-only milestone.


## 2026-10-27 — Chapter XXXV + Westminster Vows (CI PASS; physical device NOT TESTED)

- Serial literature milestone: **35/37 chapters available**. Chapter XXXV adds **52 English narrative paragraphs / 1,573 words**, 52 aligned Arabic draft paragraphs, and 30 contextual word/phrase/idiom entries. The normalized English SHA-256 is `3746f6d1389e415cec8a093d32fa5bf7e0feca5970ccad59f69bfbb50943820a`.
- Pinned source: Standard Ebooks Towle transcription, `src/epub/text/chapter-35.xhtml`; upstream commit `56c82e97ff5d4f8950afca05b71af72688a8da34`, source blob `8a39e6eaa78e1c14cca130353697f307f55e48d0`.
- Added an original offline Westminster-clock / paired-rings SVG and the distinct **Westminster Vows** theme. The theme is registered in the selector, loaded from its own stylesheet, supports reduced-motion, and is accepted by backup validation. Chapter XXXIV navigation now leads to XXXV; XXXV remains the honest current endpoint with XXXVI–XXXVII unavailable.
- **Purposeful build question:** do the new chapter, artwork wrapper and separate theme stylesheet survive APK asset packaging, and do the Arabic/English reader plus theme DOM journeys pass together? Source checks alone cannot establish that the files are packaged or that the rendered RTL/LTR theme works.
- **PASS — CI Run 40448838238** on source commit `4bf6aa47be20ef4c1a95dcf6026eccb3d1fb6be0`: curated content/theme tests, Chapter XXXV hash/glossary/alignment test, Android Debug APK build and asset verification, browser fixtures for Chapters XXVI–XXXV, Chapter XXXV Arabic/English, Westminster Vows, and the full reader/word-sheet/bookmark/translation/theme journey.
- **PASS — independently re-hashed Debug APK:** 4,802,164 bytes; SHA-256 `63a59994a24ab43366936f755f25e1d05b02858e0e41631557fb41a0021ba3c3`; matches `APK_SHA256.txt` from Artifact **12709542775**. Screenshot evidence: Artifact **12709138752**.
- CI: https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40448838238
- APK Artifact: https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40448838238/artifacts/12709542775
- Browser screenshots: https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40448838238/artifacts/12709138752
- **NOT TESTED:** physical Xiaomi Pad 5 install/touch, frame pacing/RAM/thermal, TalkBack and physical RTL/contrast, independent Arabic literary review, and territory-specific redistribution clearance. The curated externally licensed ~20-recording audio library remains open; procedural melodies do not satisfy it. This is a Debug test build, not a final release, and the milestone does not mark LT-01..LT-13 complete.


## 2026-10-27 — Functional milestone: Chapter XXXVI + Reform Club Countdown

- LT-07/LT-08/LT-13 source milestone implemented: authentic Towle Chapter XXXVI, 30 bilingual paragraph pairs (Arabic draft), 26 contextual glossary entries, offline SVG illustration, and a separate high-contrast clock/ticker theme.
- The production catalog, theme selector, backup allowlist, Android asset verifier, source regression and Chromium RTL/LTR/theme fixtures are wired to the new chapter.
- The serial is **36/37 chapters available**; Chapter XXXVII and all remaining LT-01..LT-13 acceptance work are still open. Do not mark the product complete based on this content milestone.
- **Build purpose:** verify Android packaging and rendered bilingual/theme navigation after the new source/assets and updated chapter boundary. CI is pending; physical-device acceptance remains NOT TESTED.
