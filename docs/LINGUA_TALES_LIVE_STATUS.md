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

### 2026-11-01 — UX04: staged two independently identified original 1873 book scenes
- Parent HEAD `3b5769fa2e326eaea88c14d9a5f059510564794f` and exact-head Actions 41339826393 SUCCESS verified first. New historic sources verified by Commons metadata (individual SHA-1 and 1873 Osgood illustrated edition): **London readers examining newspaper** (chapter V, paragraph index 1) and **Fogg/Aouda/Fix aboard the Tankadere cabin** (chapter XX, index 66). Those anchors were matched to the authentic Towle source text already in the app.
- One-time GitHub Actions intake uses original JPG bytes, pinned source SHA-1, bounded WebP (<270KB each), manifest with SHA-256 for both original+optimized, and guarded git push back to existing PR branch; no outside artwork hotlink at runtime. Additional images are NOT shipped until the binary import commit actually appears. Upstream marks 'No known copyright restrictions' on the Flickr Commons 1873 scans (not an automatic worldwide licensing promise).
- Next: verify archive intake and binary SHA manifest, then remove one-time workflow and wire both art scenes into English/Arabic reader, with exact-head browser tests. No release signer/physical-device acceptance.

### 2026-11-01 — UX04 / C04 / QA01: five genuine period engravings aligned in both reader modes
- Inspected parent `02ae2d4f93df26ff736e6c8ea27e1fa05e2d5ad5`, after successful one-time archive intake auto-commit `02ae2d4f9`. Both new 1873 original print scans have verified upstream SHA-1 and new compressed WebP SHA-256 in `docs/literature/HISTORIC_VERNES_ASSETS.json`. Both are genuine source-era illustrations, not generated vector artwork; Commons 'No known copyright restrictions' is NOT a blanket territory clearance.
- Added original newspaper readers engraving after exact Towle chapter V paragraph 2 (index 1) and cabin of *Tankadere* after chapter XX paragraph 67 (index 66). Both figures now appear beside source and full-Arabic-companion paragraphs with bilingual contextual alt/credit, reserved 620px image geometry, lazy loading and no network runtime.
- Historical manifest integrity test now validates **five** images with file sizes <270KB, original SHA-1 and packaged SHA-256; source/companion tests and real Chromium chapter/figure/paragraph tests now include both new chapters. Removed one-time workflow image publisher to prevent future overwrites or unnecessary network work.
- New exact-head Android + Chromium CI PENDING. Xiaomi Pad 5 120Hz, editorial Arabic translation review and stable signing still OPEN.

### 2026-11-01 — UX01 / UX04 / QA01: only source-backed Verne scenes, plus new screenshot evidence
- Parent HEAD checked `a329a806f820556180c3836dba14954319970af6`. User's standing request forbids decorative SVG/abstract story pictures in the historical book. Production Verne reader no longer falls back to the legacy generic SVG chapter scene when no verified archival plate exists; older saved short-story art remains untouched for backward compatibility.
- New real-Chromium screenshot fixtures create phone-sized evidence **focused on the new authentic archive engravings** in Towle V and XX, not merely the home-page cover. CI uploads `verne-original-news-ch05.png` and `verne-original-cabin-ch20.png` for independent inspection.
- Corresponding static source test rejects abstract fallback reintroduction. Full exact-head CI and screenshot review PENDING; no claim of measured 120Hz or stable release signing.

### 2026-11-01 — UX01 / UX04: replace the actual chapter-hero decorative SVG with sourced engravings
- Inspected **real screenshots** from passing exact-head CI 41341877652 on `0f9ca07d86c262811424e2b1da634d16879e45e1`: although all five period-scene figures mounted correctly inside the source/companion prose, the visible TOP of chapters V and XX still showed an old synthetic vector banner (newspaper/boat). This violated the user's insistence on authentic period imagery; the earlier screenshot fixtures alone did not catch it.
- For the Verne classic specifically, top-of-chapter art now reuses its exact verified original historical scan whenever one of the five chapter-scene plates is available; for the other 32 chapters, the false SVG banner is hidden instead of inventing a scene. Historical image framed with inexpensive CSS `background-size:contain` so original engravings are not severely cropped. Other historical/story content and older saved short-story art untouched.
- Added Node source/CSS regression and real Chromium assertion that each original figure and its chapter hero share the same local scanned WebP; verifies an unsourced chapter has NO generic hero. New exact-head CI and re-reviewed screenshots PENDING. No stable release or measured real-device FPS claim.

