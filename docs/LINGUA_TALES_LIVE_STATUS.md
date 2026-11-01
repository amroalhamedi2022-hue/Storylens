# Lingua Tales — LIVE STATUS / آخر المنجز والمتبقي

Checkpoint: 2026-11-01. Read MASTER PLAN for immutable scope and IDs; this file MUST be updated in every meaningful code/content commit and reconciled with current HEAD/CI. Work on PR #1 branch automation/storylens-dictionary-saved-words-20261023, not main.

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
