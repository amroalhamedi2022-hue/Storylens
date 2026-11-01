# Lingua Tales — LIVE STATUS / آخر المنجز والمتبقي

Checkpoint: 2026-11-01. Read MASTER PLAN for immutable scope and IDs; this file MUST be updated in every meaningful code/content commit and reconciled with current HEAD/CI. Work on PR #1 branch automation/storylens-dictionary-saved-words-20261023, not main.

### 2026-11-01 — RD01 / QA01: edge-exit and multi-touch paper-fold reliability
- Parent PR #1 HEAD checked: `71ed9cabe1b4af687729181443232f32ae7eb1da`. Existing exact-head Android/Chromium CI **PASS**: run 41305521088 on 71ed9cabe1b4af687729181443232f32ae7eb1da; no repeated content/source work.
- Production: `reader-experience.js` cancels a not-yet-captured edge hold when its owning pointer leaves the reading sheet, preventing phantom drags; a secondary contact cancels the original one-finger fold when Android WebView fails to emit the first pointer's cancel. Captured sheet can still legitimately travel beyond the edge. No change to text, translations, saved data, audio, or package ID.
- Regression: extended real extracted production-pointer handler tests in `tools/ux-2026-10-29.test.cjs` for owner/foreign pointerleave, subsequent new gestures, captured-paper edge crossing, and secondary finger cancellation.
- Exact-HEAD Node/Android/Chromium CI for this new change: **PENDING** at commit creation; device/120Hz/fold fidelity **NOT TESTED**. No stable-signature update/final APK claimed.
- Next: verify new CI outcome; test 20 repeated gestures and RTL page curl on physical tablet/phone, then complete sourced translations, historical in-page illustrations and release signer acceptance.

## Observed evidence before this commit

- Inspected working HEAD **8db19e77742ff9f451325b5298e9a2b31d7fbdca**; newest functional commits: 93060aaa (novel-only cover-first shelf + touch hold) and 24052f5a (novel-only chapter search and genre drawer); 8db19e77 documented original visual contract.
- Last **confirmed green CI**: SHA **fccf9b21ffb772ea720c2339c83745ae937cdb47**, GitHub Actions **41278955713**: https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/41278955713 .
- Last **failed CI**: SHA **24052f5aef3878ede3f8fdb63026f341aa4468a8**, Actions **41279858663**: https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/41279858663 . Android/Node/assets completed; Chromium E2E **FAIL** with "catalog: false" because fixture expected every saved catalog story to have a visible card. This violates new novel-only visible shelf, NOT evidence that the underlying stories were erased.
- **Current documentation+fixture repair will trigger a NEW CI. Status: NOT YET VERIFIED.** Never report success until exact new SHA job finishes green.

## Feature reconciliation (source state != release acceptance)

| IDs | Actual source implementation | Open/untested |
|---|---|---|
| C01..C05 | Verne Towle English 37 chapters + Arabic draft; older original short stories retained for saved data; one short Arabic investigator draft; sourced book discovery queue | NEW USER DECISION: no synthetic stories; original Arabic FULL text + complete contextual EN for Kalila/Arabian Nights; many long authentic novels across broad genres; edition rights/provenance and editorial checks |
| UX01..UX03 | New cover/title-on-book shelf, hides short stories without erasing catalog; novel drawer and search; nontext menu icon, accumulating header scroll, water bubble + held press | Exact CI new fixture pass pending; device/RTL/contrast/overflow/motion and polished home design |
| UX04 | Offline editorial art framework and some chapter-specific SVG | Genuine period-style scene art inside text across imported books, verifiable sources/licensing |
| RD01..RD02 | Touch drag/page rotation/shading, RTL handling, measured bilingual paragraph+illustration pagination, progress/bookmarks | TRUE deformable curvature/sheet mesh NOT implemented; user device turn and layout acceptance |
| DICT01 / LANG01 | Context dictionary/idioms, whole translation UI, independent language fonts, word saves, SRS, reading search | End-to-end bilingual literary edit and physical UX, source coverage |
| TH01 | Multiple themes and custom colors, saved/hide/restore, icon safe zone tweaks | Device visual/launcher and real performance QA |
| AU01 | Optional licensed OGG ambience and SFX, range-serving, focus/lifecycle fixes in code | Actual >60s continuous sound and focus/Android device validation |
| PERF01 | Lazy content and rendering, lighter tap compositing | 120Hz FPS measurements, RAM/startup/thermal not performed |
| APK01 | Correct main package identity and signing/backup checks | BLOCKED: installed signer compatibility and stable private release key; cannot deliver .preview as update |
| QA01/02 | Many Node/Android/Chromium tests; prior green fccf9b | Latest functional Chromium error found; exact new run pending; physical Xiaomi Pad 5 & phone acceptance NOT TESTED |
| HANDOFF01 | Master plan, sourced book queue, status ledger, AGENTS and README linked in this checkpoint | Mandatory **next-session** living updates, not a one-time plan |