### 2026-11-01 — QA01: update obsolete browser assertions that demanded synthetic archive art
- Parent HEAD `5a98cd185a6af2878ad873e2d4b8ca7fe627a506`: exact-head CI 41342718570 passed literature, dictionary, unit tests and Android APK but **FAILED** at Chapter XXIX Arabic Chromium journey. The obsolete fixture insisted the chapter header contain the OLD `data:image/svg+xml` background despite the accepted new product rule forbidding geometric/abstract filler in period classics.
- Replaced precisely 23 stale assertions in 17 late-chapter and six themed source-language browser fixtures with a positive accessibility/visual acceptance check: the unsourced Verne chapter hero must be tagged `lt-no-period-hero` and computed `display:none`. All narrative, bilingual paragraph, navigation, search and pagination assertions remain unchanged. The five genuine original archive chapters retain separate direct-art verification.
- Exact-new-head Android/Chromium CI **PENDING**; physical Xiaomi Pad 5, translator editorial review, and original release keystore remain out-of-scope/OPEN.

### 2026-11-01 — PERF01 / UX04 / QA01: prevent invisible synthetic classic art generation
- Parent PR HEAD `caa501b15ff76664e10c0c2b1f7bee4e6a0727c4` and exact-head run 41343268268 **SUCCESS** before editing. The 37-chapter historical classic now has five authenticated original local period engravings. Its previous SVG chapter artworks are deliberately suppressed visually but the old `LinguaAttachEditorialArt` was still regenerating them after loading the book.
- The runtime registration now passes ONLY older saved short stories to the existing SVG generator and never generates/retains 37 unnecessary vectors for Verne. Completed novel loads reuse the one existing warmed registry rather than rebuilding it after chapter ingestion, with explicit generation cancellation check.
- Three synthetic chapter 35–37 art modules are excluded from the **runtime** lazy manifest (their source files remain for historical test isolation). The honest book progress count becomes **37 local scripts**: 36 original chapter source modules + one shared legacy art engine. Original English + draft Arabic paragraphs, actual engravings, stored user data, dictionary and app identity are unchanged.
- Added direct runtime filter and legacy compatibility coverage in illustrated-cover tests, warmup/reuse and 37-file progress tests, updated three standalone old-art tests to assert they are not shipped as executable tags.
- **Exact new-HEAD CI PENDING**. Real 120Hz/device, complete editorial translation review, rights-by-territory, original installed signing certificate still OPEN.

### 2026-11-01 — PERF01 / QA01: remove stale manifest assertion after eliminating synthetic chapter art
- Previous code head `f7ed8109159c6b9fc6f1127cb41ed133880f5326`, exact-head Actions 41344825664 **FAIL** in `Validate curated offline content` at `tools/content-loader.test.cjs:115`: the obsolete test assumed 41 inert asset tags, while the correct 37 book + 1 dictionary tags now produce 38. The new source logic was not reported failing in production.
- The regression now compares removed manifest nodes to the actual declared `bookAssets.length + dictionaryAssets.length`, preserving truthful asynchronous loading checks; also normalizes a cross-realm JS Array before Node strict equality in the legacy-cover registry test.
- No production code, original book, art asset, stored data, app identity or signer changed. New exact SHA CI PENDING.

### 2026-11-01 — QA01: Chromium's deferred-loader gate now rejects discarded synthetic chapter art
- Parent `5eb10e2b4d7fbf3d3f982eff1dabf084c733c1c9` exact-head Actions 41345024955 **FAILED only at new early Chromium deferred-content regression**. Node, literary content, identity and Android APK build already passed. The browser fixture wrongly required a generated `art[Verne_36]` SVG, four art scripts and 41 total assets; production deliberately removed three unused synthetic scripts to comply with the user's original-engraving-only policy.
- The browser now positively rejects a generated final-chapter synthetic vector, asserts one shared old-story art engine and exactly 38 loaded assets including FreeDict (37 book/art + dictionary). The original source payload, real period images and user data remain unchanged.
- New exact SHA CI PENDING; real Pad 5 and original signing gate still OPEN.

