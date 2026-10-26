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