## Priority queue

1. **QA01 P0:** Update Chromium flow to verify only long novel cards on shelf, real titles ON covers, and legacy source catalog still intact; then run/check exact-head CI. Investigate any new independent failure.
2. **C03/C02/C04 P0:** Actual full unabridged Arabic historical editions of Kalila and Arabian Nights and complete contextual English counterparts (not short/children/literal versions); verify text/translation/art rights.
3. **C01/C05 P0:** More sourced substantial long books in mystery, historical, classic adventure, psychological, SF, gothic and wisdom; record exact provenance before import.
4. **UX04/UX01 P1:** Period authentic artwork tied to paragraphs INSIDE chapters + readable old-book covers, broad categories/home visual QA.
5. **RD01/RD02/UX02 P1:** Real deformable page curl and pairing of text/translation/illustration, water bubble behavior.
6. **AU01/PERF01/QA02 P1:** Device audio >60s and focus, UI gestures, TalkBack, reading offline, FPS on supported phone/tablet.
7. **APK01 P0:** Verified compatible signed main release update, backup/restore, production package and no user data loss.

## Next developer append template — REQUIRED IN EVERY SIGNIFICANT COMMIT

### YYYY-MM-DD — Work IDs
- Latest PR HEAD and concurrent commits inspected: ...
- Actual change, files, new commit: ...
- Real tests run: PASS/FAIL/NOT RUN, details: ...
- **Exact new HEAD** GitHub Actions run/URL/status: PASS/FAIL/PENDING; later update with observed result.
- What is only source-complete; what still needs editorial/hardware/licensing?
- Highest next unfinished ID(s): ...
- Content? Update SOURCE_QUEUE and LITERATURE_PROVENANCE with edition/language/full-text/translation/art rights and checksums.

### 2026-11-01 — QA01 / C03 second follow-through
- Latest HEAD inspected before this commit: `70d5f26ed83d204d5753ed9ef9f125c698fe3cef`. GitHub Actions run **41281464826** for previous HEAD 70d5f26: **FAIL** in Chromium E2E only, `library retained: false`. The earlier initial `catalog` and `title ON book cover` E2E assertions passed. Prior content, Node, Android build and 37-chapter browser checks passed until final flow step.
- Adjusted the *return-to-library after theme change* test to check real book-shelf existence, at least one source-qualified visible novel card and preserved legacy 5-chapter story data; added precise diagnostics for any remaining failure. Did not delete stories or remove the book-cover tests. Exact new CI: **PENDING** until Actions finishes.
- Source discoveries: Kalila 1816 authentic Arabic index + 1819 Knatchbull English chapter index and complete historic scanned volume; wiki English chapter text is missing in multiple chapters and **NOT a complete bilingual product**. Also located 1835 Bulaq Nights Arabic catalog (one volume). Updated source queue, no text packaged or original invented.
- Next: CI exact HEAD; then verify actual complete scanned text/English editorial alignment, rights, antique in-page illustrations; user device QA and release signing still OPEN.

