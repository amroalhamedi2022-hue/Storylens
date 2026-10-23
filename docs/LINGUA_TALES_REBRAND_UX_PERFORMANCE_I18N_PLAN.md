# Lingua Tales — approved rebrand, UX, performance and localization plan

**Added 2026-10-23 after user review of StoryLens Android screenshot.**
**Status: PLANNED ONLY — DO NOT CLAIM THESE CHANGES HAVE BEEN IMPLEMENTED OR TESTED.**
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