### 2026-11-01 — C02 / C04 / LANG01: identify authentic intermediary edition and unfinished literary review in reading UI
- Based on parent `ad96ab68d61c12ff524851aea2ef193838c322e3` while its exact-head CI is running. The 37-chapter Verne source is George Makepeace Towle's **1873 English translation of the original French**, not the original French text. Current Arabic companion is complete but **not independently literary-edited**; it must not be falsely presented as an approved finished translation.
- Added a quiet bilingual accessible `role=note` in the full-book Arabic companion identifying Towle/year/French original and clearly stating the Arabic is a draft awaiting independent review. The note appears only when Verne's editorial metadata explicitly marks Arabic draft review pending, and is absent from unrelated/Arabic-origin stories. No translation prose, saved progress, narration, images or original app ID changed.
- Added localized source-actual Node checks and real-browser full-translation fixture assertions for the notice. Exact-head full CI PENDING; independent human review still OPEN.

### 2026-11-01 — QA01: end-to-end novel cover proof rejects synthetic last-chapter art
- Parent `ad96ab68d61c12ff524851aea2ef193838c322e3` run 41345317194 **FAILED near the end of Chromium QA**, after extensive chapter, translation, paper-fold, Android and offline search tests passed. E2E flow still incorrectly required `art[Verne_36]` to exist, contradicting the now-verified artwork policy and the 37-source-script memory optimisation.
- Replaced the E2E requirement with a real browser computed-CSS verification of the **packaged Kiouni historical WebP book cover** and a negative check that the unlicensed-looking synthetic final SVG was NOT generated. No production artwork, story text or user data changed by this test-only repair.
- Combined this with separately source-tested `C02` companion literary provenance/draft disclosure in the same next commit to avoid repeated CI churn. New exact SHA CI pending.

### 2026-11-01 — C02 / QA01: separate edition notice from translated prose semantics
- Previous parent `f48435fb0eb7835bff80ae6b9c231fbd7feea37b`, Actions 41346011868 **FAIL only at the Chromium full-translation fixture** after Node and Android build PASS. The new Arabic draft disclosure was inserted as an extra paragraph and polluted the browser's actual translated-paragraph count/first-paragraph selector under localization.
- The visible unreviewed-Arabic / Towle-edition notice now uses semantic `aside role=note` instead of a `p` element, so it cannot be mistaken for source-aligned translated prose. Added an exact-source Node regression. No actual English/Arabic story paragraph, artwork, user progress, metadata or app signing changed.
- New exact-head CI PENDING; real Xiaomi/phone acceptance and independent literary review remain OPEN.

### 2026-11-01 — PERF01 / UX04: stop allocating 37 rejected synthetic scenes for complete Verne novel
- Latest parent PR HEAD verified `77203caa87c583765878b20c18edf79fe04275bd`; exact HEAD workflow 41346305871 **SUCCESS** with Node, Android and Chromium.
- The reader already shows archival WebP scans at five source-matched chapter positions and suppresses synthetic drawings elsewhere, but `editorial-art.js` still assembled 37 huge percent-encoded SVG scenes for the loaded classic in memory. Its base art registry now **skips Verne** while preserving every original editorial/novella art scene used by existing saved users. No chapter paragraph, translation, bitmap, storage key or package name changed.
- Updated `tools/verne-towle.test.cjs` to prohibit the four historically rejected pseudo-art backgrounds, and added a mixed 37-chapter book + saved editorial-story regression in `tools/editorial.test.cjs`: there must be zero fabricated Verne images while the old story still gets its own offline artwork.
- Source-bound local VM evaluation and new full CI pending at this checkpoint. Generated large SVG content remains in archived source for tests/backward compatibility; the improvement is runtime allocations, not APK bytes or measured device FPS. Next: actual CI and physical phone/tablet profiling; complete books/edited bilingual translations remain OPEN.

