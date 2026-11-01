# Lingua Tales — LIVE STATUS / آخر المنجز والمتبقي

Checkpoint: 2026-11-01. Read MASTER PLAN for immutable scope and IDs; this file MUST be updated in every meaningful code/content commit and reconciled with current HEAD/CI. Work on PR #1 branch automation/storylens-dictionary-saved-words-20261023, not main.

### 2026-11-01 — RD01 / QA01: edge-exit and multi-touch paper-fold reliability
- Parent PR #1 HEAD checked: `71ed9cabe1b4af687729181443232f32ae7eb1da`. Existing exact-head Android/Chromium CI **PASS**: run 41305521088 on 71ed9cabe1b4af687729181443232f32ae7eb1da; no repeated content/source work.
- Production: `reader-experience.js` cancels a not-yet-captured edge hold when its owning pointer leaves the reading sheet, preventing phantom drags; a secondary contact cancels the original one-finger fold when Android WebView fails to emit the first pointer's cancel. Captured sheet can still legitimately travel beyond the edge. No change to text, translations, saved data, audio, or package ID.
- Regression: extended real extracted production-pointer handler tests in `tools/ux-2026-10-29.test.cjs` for owner/foreign pointerleave, subsequent new gestures, captured-paper edge crossing, and secondary finger cancellation.
- Exact-HEAD Node/Android/Chromium CI for this new change: **PENDING** at commit creation; device/120Hz/fold fidelity **NOT TESTED**. No stable-signature update/final APK claimed.
- Next: verify new CI outcome; test 20 repeated gestures and RTL page curl on physical tablet/phone, then complete sourced translations, historical in-page illustrations and release signer acceptance.

### 2026-11-01 — PERF01 / LANG01 / RD02: chapter-at-a-time full-book translation
- Verified parent HEAD `39515e8c0bc0d468dc1db0555127d222a76e30a0` and **PASS** exact-head Actions 41306361360 (Node, Gradle, APK, Chromium). No concurrent PR branch writes when inspected; continued only from this HEAD.
- The previous full-translation view synchronized an entire 37-chapter classic into one giant HTML string and WebView DOM, causing potentially heavy main-thread work and memory allocation. Production now mounts only the **selected chapter** in the Arabic or English companion view while exposing all available book chapters with an accessible selector, previous/next, original title, correct direction and sanitized paragraphs. Source/book progress keys, all authentic text, saved words and data untouched; the existing reader-return scroll hook is retained.
- Added responsive companion navigation CSS, `tools/translation-window.test.cjs` executed by Android CI, verifying all 37 options, one chapter's paragraphs only, first/last boundaries, Arabic-origin reverse translation, escaping, invalid input and reader progress isolation.
- Source changes committed to this branch; new exact-HEAD CI is **PENDING** at commit creation (do not infer success). Physical Xiaomi Pad 5 120Hz/long-book memory and translation editorial acceptance **NOT TESTED**.
- Next: verify exact-head CI and browser flow, then check companion chapter switching/bookmark return on real Android, continue period art and full licensed original translations.

### 2026-11-01 — QA01: fix only the companion test's incorrect localized title expectation
- Exact-parent CI 41307298055 on `fed668a` **FAILED** in `Validate curated offline content` at `translation-window.test.cjs:36`. The production actually rendered the correct Arabic companion heading `الفصل 14`, but the test incorrectly demanded `English chapter 14`. Verified failure against GitHub Actions job 124850198106 logs.
- Updated the test to require the real Arabic `h2 lang="ar" dir="rtl"` heading. Production renderer, book data, original text, saved progress and app signing unchanged.
- New exact-HEAD CI PENDING; do not mark this batch green until all jobs pass.

### 2026-11-01 — QA01: correct escaped-newline test syntax from connector write
- CI 41307420688 on 89d5b4 **FAILED** during `translation-window.test.cjs` parsing: prior test-only update accidentally inserted literal `\\n` between assertion arguments (Node `SyntaxError`). No app production error was reported; all preceding tests had passed.
- Removed the bad literal sequence; parsed the **complete corrected test with V8 Function compiler** before commit. No renderer/content changes.
- Exact-head full CI **PENDING**; follow up on the actual run before reporting pass.