### 2026-11-01 — QA01: await actual history-driven reader exit in Chromium fixture
- Latest HEAD before work: `04587460a6bcf21aa8c4490c65654046c71b3b88`. GitHub Actions **41281940835** on SHA 04587460: **FAILED** in Chromium only with clear diagnostic `shelf:false, cards:48, allLong:1, legacy:5, page:reader`. Earlier catalog and cover-title assertions passed; Android unit/build, asset packaging, other chapter browser journeys succeeded.
- Actual root cause confirmed in `lingua-shell.js`: libraryBack first does an asynchronous history.back() or 480ms fallback, then 190ms reader close animation. Browser QA immediately called cycleVisualTheme() and looked for library cards before the transition finished. The fixture is now an async IIFE and waits up to 1450ms for state.page=library plus shelf, failing with actual closing/waiting diagnostics on a genuine hang. It retains all novel-only and historic saved-story assertions. **Production reader wasn't modified**.
- New exact-HEAD CI **PENDING**; cannot call this PASS until workflow finishes. Physical device animation still UNTESTED.

### 2026-11-01 — UX01/QA01 production filtering + updated Arabic-original Chromium acceptance
- Started from `72a85e5b8e07c79d3eb4de0f32c6c51142c9bd93`; exact HEAD CI 41282361980 on SHA 72a85e5b **FAILURE** at final Arabic-first browser assertion: a legacy six-chapter Arabic short work was erroneously expected VISIBLE in novel-only front shelf. Earlier full browser flow, source/Android build tests passed.
- Fixed actual CSS filter leak: `.lt-novel-card[hidden]` now uses `display:none!important`, overriding the novel-card flex !important that could show excluded favorites/level entries. Fixed stale visible/total novel count and empty state via `refreshNovelShelf`, invoked on every user favorite/level/sort change without altering legacy catalog or data.
- Browser journey asserts the legacy Arabic original is absent from the visible novel-only shelf but **still preserved** in source and directly opens with original Arabic, contextual English, illustrated reading and full companion. Added regressions for CSS and filter-hook code.
- Fresh exact-head CI pending; no user device or native signing/120Hz claim. Next: ensure green Chromium, then source real historic books and expand actual reading UX.

### 2026-11-01 — C01/C04 authentic full-length Sherlock source acquisition
- Parent HEAD before acquisition: `a6d4968d6da65343e0a8b6116cf3b8c056c39368`. Acquired **14/14** authentic English XHTML chapters for `A Study in Scarlet` (1887; Standard Ebooks upstream pinned `87889a2e628e720600cc1c4155428637c9ee35eb`), **264933 original UTF-8 bytes**, in `docs/literature/staging/a-study-in-scarlet`.
- Every source has original Git SHA-1 and size, is checked byte-for-byte through `tools/literature-originals.test.cjs` added to Android CI; license notice copied. Updates source queue and provenance.
- Explicitly UNPUBLISHED: the complete natural Arabic translation, legal applicability beyond US, historic chapter-specific illustrations and device acceptance are all unresolved. This is genuine English source acquisition, not finished bilingual integration or authored fiction.
- Exact new HEAD CI PENDING (prior UI fix CI may be canceled due concurrent workflow). No production signed APK claim.

### 2026-11-01 — C01/C05: second full authentic classic in different genre
- Parent HEAD `5e9122921edca7e898df9a1879c0e476605010f9`. Full original **The Lost World** (1912, science/adventure, 16 complete English chapters, 454904 upstream UTF-8 source bytes) staged byte-for-byte from Standard Ebooks pinned `77cda24ba881969982a09063e9f6c7651d87a728` in `docs/literature/staging/the-lost-world/`.
- Each source file has upstream Git SHA-1/size locked in manifest and tested in new `tools/literature-sci-fi.test.cjs` via Android CI. Preserved source license from its publisher. **No AI-written stories, no shortened chapters.**
- Not displayed in APK: missing entire contextual Arabic companion, editorial and distribution rights checks, period matched in-book illustrations, real device test. This is the SECOND truly full source, broadening beyond detective fiction. Exact new CI pending.