### 2026-11-01 — PERF01 / QA01: resolve redundant SVG-generator change without losing the runtime optimisation
- Latest branch HEAD `f9baca21866e258ab2b0f6213eff2bef6925c2b2`; Actions 41348178269 **FAILED** in `tools/verne-towle-ch05.test.cjs` because direct historical-legacy art-generator compatibility was removed. Inspected real `index.html`: it **already filters out** the Verne book before calling `StoryLensMakeEditorialArt`. The parent `77203caa87c583765878b20c18edf79fe04275bd` already had this runtime optimisation and had PASS CI 41346305871.
- Restored the three legacy-generator/test files exactly to their previously passing parent state, **without deleting any original archived content** or changing the production art filter. Added integration assertions in `tools/editorial.test.cjs` that extract the actual `LinguaAttachEditorialArt` function, supply a 37-chapter historical novel plus old saved fiction, and verify only the saved fiction is passed into the SVG generator, that its art is preserved, and cover hydration works once.
- This is a CI repair and regression reinforcement, not a new runtime speed claim. Exact-head CI PENDING; artwork five genuine period WebPs, translation drafts and device acceptance unchanged.

### 2026-11-01 — UX04 / C04: original 1873 Calcutta + Singapore scenes staged for source-hash intake
- Verified Commons original scans and edition metadata: Calcutta court (file 14781888384, SHA-1 c4fffab7167cda36e68f5e505578f90829b204d0) and carriage through Singapore (14804101583, SHA-1 3a7368c6cdd1a021493effb5a00f603abff6fe22); both 1873 J. R. Osgood book pictures from NYPL, not modern/generated images. Matched against exact English source chapter XV paragraph index 19 and chapter XVII paragraph index 7 already in repo.
- One-time archive GitHub job **PENDING** verifies original bytes against pinned SHA-1, converts to compressed WebP <=270KB each, generates packed SHA-256 and appends to historical manifest only if parent has exactly five. Safe GitHub HEAD lease refuses to overwrite Codex work. No runtime URL fetching or live image attachments until verified output exists. Commons rights signal 'no known copyright restrictions', not automatic world-wide sign-off.
- Parent action at `536c0e0a471ea7502991cadb569326ef1ba56e71` under verification, no claim new images shipped yet. After archive commit: connect new scenes to English+Arabic paragraphs, remove one-time intake job, update source/translator/rights QA and exact-head Chrome/Android.

### 2026-11-01 — UX04 / C04 / QA01: seven authentic 19th-century Verne illustrations in source + companion
- Verified latest parent HEAD `619aded91ce505ea979133fa190be4b1e2d1b5c9`; one-time source-hash intake produced bot commit `619aded91ce505ea979133fa190be4b1e2d1b5c9`: seven manifest entries, including new Court of Calcutta 1873 (162,796 bytes) and Singapore garden carriage 1873 (192,268 bytes), with pinned upstream SHA-1 and local file SHA-256.
- Production now anchors Calcutta courtroom illustration after chapter XV paragraph 20 (index 19) and Singapore carriage after chapter XVII paragraph 8 (index 7) in both original English reader and complete contextual Arabic companion. Top chapter banner uses same historical local scan instead of fake modern SVG; caption and alt in Arabic/English, reserved bitmap aspect ratio, lazy loading. Existing five historical scenes and all story/bookmarks unchanged.
- Extended source/file hash regression to seven, per-chapter contextual companion paragraph counts and actual Chromium source/companion figure + hero checks. Removed one-time archive uploader job from GitHub Actions so it cannot repeat. Source/rights notes in `docs/LITERATURE_SOURCE_QUEUE.md`.
- Exact-head Node/Android/Chromium CI **PENDING**; archive metadata signals 'no known copyright restrictions' but territory-specific release sign-off, natural literary translation review, 120Hz physical device tests and original installed signing key remain OPEN.

### 2026-11-01 — QA01 / UX04: two original chapter-scene screenshot fixtures
- Parent PR HEAD a8d30564f2c79d54a6f18a2bbe967e1b0279d1fe. Added actual Chromium image previews for 1873 Calcutta trial and Singapore carriage, both loaded from packed offline WebP and scrolled to the authentic source passage.
- Browser DOM check refuses a missing picture; screenshots are generated at a phone-sized viewport and included in the normal CI screenshot artifact to support human visual inspection. No story text, chapter translations, signing or user data modified.
- Current exact-head CI for new tests PENDING; hardware image quality and touch acceptance NOT TESTED.

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