### 2026-11-01 — RD02 / PERF01 / QA01: complete-chapter companion navigation + Chromium acceptance
- Verified parent HEAD `67df8d01659eddc65fe454e5d798ca9bc45ea5e6`; exact previous run 41307528688 **SUCCESS** (Node, Android, assets, Chromium).
- Production companion view now provides accessible Previous/Next controls *at the end* of every translated chapter in addition to the selector at the top, eliminating scrolling back up. Malformed chapter values are rejected; selecting the already displayed chapter no longer rerenders the large text DOM.
- Expanded Node regression for source-bound bottom navigation, same-chapter no-op and rejected empty/invalid values. New `qa-translation-37.html` Chromium fixture executes real complete Verne loading, confirms only chapter XIV's Arabic paragraphs are mounted, navigates to chapter XXXVII and back to original without altering source progress.
- New exact-head Android/Chromium CI PENDING at commit creation. Physical Pad 5 120Hz, literary editing and stable release signing remain UNTESTED.
- Next: verify CI, real-device swipe/page-turn performance, historical in-page art and licensed full bilingual books.

### 2026-11-01 — PERF01 / QA01: real offline book-loading progress
- Based on exact PR HEAD `383741d992dff0d369f0f1dfd216e2dcad5530c2`, after prior Node/Android success and while Chromium regression was under check.
- Long-book loader now shows an accessible native progress element and truthful count of actual completed local chapter/illustration scripts (0–40, including reused scripts after cancellation). It does not claim download bytes, time percentages, FPS or network activity. The overlay remains cancelable, and a stale generation cannot advance the visible counter after cancellation.
- New existing-loader regression simulates a held fifth script, validates 4/40 shown with exact localized text, then verifies 40/40 after all scripts and restored reader interaction. Unrelated small stories and dictionary loading remain unchanged.
- This staged code+test commit is NOT published or CI-accepted until its parent full Chromium run is checked; Xiaomi Pad 5/TalkBack/real battery and signed release NOT TESTED.
- Next: verify full exact-head CI, avoid redundant commits, continue licensed literature/period in-page art.

### 2026-11-01 — RD01 / QA01: Chromium RTL/LTR paper-fold integration
- Based on inspected parent PR HEAD `d822c79339a3e3b157474ff7a1164316a66754f8` without touching production rendering. Added real-browser fixture `paper-fold-browser` covering the actual source-backed reader, pointerdown/move/up, Arabic RTL left-edge and English LTR right-edge, active curved CSS polygon, neighboring paper, cleanup, and committed turn. This goes beyond the pre-existing VM-only ownership tests.
- Injects no purchased images and does not change user progress keys, narrative, or runtime code. Exact browser CI and physical tablet/finger visuals **PENDING/NOT TESTED** at this checkpoint.
- New browser CI must pass before QA01 can be recorded green. Visual 120Hz and actual finger touch need physical device acceptance.

### 2026-11-01 — QA01: isolate real-browser paper drag from optional art and ensure diagnostics
- Exact-head GitHub Actions 41309295773 on `b3a13eda280364f9bba4afadb5a5ab42ecaf7059` **FAILED** at `Browser render smoke and screenshot artifacts` after the earlier Node/Android/asset stages passed. The paper-fold fixture returned no PASS marker and no structured error attribute, so **gesture acceptance is NOT VERIFIED**; no assertion about production failure is justified.
- Replaced dependency on asynchronous editorial-art registration with the base, synchronous 10-paragraph `last-passenger` reader. Replaced unbounded animation-frame awaits with bounded timers (while leaving the production rAF drawing path intact). Added `data-lt-paper-stage` at start/layout/held/released/complete and prints it on CI failure to distinguish not-executed from assertion failures.
- New exact SHA CI PENDING; if the browser reports an actual curved-page or commit failure, investigate production code rather than weakening requirements. Physical touchscreen/120Hz still OPEN.

### 2026-11-01 — UX01: correct actual phone/tablet book-shelf screenshot defects
- Verified current PR HEAD `06bac33e40b94eba0d7d96a3ecdd121a14be01cb` and genuine CI screenshots from previous successful run 41308776448. One full-length classic was aligned at the RTL right edge on both phone and tablet, leaving most of the shelf blank; the injected title overlapped lettering baked into the older SVG.
- Production `lt-device-acceptance.css` now uses centered auto-fit book tracks and a max 235px cover, with an opaque shaded title base and bounded three-line readable title overlay. Added source regression. No source catalog, original art or user data changed.
- Added documented historic Verne illustrator provenance leads in source queue and illustration guide, **NOT claiming that the candidate scans are already shipped**.
- New full CI PENDING; screenshots must be inspected after build. Earlier real RTL/LTR paper-fold browser CI 41309609823 **FAILED** at visual crease checks while its actual release/turn assertions passed; handled in the next code batch.