### 2026-11-01 — UX04: lightweight antique illustrated-page and cover framing
- Latest HEAD inspected: `11825c2ca23fb2b1e56070c38f40b616af9a4738`. Added *actual styling* to the production `lt-device-acceptance.css`: parchment-toned double-line book-plate frames for **inside-the-prose** illustrations, historic serif caption styling, and subtle inner-edged book cover, with dark-mode support. No per-frame JS, expensive `filter`/backdrop blur or new network images. Existing scene art remains subject to period-art suitability review.
- Added source CSS regression in `tools/device-ux-batch.test.cjs`, a separately attributed archival source guide `docs/literature/HISTORIC_ILLUSTRATION_SOURCES.md` (Kalila 1310 LOC, Sherlock 1887 Friston, The Lost World 1912 Rountree), and queued real image rights/scene alignment.
- No actual third-party images imported until each scan's rights and chapter mapping verified; the CSS appearance alone does NOT prove real historical artwork. CI exact-HEAD PENDING; device acceptance not done.

### 2026-11-01 — C01/C05: authentic 28-part Frankenstein intake, full English literary original
- Inspected latest HEAD `558e977b38c68fcfb1ef01303dbea67a2d6e9610` and recent GitHub Actions before staging. Sourced **4 original letters + 24 complete chapters** from pinned upstream Standard Ebooks `3909a2b9d956377e797e235562cd237d3667fa9b`; verified individual files' destination blobs exactly match original upstream Git SHA, not AI-authored or rewritten. Added `docs/literature/staging/frankenstein/` manifest and full source-integrity Node CI test, updated literature queue.
- **NOT SHIPPED** as bilingual app content: complete natural Arabic companion, age-appropriate antique scene illustrations/rights, territorial redistribution and actual device tests remain OPEN. Added no fake translated text and did not modify installed application data.
- Exact new HEAD CI: PENDING at commit creation; do not mark PASS until its actual run completes. Latest observed earlier green 11825c2ca run 41284861706, subsequent visual batch running.

### 2026-11-01 — QA01: correct false-positive CSS regression
- The 558e977b CI failed at device-ux-batch.test.cjs:115 because its forbidden animation declaration regex matched the words 'scrolling animation:' inside a CSS comment, not an actual style declaration. The test now removes CSS comments before checking for forbidden GPU-heavy declarations; real filter/backdrop-filter/animation style remains disallowed. New CI pending.

### 2026-11-01 — C02/C03: real Arabic Kalila source, latest concurrent HEAD respected
- Resumed from HEAD `0321499fe01b14a385703d38b32358d80b8fe8df` including concurrent UX test correction and Frankenstein source. Never rewrote those files. Acquired full-length authentic Arabic `كليلة ودمنة` transcription from Wikisource-derived Riwaq `7azmi/areader@22402121d6dc30c4468a4bdb006bedfa877dd7e9`. **432,293 UTF-8 bytes**, publisher-listed 45,769 words, 20 source-revision links, per-byte SHA pin, CC BY-SA 4.0 attribution and marked `publishable:false`.
- Staged in `docs/literature/staging/kalila-arabic-wikisource/`, added `tools/literature-arabic-original.test.cjs` to CI and provenance/source queue. The digital Arabic text's 20 sections are **NOT automatically the 18 chapters of 1816 de Sacy / 1819 Knatchbull**. Complete contextual EN alignment, legal share-alike review and licensed antique images open. No false ready-for-reading claims.
- New exact SHA CI PENDING, no safe signed production APK yet.