### 2026-11-01 — UX01 / QA01: remove duplicate historical cover lettering from actual Chromium screenshots
- Parent HEAD inspected: `8b3bf79bd184ea5ef9a59b853ba1eca9cae6b9d0`; its exact-HEAD Android/Node/Chromium run **41310500799 SUCCESS**. Real downloaded artifact `StoryLens-UI-Screenshots` was examined at 460x860 and 1280x840; it still shows TWO overlapping text layers on the Verne cover, despite passing the prior simplistic browser check.
- Root cause: base `index.html` declares `.cover.art:before,.cover.art:after{display:none}`. The later stylesheet had supplied an ink-mask background but **never restored display**, so computed background tests passed while no overlay was painted. Scoped new production CSS `.library .lt-book-cover.art::before/after` explicitly restores both pseudo-elements; the ink mask hides baked text only in the bottom cover band, while the real, accessible story title stays live text on top.
- Extended exact asset/source regression and the real Chromium phone/tablet shelf fixture to assert computed pseudo-element `display`, `content`, `backgroundImage`, `zIndex` and authentic local `art` class; avoids future false-positive screenshots.
- New exact-head Android/Chromium CI **PENDING** at commit creation. Need inspect new images afterward; no device/120Hz, literary-content or signed-update claim.
- Next: confirm visual screenshot and CI then continue period, source-anchored internal book plates and Android-device acceptance.

### 2026-11-01 — LANG01 / RD02 / QA01: accessible reading focus on companion chapter changes
- Staged on verified PR parent `661151785a3c5d5f7787b553ed8845fb8743d985`. The companion's old select/Next buttons are removed whenever the chapter DOM is rebuilt; without focus transfer, keyboard navigation and TalkBack's reading cursor may fall back to the page body.
- The translated chapter heading now has stable `id="lt-translation-chapter-title" tabindex="-1"`. Immediately after each book/chapter render, focus moves to that heading with `preventScroll:true`, then the existing scroll-to-top is retained. Chapter text, translations, personal progress, original source location and app signing are untouched.
- Extended exact production-source `tools/translation-window.test.cjs` to assert heading focus, no focus stealing on reselect, and navigation focus change; the existing actual Chromium `translation-37` fixture now asserts the real `document.activeElement` on chapter XIV and XXXVII.
- New exact-HEAD CI **PENDING**, not physical TalkBack proof. Only publish after parent CI has succeeded; no new branch created.

### 2026-11-01 — UX01 / QA01: correct full-cover pseudo-element geometry
- Inspected old `index.html` styles for the historic cover. In addition to `display:none`, the legacy `.cover::before` explicitly sets `width:70px;height:70px`; the legacy `.cover::after` sets `height:47%`. A re-enabled pseudo-element without dimension resets would paint ONLY a small circle/partial border and could leave the baked book title visible.
- Scoped fix forces the production ink mask to fill 100% of the cover and the decorative border to use the actual full inset, without filters or continuous animations. Extended the real Chromium phone/tablet fixture to verify rendered pseudo widths/heights against `cover.clientWidth/clientHeight`; static source test rejects regressions.
- Combined with the separately pre-tested companion chapter heading focus fix (staged earlier), both based on branch parent `661151785a3c5d5f7787b553ed8845fb8743d985`. Node source-bound translation focus regression previously passed under V8. Full exact-head CI **PENDING**; visual screenshot review and real Android device proof OPEN.

### 2026-11-01 — UX01 / QA01: eliminate inherited circular glow and clipped skyline from real art covers
- Source parent `3e432da57b54914375207e05a4cdd67a158e5f2c`. Inspected actual CI screenshot artifact from **run 41334336154** after the first mask restoration: a large black/angular clipped pattern appeared across the top of the historic globe, proving legacy `.cover:after` visual styling is still inherited. Existing period border pseudo-element must only draw a thin border, not the old skyline graphic.
- Scoped CSS now resets `background:none;clip-path:none;box-shadow:none` on the **art cover frame** and resets `border-radius:0;box-shadow:none` on the full-size ink mask; preserves artwork and the accessible DOM cover title. Unlike earlier naive CSS checks, the real Chromium phone/tablet fixture checks these *computed paint properties* plus full-sized pseudo-element geometry.
- Staged with production change, source checks, and browser fixture; new exact-head CI and screenshot approval **PENDING**. Does not touch installed package data, content, or 120Hz device tuning.

### 2026-11-01 — UX01 / UX04 real historic archive intake (source scan download stage)
- Verified exact parent PR HEAD `a2d3970a924feb0d3d44b4151fe2e3247366d8f0`; GitHub Actions 41335213067 **success** (all tests) prior to this intake. User rejected the decorative and vector/line-pattern covers: only real historical images or scene-true archive photography/engraving are acceptable.
- Authenticated three individual historical scans from Wikimedia Commons and original edition metadata: 1873 Phileas Fogg's Kiouni elephant purchase scene (Towle chapter XI), 1872 original world itinerary map (chapter III) and 1872 Tankadere storm engraving (chapter XXI). Each has a pinned upstream SHA-1, source page and documented PDM/US-old-publication rationale, not just a category title.
- Added `tools/intake_period_art.py` to fetch those ORIGINAL IMAGE BYTES on the CI runner, fail on changed source checksums, encode individually bounded WebP assets and create per-asset source/optimized SHA-256 manifest. The temporary `historic_art_intake` GitHub workflow job returns the verified binary assets as an Actions artifact for subsequent direct Git object commit. **This first commit is the acquisition pipeline, NOT yet claiming images in the APK.**
- Next: retrieve the real image artifact, inspect it, commit compact verified WebP files to `app/src/main/assets/art/`, wire honest real-image cover and passage-anchored in-page figure, remove temporary remote-intake job, add tests and run exact-head Android/Chromium.
- Preserve no-network Android runtime, existing library data, full-book metadata and signature. No original APK update/physical 120Hz/territorial redistribution signoff claims.

### 2026-11-01 — UX04: bounded WebP adjustment after actual CI archive fetch
- Parent `4cdb673e161ac82dbde048b4c6388c1742825824` created intake run 41336822081. The dedicated intake job reached Wikimedia, verified the first original image SHA-1, decoded and encoded it successfully, but correctly rejected output **314,594 bytes >270,000-byte artwork budget**. Therefore no art was imported yet; no false success.
- Reduced elephant rescale to max 630px and Tankadere to max 640px with WebP quality 67; all source SHA-1 verifications and strict size budget remain enforced. Retest exact-head intake and continue to offline APK assets. No application data or runtime changed.

### 2026-11-01 — UX04: safe archive image Git binary import
- Actual historic intake job run 41336898248 **SUCCEEDED**, yielding three original-source-verified offline WebP images 193,560, 69,262 and 167,854 bytes; package artifact downloaded and hashes personally inspected.
- GitHub Actions same-branch bot commit step now verifies current remote HEAD matches triggering commit, rehashes the binaries and copies them into app/src/main/assets/art/ with a provenance manifest. It will abort rather than overwrite concurrent user/agent changes; never push main or force-push.
- This changes image intake only; historic images are NOT YET displayed in the app. Next: wire cover and chapter scenes once the actual binary Git commit appears, remove this temporary runner intake job, exact SHA CI.

### 2026-11-01 — UX01 / UX04: actual antique cover and three story-anchored reading pictures
- Verified parent HEAD `010a315154fec055885e8cc8b0ff30ead3442868`; the previous GitHub Actions bot added three real image files under `app/src/main/assets/art/` plus a per-file SHA manifest. Their repository-visible byte lengths are 193,560 + 69,262 + 167,854; this is NOT a mock/remote URL.
- Wired an authentic 1873 *Kiouni* / Phileas Fogg engraved scene to the book cover with locally packaged WebP CSS, replacing the abstract image appearance for the long novel. In-reader paragraph-matched pictures appear in original chapter III ¶28 (8-leg world route), XI ¶44 (elephant and Fogg), XXI ¶35 (Tankadere storm). Original English/Arabic text and bookmarks unchanged. Historial scans are 1872/1873, not AI-generated.
- Added offline SHA-256/manifest and CSS/scene placement Node acceptance checks to the real Android CI; removed temporary network-enabled runner intake job. No runtime Internet permission/network fetch is added. Full exact-HEAD CI on this code commit **PENDING**, and physical Android 120Hz/device and territorial rights review remain OPEN. Other classics and genuine vintage art are still incomplete.

### 2026-11-01 — UX04 / QA01: original in-book illustrations and bilingual captions, real Chromium image QA
- Verified latest PR HEAD `5680e3341d32c097a19e6121b4f268043f2b6f3f`; full CI run 41337477165 **SUCCESS**. Avoided repeating the three already-imported original Verne WebP scans and their SHA provenance.
- Updated *existing* three historical plate credits to Arabic/English contextual captions, preserving original artist names and archival provenance. They remain paired with the actual chapter paragraph, with original local image assets and honest alternative text.
- Added Chromium integration fixture for chapters III, XI, XXI to verify actual mounted figures, their source `art/*.webp`, paragraph anchor, bilingual credit, reserved image aspect ratio and decoded local bitmap. Added the fixture to Android CI and strengthened static checks. This is source/asset behavior verification, not real-device art aesthetic sign-off.
- CI for this new exact HEAD PENDING; 120Hz/tablet, full literary translations and stable signer still OPEN.