### 2026-11-01 — QA01 second-stage comment token fix
- Actions 41285595654 on 0321499f FAIL same CSS GPU assertion because initial match started **inside** the beginning CSS comment; replacing full /* ... */ comments could not strip a comment prefix already sliced off. Confirmed reproduction in actual production CSS: first-match old included 'scrolling animation:', corrected slice starts from the preceding /* and removes comments fully; verified corrected regex returns ZERO forbidden declarations on existing styles. All actual CSS property checks remain enabled. Next exact-HEAD CI PENDING.

### 2026-11-01 — RD02/DICT01: repaginate after individual bilingual reveal/hide
- Started from HEAD `838e8ee6a372c00d5d6c36f96fd662590f610bf9`, verified Actions 41285696545 SUCCESS and inspected recent concurrent chapters. Retained all staged real literary sources unchanged.
- `reader-experience.js` now remeasures actual paper pages whenever a user reveals OR hides a contextual Arabic/English paragraph companion, using existing `LinguaReflowReader` and a bounded semantic source-paragraph viewport offset. Previously extra translation lines could overflow an already measured page and visually separate in-prose illustration and source paragraph. Runs **only for an actual paginated reader**, not in a scroll loop or nonpaged view.
- `tools/reader-experience.test.cjs` now verifies precisely one repagination for each keyboard toggle at the original paragraph and preserved viewport, plus existing tests for text/direction and re-render state.
- New exact-head Actions **PENDING**. Real Android device 120Hz, artistic review, staged book translations and final signed update remain NOT TESTED/OPEN.

### 2026-11-01 — C03/UX01: real long classics include heritage, without deceptive novel labels
- Confirmed HEAD `eeaafa4874810b9f0360e010f547c59ad0d40f1d`, run 41286224846 **SUCCESS**; no competing commits at start.
- `lingua-shell.js` now supports `workType:'heritage-volume'` with verified `fullWordCount>=25000` AND `completeEdition`, `companionComplete`, `editorialApproved`, `rightsReviewed` all true. **Data flags alone do not prove licensing or accurate translation**; they must only be set after independent evidence. Staged incomplete Kalila remains hidden. Books with declared short text cannot game a 12-chapter threshold.
- Main shelf now reads "The Classics Library / المكتبة الكلاسيكية" with novels and complete Arabic heritage books, and uses "sections/أبواب" for historical volumes, not "detective novels". Existing Verne and old saved-progress records unchanged.
- Added source/VM regression assertions for the positive complete-volume case, incomplete English companion, missing rights, and artificial tiny stories. New exact-head CI PENDING; real-device UX/translation and final APK remain OPEN.

### 2026-11-01 — UX01/C03: genre navigation and discovery consistently handle Arabic historical volumes
- Parent HEAD `16b6a496a08fa3e500ca89ad5681debcf67f914e`. Changed `lingua-shell.js` library drawer/search labels to **books**, not misnamed "stories" or "all novels". Added optional dedicated **التراث العربي / Arabic Heritage** genre for fully approved books with `workType:'heritage-volume'` and `genre:'heritage'` only; unapproved source-only texts cannot trigger the category. Original-Arabic filter is **كتب عربية أصيلة / Arabic Originals**; genre heading and book title search now say books. No source text, paid service, theme engine or saved data touched.
- Added source regression checks for broad book categories, conditional historic volume discovery and locale labels. CI for this HEAD PENDING; 16b6a496 parent CI was still in progress when checked and should be verified by its run, and no physical device was tested.

### 2026-11-01 — QA01 and C01/C05: four adult genres, authentic full Dracula stage
- Parent HEAD `b243ef0d7555d77ab53c1133b9c41e7fb2560f2c` inspected, run 41304801853 **FAIL** at final `Arabic-first reading journey` because its hard-coded UI expectation used the OLD category name `القصص العربية`, now correctly `كتب أصلها عربي`. Android build/content tests and prior 37-chapter browser journeys succeeded. Updated only expected translation in `tools/make_browser_fixtures.py`, maintaining original Arabic source tests and actual visible state assertions.
- Acquired original 1897 **Dracula** by Bram Stoker, pinned Standard Ebooks `e9968b274918e5a79b8e34cc93e50492363d1612`, all 27 full narrative chapters PLUS prefatory note and closing epilogue, 29 unchanged XHTML source Git blobs and metadata, executable source-integrity/approval-gate CI. Original FULL English novel is deliberately **staged, not shipped**; no complete natural/contextual Arabic translation, historical licensed scene art, territorial rights or physical-device approval yet.
- Found edition alignment research https://www.theobeers.com/kwd-reader/info/ confirming multiple Arabic Kalila recensions differ; the existing 20-section Arabic source cannot be blindly paired with 18-section Knatchbull EN. Queue updated and release gate stays closed.
- New exact-head CI **PENDING**; next steps editorial chapter mapping, full translation and verified antique in-page artwork + device QA. No signed APK claim.