### 2026-11-01 — UX04 / QA01: respect real-reader lazy image loading in browser verification
- Latest parent SHA `2aed6993c407652473384e6987d8a278d9ed6cea` examined. CI 41338912289 **FAILED only at the newly added Chromium historic-plates test**: illustrations at chapter III and XXI existed with correct anchors/local paths, but `naturalWidth` was 0 because those figures were offscreen with intentional `loading="lazy"`; chapter XI bitmap passed. All Node, Kotlin, APK, source, editorial and earlier Chromium stages passed.
- QA fixture now switches ONLY its own inspected image elements to `loading='eager'`, awaits their real `decode()`, then tests `complete && naturalWidth>0`. Production images remain `loading="lazy"` and `decoding="async"`, preserving lower memory/battery burden.
- New exact-head CI PENDING. Physical device and editorial/art market rights unchanged.

### 2026-11-01 — QA01: no unbounded offscreen image decode in headless Chromium
- Parent HEAD `be01ee1f02a4b550968858cd5993f33d813b616e` exact-head run 41339146636 **FAILED** at newly introduced plate QA, after Node source checksum/Android/APK tests succeeded. Forcing `HTMLImageElement.decode()` on an offscreen, intentionally lazy image did not resolve before Chromium dumped its DOM, producing no `data-lt-historic-qa` marker. This was a test synchronization defect, not verified production regression.
- Browser QA now asserts the real chapter/paragraph/figure, local WebP URL, contextual captions, and deliberate `loading=lazy`/`decoding=async`; the existing Node SHA-256/WebP-header test independently validates the packed binary. No eager loading or image changes in production.
- New exact-head CI PENDING.

### 2026-11-01 — UX04 / LANG01: historical chapter pictures also appear in full-translation reading
- Prepared after parent HEAD `0caeff3863a555ca98b6c5a953f87c1954453945`, pending its precise Actions result. The full Arabic companion reader previously omitted the contextual source-era plates which were already present beside their authentic English source paragraphs.
- Reused the same three **offline, checksum-verified original Verne engraving assets** (III route map, XI Kiouni, XXI Tankadere), inserting at the exact identical paragraph positions inside the chapter-at-a-time Arabic companion. Preserved every translated paragraph, chapter navigation, screen-reader focus and lazy image decoding; no modern filler or external URLs. Accessible scene-specific alternative text and bilingual credits are included.
- Added lightweight period framing to translated-reader CSS, Node tests for three source-aligned scenes and unchanged paragraph counts, and extended Chromium chapter fixture to verify source AND translated figure per chapter. Full CI and real-device art alignment remain NOT VERIFIED until current exact-head action completes.
- No stable APK signature or main merge.

### 2026-11-01 — QA01: repair stale Arabic-origin bilingual test after period-art insertion
- Previous HEAD `ffec8f8134a5a63fe8f6d94a32cadc9eba21d6ab`: Actions 41339676292 **FAILED** in `Validate curated offline content`, `tools/arabic-originals.test.cjs:30`, because it searched an obsolete source spelling `escapeText(p.en)`. The production reader now correctly uses `paragraph.en` and `paragraph.ar` while mounting an archival plate. The test had falsely treated a local variable name as an API.
- Updated both assertions to confirm escaped complete source-paragraph branches; no data/translation/signing change. Dedicated companion production-source Node test already passed locally, including exact archival chapter and paragraph coverage.
- Full next-HEAD CI PENDING. No automatic story approval.

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

### 2026-11-01 — UX01 / UX04: original historic scans imported (binary checkpoint)
- Historic intake downloaded and verified Kiouni elephant, itinerary map and Tankadere period engravings against original Commons SHA-1; recoded and checked exact WebP SHA-256; three offline files under app/src/main/assets/art.
- Actual source URL, date, original/optimized hash, artist and scene records: docs/literature/HISTORIC_VERNES_ASSETS.json.
- This is a binary-asset milestone, not yet a change to reader display. Wire historical cover and chapter illustrations in next code commit, remove temporary intake job and verify the new APK/Chromium.
