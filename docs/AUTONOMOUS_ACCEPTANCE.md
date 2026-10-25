## 2026-10-25 — Towle Chapter VI / Suez Quays integrated milestone
- Production: 37 original English source paragraphs aligned to 37 newly drafted Arabic paragraphs; 17 source-occurring contextual entries; original offline SVG of the Mongolia at Suez; new visually distinct Suez Quays theme and backup allowlist. Script order, Chromium chapter fixture, Android asset packaging and source tests updated together.
- Source: Standard Ebooks 1873 Towle transcription (CC0 editorial work); US public-domain translation; territory rights and independent Arabic literary review **NOT TESTED**. Six of 37 original chapters available; not the complete novel.
- **PASS (direct production V8):** 9 source/asset assertions, including complete 37-paragraph bilingual Chapter VI, 1,302 English words, 17 source-occurring terms, distinct offline SVG, theme and backup registration, script order and test syntax. This is not native Node/Android/Pad 5 validation.
- **Purposeful CI question:** do the new chapter, theme, browser fixture, Node regression and packaged APK work together in Android/Chromium? Source-only V8 cannot verify Gradle packaging or Chromium rendering. One targeted CI run is authorized.

- **FAIL (first Android CI):** [run 40236665237](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40236665237) stopped in Node content validation because the older Chapter V regression asserted the theme allowlist ended exactly at `exchange-gazette`. Adding the new valid theme changed that suffix; production chapter VI and direct V8 assertions passed separately. Fix the brittle old test and rerun; no APK was produced in the failed run.
- **PASS Android CI:** [run 40236765779](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40236765779) on functional source + test SHA `a6a353a16cc2eeeaa47d77cada79af33cfe72656`. Native Node tests, Gradle testDebugUnitTest + assembleDebug, required APK assets, and Chromium reader/word/theme journey succeeded after fixing the old Chapter V theme-tail assertion.
- **PASS exact English source comparison:** all 37 committed Chapter VI English paragraphs match the Standard Ebooks XHTML paragraphs after removing formatting markup; 37/37 aligned Arabic drafts present. **NOT TESTED:** independent human literary proofreading.
- **PASS independent APK verification:** downloaded Debug Artifact `12615222302`, extracted 4,341,845-byte APK, independently SHA-256 `2b12d325bc4a95ae3bac595c360a3a2c48b8362c0fd47f1125023589a3c9487d`, matching the CI checksum; Chapter VI and UI assets verified packaged. Screenshot Artifact `12615386751`.
- **NOT TESTED:** Xiaomi Pad 5 install, real RTL/TalkBack, audio, frame pacing, final signed release. Debug APK is not final.
- **NOT TESTED (historical first checkpoint; superseded by PASS above):** native Node tests, Chromium flow, Android Gradle, APK checksum, Pad 5 RTL/TalkBack/FPS and final acceptance. A build is justified to check full integration of 37 passages, asset packaging and browser chapter navigation, not routine compilation.
- No main writes, PR merge, paid API, microphone/TTS, other repositories or Library/Handoff changes.

## 2026-10-25 — LT-07 Chapter V / LT-08 Exchange Gazette art / LT-13 theme (validated)

- **Final tested PR-head SHA:** `e9affbf84d3a5a2c88ea0830e99b29aa6d7d4f2c`. The first targeted run failed only because the Chromium fixture still required four chapters; updated the fixture and reran the complete workflow.
- **PASS:** `tools/verne-towle-ch05.test.cjs` — 14 aligned English/Arabic paragraphs, 933 English source words, 18 source-occurring contextual entries, Chapter V-specific offline SVG, Exchange Gazette theme and backup allowlist.
- **PASS Android CI:** [run 40232066464](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40232066464) completed SUCCESS on the final tested SHA. Native Node content/regression tests, Gradle unit tests + Debug assembly, required APK asset checks, and Chromium full reader journey all passed.
- **Debug APK artifact:** `12613321921`; CI inner APK SHA-256 `52e065d99a08bea3f2f218508f964cf00c613c4c3d4d08b5833c4c394507dfea`. Artifact ZIP SHA-256 is separate and is not the APK hash. Independent APK re-hash NOT TESTED.
- **Content:** Chapters I–V of 37 are available offline. Chapter V is transcribed from Standard Ebooks' CC0 editorial edition; the English translation is public domain in the US, but territorial redistribution rights and independent Arabic literary proofreading remain NOT TESTED.
- **Device/final acceptance NOT TESTED:** Xiaomi Pad 5 installation, real frame pacing, RTL/TalkBack, audio-device acceptance and final signed release. This Debug build is not final.

### Independent Debug APK verification — Chapter IV milestone
- **PASS:** downloaded artifact **12609633627**, extracted 4,320,237-byte `app-debug.apk` and independently recalculated SHA-256 `62d7a0ed909df97c4ef5a4ab7ddc515e8ec4d84b6d0d3de60ed22bcad9bab294`, matching CI `APK_SHA256.txt`. Chapter IV script, reader index and contextual art are packaged. This supersedes the earlier pending independent-hash line for this run.
- **NOT TESTED:** installation, visual/performance/RTL/TalkBack on Pad 5, independent literary editing, final signing.

### Chapter IV targeted integration validation — 2026-10-25
- **PASS:** [GitHub Actions 40222789455](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40222789455) on code+fixture SHA `4b4763f39084b1ef4eb2825579ea5a1fe2b7da26`: Node literary/content/dictionary regressions, Gradle Android Debug compilation and unit tests, explicit Chapter IV packaged-asset check, Chromium library and full reader/word/translation/theme journey.
- **PASS (CI-calculated inner APK SHA-256):** `62d7a0ed909df97c4ef5a4ab7ddc515e8ec4d84b6d0d3de60ed22bcad9bab294`. Debug APK Artifact **12609633627**; screenshot Artifact **12609902605**. Independent artifact download and SHA-256 recomputation **NOT TESTED**.
- **PASS (source-bound):** Chapter IV 43/43 exact English paragraphs, 942 words, 43 Arabic companion draft passages, 14 source-occurring contextual expressions, offline Charing Cross SVG, Midnight Platform theme/settings/backup.
- **NOT TESTED:** actual Xiaomi Pad 5 installation, frame pacing, TalkBack, independent Arabic proofreading, territory-specific rights clearance, final signed release. Four of 37 chapters; never mark LT-07 complete.

## 2026-10-25 — LT-07 Chapter IV / LT-08 Charing Cross art / LT-13 Midnight Platform
- **Production SHA:** `de0b6b563273403ecfac6e41de032000f5c37a50` (first functional commit); browser fixture/workflow repair in this follow-up. PR #1 only.
- **English:** all 43 original paragraphs / 942 words of Towle Chapter IV copied from the Standard Ebooks source and checked paragraph-by-paragraph (43/43 exact after XHTML tag/whitespace normalization).
- **Arabic:** 43 newly written aligned draft translations; **independent editorial proofreading NOT TESTED**. Four chapters of 37 available, never claim a complete novel.
- **Contextual learning:** 14 source-occurring new expressions, offline original Charing Cross rainy station SVG, new distinct Midnight Platform dark iron-and-lamplight theme with Settings/backup integration.
- **PASS (direct production V8):** loaded real chapter I–IV and offline art scripts; 4 chapters, 43 Chapter IV paragraphs, 60 total edited contextual entries, unique SVG for Chapter IV. Compared all 43 source English paragraphs to upstream.
- **FAIL then repaired:** [CI 40222614783](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40222614783) passed Node/Gradle/APK packaging but failed browser smoke due to stale fixture requiring exactly three chapters. Fixed fixture and explicitly required Chapter IV in APK assets; rerun pending.
- **NOT TESTED:** new CI after repair, independent APK artifact hash, Pad 5 install/RTL/TalkBack/FPS, human Arabic literary review, rights by territory and final release. A browser smoke is not a device test.
- **Build rationale:** Source V8 checks cannot verify Android asset packaging, Chromium reader flow and the full Node suite; this chapter/theme integration warrants a targeted CI build.

## 2026-10-25 — Complete bilingual Towle Chapter III, itinerary, art and distinct theme

- **Production:** complete Chapter III of the authentic Towle 1873 English
  translation, 65 original prose paragraphs + eight-leg itinerary as one
  extra aligned entry; 66 new Arabic draft passages, 1,980 English words,
  18 new source-occurring contextual terms, bespoke offline Reform Club SVG,
  and distinct `Reform Club Brass` theme wired into Settings and backup.
  Reader now has **3 of 37** authentic chapters, not a finished novel.
- **PASS direct V8 production:** all three scripts loaded in order; 66 aligned
  English/Arabic entries, itinerary, term occurrence and offline illustration.
- **FAIL initial CI:** [run 40217571565](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40217571565)
  on SHA `8e1e5a78aef9edd8ca52d708aaec8597164e3baf` reached Node
  regression but failed due to an overescaped test-only whitespace regex.
  Corrected regex and Arabic Unicode test in SHA
  `00b206fb8386777e683ca3255b1898259be0c2d0`.
  [CI 40217753579](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40217753579)
  **PASS (completed)** on source SHA `00b206fb8386777e683ca3255b1898259be0c2d0`: Node regressions, Android Gradle Debug build, APK offline asset check and Chromium reader journey.
- **Build question:** does the new authentic chapter, theme, SVG and registration
  survive the entire Node/Android asset packaging/Chromium reader pipeline?
  Direct V8 source tests cannot establish APK integration.
- **PASS (CI-calculated inner APK SHA-256):** `47fb8906def0eca5d80e4c9e9a7a408a05b9b42daf7ef453a8031a7cffd1dee8`; Debug artifact **12607598645**, screenshots **12607219655**. **PASS independent ZIP extraction and APK SHA-256:** downloaded artifact **12607598645**, extracted 4,310,321-byte APK and independently matched CI digest `47fb8906def0eca5d80e4c9e9a7a408a05b9b42daf7ef453a8031a7cffd1dee8`; confirmed Chapter III JS, offline art and theme CSS packaged. Pad 5 remains **NOT TESTED**.
- **NOT TESTED:** human Arabic proofreading, international distribution
  clearance, physical Pad 5 install/FPS/RTL/TalkBack, independently
  downloaded APK hash and final signed release. No claim of completion.
- Full edition/rights details: `docs/LITERATURE_PROVENANCE.md`.
  No `main` merge, no unrelated repository or Library/Handoff changes.

### Chapter II / Station Tickets targeted CI and independent artifact verification — 2026-10-25

- **FAIL (initial browser regression):** [run 40203765741](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40203765741) passed Node/Gradle/APK asset checks but failed a stale Chromium fixture expecting exactly one Verne chapter. Corrected fixture to require both chapters and two distinct contextual illustrations.
- **PASS (final targeted CI):** [run 40203941716](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40203941716) on functional SHA `052e33d826c389913ba5075f4f24833301c0b265`: Node tests, Android unit/Debug assembly, explicit chapter II APK asset gate, Chromium reader/word/translation/theme journey and screenshots.
- **PASS (independent ZIP extraction and SHA-256):** Debug artifact **12603021648** contains `app-debug.apk` (**4,292,268 bytes**) with CI SHA-256 `146831a519894dec4a98ce286198429a90010dcc54a759d00971697658e15d91`; downloaded ZIP, independently recalculated APK digest and matched the CI checksum. Verified packaged `classic-verne-towle-ch02.js`, HTML registration, Station Tickets CSS and chapter II art.
- **Screenshot artifact:** **12602707519**; no independent visual review of screenshot contents or physical Pad 5 was performed.
- **NOT TESTED:** real Pad 5 install/upgrade/FPS/RTL/TalkBack, independent Arabic literary proofreading, territory-specific redistribution, remaining Chapters III–XXXVII and final release. Debug is test-only.

## 2026-10-25 — LT-07 authentic Verne Chapter II + contextual interior art + Station Tickets

- **Production:** complete Towle English Chapter II from the Standard Ebooks
  CC0/public-domain transcription, 11 original source paragraphs and
  **1,114 English words**, with 11 aligned original Arabic draft translations
  and 14 new source-occurring contextual vocabulary/idiom entries. App now
  contains **2 of 37 chapters**, not the full book. Existing chapter I, story
  ID, bookmarks, vocabulary and reading history remain in place.
- **Offline visual:** distinct locally drawn Victorian Saville Row interior
  (numbered wardrobe, synchronized clock) for chapter II; existing chapter I
  street illustration preserved. New Station Tickets theme uses railway
  tickets/platform signage and contrasting blue/cream/coral layout, integrated
  with Settings and backup; no remote art, fonts, audio or permissions.
- **PASS (direct production V8):** 11/11 English chapter paragraphs
  matched the upstream XHTML exactly after stripping HTML/typographic
  whitespace, 11/11 Arabic aligned, 14/14 new terms source-occurring;
  chapter load order, distinct offline SVG and theme/backup registration
  checked against fetched production files. **This does not certify the
  literary quality of the Arabic translation.**
- **Source commit tested:** `40d703b41c25003d3ba7b3326490d682fc77aa5c`;
  [Android CI 40203765741](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40203765741)
  **IN PROGRESS at checkpoint**. Node/Gradle/asset verification steps
  completed PASS; browser/screenshot/artifact steps pending. Do not claim
  whole CI or APK artifact PASS before run completion.
- **Purposeful build question:** can the two chapters, bilingual reader,
  new illustration, theme, backups and dictionary survive Node, Android
  packaging and Chromium navigation together? V8 alone cannot prove this.
- **NOT TESTED:** real Xiaomi Pad 5 installation, scrolling/frame times,
  screen-reader access, font/layout screenshots, independent APK rehash,
  literary Arabic proofreading, rights in each redistribution territory,
  Chapters III–XXXVII, final release. Debug is not final.
- **Safety:** Draft PR #1 only; no main merge, other repositories,
  Library/Handoff, paid API, microphone/TTS or private data.

## 2026-10-25 — LT-07 authentic Verne chapter I + LT-08 contextual art + LT-13 Saville Clockwork

- **Production:** bundled the complete authentic **1873 George Makepeace
  Towle English translation of Chapter I** of Jules Verne's *Around the
  World in Eighty Days*: 1,453 English words, 29 continuous bilingual
  English/new Arabic draft passage groups, 14 source-occurring contextual
  terms, one locally generated Victorian Saville Row SVG illustration.
  This is **Chapter I of 37**, NOT the whole novel or a synopsis.
- **Source provenance:** 1873 Towle translation from
  https://en.wikisource.org/wiki/Around_the_World_in_Eighty_Days_(Towle)/Chapter_1
  (Wikisource revision 13924990); Gutenberg ebook 103 lists US public-domain
  status. No Gutenberg trademark/images/modern translations are packaged.
  `docs/LITERATURE_PROVENANCE.md` records outstanding territory and
  independent Arabic literary editorial review; both remain **NOT TESTED**.
  Packaged source Git blob `4c2f137ba5eab8b5b3d4f1870acf33436cc92d4f`.
- **Design:** distinct **Saville Clockwork** offline book/reader theme
  (Victorian station/timetable geometry), registered in Settings and backup
  whitelist. The new contextual SVG is an original local vector scene, not
  a scraped/copyrighted image. No microphone, TTS, paid API or new permissions.
- **PASS (source):** direct V8 execution of production chapter and artwork:
  29 bilingual passages, 1,453 English words, 14 actual source-occurring
  contextual entries, packaged HTML registration, offline scene, Settings,
  theme CSS and backup integration.
- **PASS (native Node/Android/Chromium CI):**
  [run 40199465771](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40199465771)
  on functional SHA `2b923d67292d4645c3760ef6b6bccaf9b4994ca4`:
  new `tools/verne-towle.test.cjs`, existing dictionary/search/theme tests,
  Gradle `testDebugUnitTest` and `assembleDebug`, APK offline assets
  including the new classic, Chromium library and full reader/word/translation
  journey **PASS**. Debug APK Artifact **12600997230**, screenshot Artifact
  **12600857797**. CI-calculated APK SHA-256:
  `84419a3a1d9cbc673468a060b4e5c3a7b274d5e2c609030ff5b2dc5ab884e4ab`.
- **Repair evidence:** initial run 40199170622 **FAIL** on a brittle
  backup theme assertion, corrected in `tools/phrase-lookup.test.cjs`.
  Follow-up run 40199293266 **FAIL** on hard-coded 37-story Chromium fixture
  counts, corrected to require 38+ and the current catalog count, plus
  explicit Verne chapter/art checks. Final run above **PASS**.
- **NOT TESTED:** independent APK download/rehash, Xiaomi Pad 5 installation,
  upgrade/reader frame times, actual visual/crop and TalkBack inspection,
  Arabic editorial accuracy, remaining 36 Verne chapters, territory-specific
  copyright review and final signed APK. Source/CI PASS is not device PASS.
- **Build rationale:** JavaScript/Node alone cannot prove new chapter/assets
  were packaged in Android or that the expanded catalog still works through
  Chromium; one purposeful Android validation was needed. Intermediate
  commits' runs were cancelled by CI concurrency.
- PR #1 remains Draft, no `main` write/merge; no other repositories or
  ChatGPT Library/Handoff modified.

## 2026-10-25 — LT-07 long-form editorial correction cache milestone

- **Production:** `LinguaLookup` now refreshes same-length word/idiom edits when a content importer increments `story.lexiconRevision` or `dictionary.lexiconRevision`, with explicit `LinguaLookup.invalidate(story)` for importers without revision counters. Existing O(1) per-tap cache check remains; no full dictionary scan on every tap.
- **Production:** bilingual chapter-search cache tracks `story.searchRevision` and `chapter.searchRevision`, plus explicit `LinguaShell.invalidateChapterSearch()`. A corrected Arabic translation or English paragraph can be reindexed even when chapter/paragraph counts do not change. Existing original reader text, translations and bookmarks are untouched.
- **PASS (production V8):** executed actual `lingua-lookup.js` and `lingua-shell.js` with initial, same-length revision, and explicit invalidation scenarios. Added Node regressions to `tools/phrase-lookup.test.cjs` and `tools/chapter-search.test.cjs`.
- **NOT TESTED:** complete Node/Android CI on this milestone, Pad 5 real search latency, reading performance, accessibility and editorial quality of longer books. Real licensed full-length classics and recordings remain open.
- **Targeted build question:** do the updated production JS modules and regressions pass the existing Android/Node packaging workflow without breaking the offline dictionary or reading journey? Source V8 alone cannot establish the complete APK packaging and browser smoke. One CI validation run is justified; this is **not** a final APK release.
- **Status:** IN_PROGRESS; PR #1 Draft, no main merge or unrelated repository/Library/Handoff writes.
- **Additional regression fix:** the existing phrase test incorrectly dereferenced `boundary.entry` for a partial-token lookup that correctly returns `null`; fixed the assertion to match production contract. **PASS:** both complete committed `phrase-lookup.test.cjs` and `chapter-search.test.cjs` executed in V8 using Node compatibility shims, against the actual PR production modules. Native Node/Android CI remains NOT TESTED until a matching run completes.
- **Targeted CI checkpoint:** latest corrected test and source must pass together; this non-skip checkpoint is intended to validate the fixed regression in Android CI, not to request a routine build or final APK.

## 2026-10-25 — LT-07 bilingual in-book passage search + LT-13 Moonlit Margins
- **Production:** offline English/Arabic paragraph search across all loaded story chapters, lazy corpus index (not built on library launch), 170 ms input debounce, 2–80 character query bound, max 40 results, exact source snippets, direct chapter/paragraph navigation through existing reader/history pipeline. No network, invented glosses or changes to English/Arabic literary text.
- **UI:** a separate accessible chapter-search dialog, keyboard focus/escape, original English and Arabic passage excerpts, and a new **Moonlit Margins** night bookbinder theme with book-spine cards, double-border hero and bookplate reader; settings/backup theme whitelist updated. Background library is now inert during search, restored on Escape/outside tap/close/result jump; pending search timer is canceled. Native Chromium flow assertions were added for dialog cleanup and bilingual corpus results.
- **PASS (source/V8):** production shell parsed after fixing duplicate declaration; executed actual shell with mock catalog and DOM: English and Arabic lookup, empty/short query refusal, direct paragraph jump and theme activation succeeded. Committed Node regression: `tools/chapter-search.test.cjs`.
- **PASS (native Node + Android CI):** [run 40177935015](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40177935015) on functional SHA `7da65d2e350b56547434fd56f0d885c77be091a4`: native `chapter-search.test.cjs`, all content regressions, Gradle Debug build, required assets/adaptive icon and Chromium flow including bilingual search/modal Escape. Debug APK artifact **12592818634**, screenshots **12592683800**; inner APK SHA-256 calculated in CI `68e7598e2d6c8ff4769518cd8b55c21f8403dcbe9add9561749be7a20bfad3df`.
- **PASS (independent artifact rehash):** downloaded Artifact `12592818634`, extracted `app-debug.apk` (4,262,992 bytes), independently computed SHA-256 `68e7598e2d6c8ff4769518cd8b55c21f8403dcbe9add9561749be7a20bfad3df`, matching CI `APK_SHA256.txt`; verified packaged search/theme JS/CSS, novella asset and adaptive launcher resource. This does **not** establish physical-device behavior.
- **NOT TESTED:** real Pad 5 search scroll/focus/RTL/latency and TalkBack, editorial full-length literature and professional Arabic translation, recorded licensed audio, final LT-07/LT-13 acceptance.
- **Build question:** does the new search/theme work under native Node and Android WebView packaging, and do existing reader journeys remain intact? V8 mocks cannot verify DOM/browser integration; one targeted Android CI build is justified.
- **No final release:** PR #1 remains Draft; no `main` writes, no Handoff/Library changes.

## 2026-10-25 — LT-08 inline illustration geometry and offline failure fallback
- Production change: `reader-experience.js` reserves a bounded optional aspect ratio (0.5–3.5), applies explicit opt-in cover crop with bounded focal coordinates (0–100%), and removes missing offline images instead of leaving broken icons. Remote paths remain rejected; existing Arabic translations and paragraph anchors remain untouched.
- Regression: `tools/inline-illustrations.test.cjs` now exercises valid/invalid geometry, safe focal points, missing-image cleanup and the existing allowlist; Android CI workflow now runs this test.
- **PASS (source/V8):** executed the committed regression script against the committed production reader in a V8 Node-compatible harness; 19 assertions passed. This is not a real Android WebView rendering test.
- **PASS (native Node/Android CI):** run 40173776262 on source/test SHA `328d64932564968da98876b268ac41bc3855c85b`; native Node inline-art regression, Android compilation, APK asset/adaptive-icon checks and Chromium reading journey succeeded. Debug Artifact `12591955199`; APK SHA-256 **calculated by CI** `32db36f07c7ff2fffb24317776aabd24e8b4cfabee09500f29cd7d9a3d9bee97`.
- **NOT TESTED:** independent artifact download/SHA verification, visual crop/focal behavior, offline image-error behavior, frame stability and TalkBack on Xiaomi Pad 5, full LT-01..LT-13 acceptance. Debug APK is not a final release.
- **Build question:** does the full Node/Android workflow compile and package the changed reader and pass the actual regression under native Node? Static/source checks cannot establish packaging or WebView behavior. One targeted CI run is justified, not a final release.
- **Status:** IN_PROGRESS; PR #1 remains Draft; no main merge, no Handoff/Library access.

# StoryLens — Autonomous acceptance evidence

## 2026-10-24 — Strict UTF-8 import for offline SAF backups (source-only)
- **Production commits:** `afd50fd9ab12ee6bd0684bb16b2b861398cc67f2` (decoder), `eab6efc0cde9456be0491a08074a99e949d11b6f` (native wiring); **test commits:** `4817fd7ae608127aa9b5f71980dab2bd6eef4d48`, `adf61b9f2fcb5aef69e003eccc08ef1e2b929123`, `c453befa539a9a0e8d86fa106072a01bbecabdb8` (draft PR #1 only).
- **Fix:** Android Storage Access Framework import now strictly decodes UTF-8 and rejects malformed, truncated, overlong or surrogate byte sequences instead of silently replacing invalid bytes and potentially corrupting saved words. Optional UTF-8 BOM is stripped before JSON validation. The existing import size cap and confirmation gate remain.
- **PASS:** Compiled the exact new pure-Kotlin `BackupUtf8.kt` helper with `kotlinc` and ran 6 JVM assertions (multilingual round-trip, BOM, four malformed sequences). Fetched the committed helper, Android caller, JUnit test and Node contract test from the PR branch; five static integration assertions passed. **FAIL:** 0 in these checks.
- **NOT TESTED:** Running committed JUnit through Android Gradle, complete Node suite, Android SAF picker and import on physical devices, final launcher icon, offline/performance tests, APK and SHA-256. Static contract checks are not Android runtime tests.
- **Build policy:** all commits `[skip ci]`; no APK or Actions build requested, no `main` modification, no merge. Final APK remains deferred.

## 2026-10-24 — Review-card SRS backup integrity (source-only)
- **Production commit:** `14ac316c9878ba8f7cf4892e4fcde9a6b9aba72f`; **regression commit:** `86e826c64ce1eb904c663e559371f3168bfc4a6f` (draft PR #1, no main modification).
- **Fix:** Import/export of learning cards now checks optional SRS scheduling fields (`dueAt`, `intervalDays`, `ease`, `repetitions`, `lapses`) for finite, bounded numeric types. Rejects malformed `surface` and blank terms. Older cards with missing SRS fields remain valid. This prevents corrupted due timestamps from silently hiding scheduled reviews.
- **PASS:** 9 checks against modified production JavaScript in V8, covering legacy/current cards and seven invalid inputs. Added matching Node regression cases to `tools/data-backup.test.cjs`.
- **FAIL:** 0 in the 9 executed isolated checks. **NOT TESTED:** executing the complete Node test file, full source test suite, Android Gradle/lint, on-device backup/restore and SRS scheduling, approved launcher icon, performance, offline field testing, final APK and SHA-256.
- **Build policy:** commits include `[skip ci]`; no APK or workflow build requested. Final build deferred until requirements complete.


## 2026-10-24 — Concurrent Android file picker protection (source-only)
- **Production commits:** Android SAF host `28cf730b298511ad41d33af50d712d45aecf6f87`; localized feedback `790c818f5fe0774c47c18b66230526860dc74799`; **regression commit:** `170fe16ffc8594dee0b1d0a349e94c75787e0a45` (Storylens PR #1 only).
- **Fix:** Import/export now share one guarded Storage Access Framework picker. A second action cannot overwrite a pending backup payload; canceled or failed picker launches release the guard, and an export callback without retained bytes reports failure instead of success. Arabic and English users receive a specific busy status.
- **PASS:** Executed the updated production `data-backup.js` in V8 with a fake DOM; validated busy/saved statuses in English and busy in Arabic. Four static assertions confirmed both picker entry guards, callback/failure cleanup and the committed test assertion (7 checks total).
- **NOT TESTED:** Running the committed full Node suite, Kotlin Android compilation, concurrent picker behavior and lifecycle recreation on a real device, backup SAF interoperability, performance, icon, offline device, APK and SHA-256.
- **Build policy:** All commits `[skip ci]`; no Actions build dispatched; `main` unchanged. Single final APK build deferred.


## 2026-10-24 — Offline WebView fail-closed routing and bilingual SAF callbacks (source-only)
- **Production commits:** Android host `e485d01f8e86979605626987082afcb03ec49725`; JS backup UI `a3856922ef9ad2c7d4987fbe74c2ce0f5b73f5b1`. **Regression commits:** `8b14dd23c8df954fbbbc4358c7ebc92d68d79f24`, `72554e75a1fbe41ae186e3eabee3d93e32cebc13`, draft PR #1 only.
- **Change:** WebView explicitly returns HTTP 403 for off-origin or missing APK assets rather than falling through to WebView networking; top-level navigation is limited to local `/assets/`. Android Storage Access Framework export/import reports fixed status codes rendered in the chosen Arabic/English UI language; legacy backup keys, schema, app ID and offline permission policy unchanged.
- **PASS:** Ran production `data-backup.js` in V8 with mocked storage/DOM and checked four English statuses, Arabic success, and unknown-code rejection (6 cases). Production JS and both committed Node test files parsed in V8; static assertions verify native status dispatch and fail-closed asset routing. No Android runtime implied.
- **NOT TESTED:** Native Node execution of full regression scripts, Android/Kotlin compilation, SAF save/import on real device, WebView request interception behavior on Pad 5, physical offline test, approved icon, LT-01..LT-13 full gates, APK, SHA-256 and performance.
- **Build policy:** All commits `[skip ci]`; no GitHub Actions build dispatched, no APK generated, `main` untouched. Final single APK build remains deferred.


## 2026-10-24 — UTF-8 quota rollback safety (source-only)
- **Production SHA:** `fefafc0207970863f818086821f842b3a4e0a4b7`; **regression SHA:** `7877943cb45847c6cf9218ad8ba2d8856c4314fe`, draft PR #1; `main` untouched.
- **Fix:** Storage-quota rollback now sorts restoration by actual UTF-8 byte deltas rather than UTF-16 JavaScript string lengths. Emoji/CJK values can reverse which restore operation frees space; incorrect ordering could previously leave saved words unrestored after a failed import.
- **PASS:** Executed the actual modified production backup module in V8 with a UTF-8-byte-limited localStorage mock. A three-key import fails at quota and all three original keys are restored; the test covers emoji vs ASCII byte-order inversion. Added the same regression to `tools/data-backup.test.cjs`.
- **NOT TESTED:** Running the committed full Node test suite, Android WebView/SAF quota behavior, real device backup/restore, APK, performance, full LT-01..LT-13 gates and the final approved icon. No Actions or APK build.
- **Build policy:** All commits `[skip ci]`; 0 PR-triggered workflow runs associated with the regression SHA when checked. Final one-time APK build deferred.


## 2026-10-24 — LT-06 bilingual reader semantics and continuation controls (source-only)
- **Production SHA:** `898fca0f641f2be7c2d5abcbb1d39409553971fa`; **test SHA:** `bf73cdeef7522e95cb635884acf904f4f7b0bb2c`, PR #1; `main` unchanged.
- **Fix:** Continue-reading CTA and empty-library invitation now follow Arabic/English UI locale. English source sentences/chapter title are explicitly tagged `lang=en` / LTR even in Arabic UI. Inline, long-press and full-page Arabic learning translations carry `lang=ar`; source content, progress keys and backup format unchanged.
- **PASS:** Executed the committed reader regression script against committed production JS inside a V8 CommonJS/VM compatibility harness (chapter/bookmark navigation, English/Arabic content-language attributes, long-press translation, interface controls). Also executed the production library wrapper with mocked DOM in Arabic and English; localized continue CTA and English empty-state invitation PASS.
- **NOT TESTED:** Native Node regression suite, complete i18n audit, Android WebView/TalkBack pronunciation, physical device, APK, launch/exit animation performance, final icon and LT-01..LT-13 end-to-end acceptance.
- **Build gate:** source-only `[skip ci]` commits; no APK build or Actions dispatch. Exact approved icon with text still unavailable as repository asset; do not substitute an invented design.

## 2026-10-24 — Backup quota-safe rollback and malformed card-field rejection (source-only)
- **Production commit:** `58a9f540e45eb26d82f7d72202ec6d7e2e1f0a5b`; **regression commit:** `fd395a46e8127bd5f1fa67ac224a4a4eb3d95f0b` on draft PR #1; `main` unchanged.
- **Fix:** On a storage-quota failure during import, rollback now restores smaller previous values and removes newly created keys before restoring larger old values. This avoids losing previously saved words when a forward-order rollback itself exceeds quota. If rollback cannot finish, the user receives an explicit data-safety warning. Optional saved-card fields now reject numeric/boolean values while retaining absent/null/string compatibility.
- **PASS:** Actual modified production JavaScript parsed and executed in V8 against a byte-limited localStorage mock. Import failed on the third write, all three original values were restored, and a malformed numeric card meaning was rejected. Regression assertions were committed to `tools/data-backup.test.cjs` and its syntax parsed.
- **NOT TESTED:** Full Node test suite, committed regression script under Node, Android SAF quota behavior, physical device, APK, performance and offline acceptance. No APK or GitHub Actions dispatched.
- **Outstanding:** Approved icon source not available in this run; do not invent replacement. LT-01..LT-13 and device gates remain IN_PROGRESS.


## 2026-10-24 — Reader accessibility: preserve spoken story text (source-only)
- **Production SHA:** `b90e164678903dc98153b94c22c7a15afea5b067`; **regression SHA:** `9234fd21681fb8e9d43aacc2dd696b868b0ea891` (draft PR #1; `main` untouched).
- **Fix:** Replaced generic per-sentence `aria-label` with `aria-description` in `reader-experience.js`. An `aria-label` masks the actual English sentence for screen readers; the optional instructions now accompany, rather than replace, the source story text. Arabic translations remain unchanged.
- **PASS:** Executed the committed reader, bookmark-navigation and inline-illustration regression scripts in a V8 CommonJS/VM compatibility harness using the actual committed production source (3 scripts). Production JavaScript and regression script syntax parsed successfully.
- **NOT TESTED:** Native Node.js execution of the full suite, Android TalkBack behavior, Android packaging/installation, actual sentence pronunciation by screen reader, performance and offline device QA. V8 compatibility is not a device accessibility test.
- **CI policy:** `[skip ci]` commits; 0 PR workflow runs reported for regression SHA when checked. No APK created or Actions build dispatched.
- **Open:** LT-01..LT-13 remain incomplete; user-approved icon asset is not yet integrated. No Library/Handoff access.


AUTOMATION_COMPLETE: IN_PROGRESS

## 2026-10-24 — Backup consistency and bilingual control hardening (source-only)
- **Production commit** `cb5a71fc8e1012ed293bda78abd800a627f16b02`; **test commit** `84a8e307e81bdca4eb1f8e2cbd82d1c5011728ac` (PR #1, no main write).
- **Fix:** `data-backup.js` now refuses exports with more than 900 valid keys instead of producing a JSON archive its own importer rejects; English interface shows English Backup label/accessibility name; a superseded/invalid backup preview revokes its old confirmation button, preventing accidental restoration of another snapshot.
- **PASS:** 6 direct V8 executions of the modified production backup module: English button and accessibility label, valid backup export, >900-entry export refusal, valid preview, stale confirmation refusing to mutate, latest confirmation restoring the intended snapshot. Test file JavaScript syntax checked in V8.
- **NOT TESTED:** full Node regression suite (`node tools/data-backup.test.cjs`), Android CI, APK packaging, actual SAF import/export, physical device upgrade and independent recheck. Node regression assertions were committed but **not executed** in this run.
- **Build policy:** all new commits carry `[skip ci]`; no build or workflow dispatch requested. PR head at source/test checkpoint `84a8e307` had no PR workflow runs when checked. The existing PR workflow assembles an APK, so source-only commits must continue to skip it until final acceptance.
- **Outstanding:** exact user-approved **icon with its text** must be separated from the approved visual reference and integrated as Android launcher resources; do not substitute an invented icon. LT-01..LT-13 and real-device acceptance remain IN_PROGRESS.


## 2026-10-23 — New user-requested Lingua Tales plan (documentation only)
**No app code, icon, animations, localization or performance change was implemented in this planning update.** The screenshot is a visual reference; see `docs/LINGUA_TALES_REBRAND_UX_PERFORMANCE_I18N_PLAN.md` for detailed acceptance gates.

| New requirement | Status | Evidence needed in future development runs |
|---|---|---|
| LT-01 Lingua Tales launcher/in-app rebrand and retained data | NOT TESTED | Code + migration/upgrade tests and on-device labels |
| LT-02 smooth story open **and close** animations | NOT TESTED | Actual UI change, navigation regressions, repeated open/close device evidence |
| LT-03 card-paint optimization / measurable performance | PASS (source/CI); NOT TESTED (device) | Scoped blur/animation reduction and lazy card painting verified in CI at `e64732a206d56c0ae4bcdf5350a6933041f53276`; no Android FPS/RAM baseline or visual parity measurement yet |
| LT-04 modern distinctive Android adaptive icon inspired by Wen Sarafet design quality | NOT TESTED | Icon assets and real launcher mask/theme inspection |
| LT-05 reduced marketing metadata/clutter without loss of features | PASS (source/browser CI); NOT TESTED (device) | Simplified homepage with hero metadata removed, cards prioritized; CI run 39972837571 screenshot artifacts |
| LT-06 complete Arabic/English app UI language toggle; keep English story/Arabic translations | NOT TESTED | i18n catalogs, RTL/LTR, offline save/restore and bilingual flow tests |

## 2026-10-23 — LT-03 paint budget (production code + test, not device benchmark)
- **Production:** `app/src/main/assets/liquid-aurora.css` now disables repeated live `backdrop-filter` and card-reveal animations only on library shelf cards; replaces them with a translucent gradient retaining Liquid colors, cover art, hover transforms, hero/orb and modal glass. Uses `content-visibility:auto` with approximate intrinsic card size to skip offscreen card paint in compatible WebView. This is a targeted potential jank reduction, **not** a measured FPS improvement.
- **Regression:** `tools/library-experience.test.cjs` asserts scoped paint override, gradient/cover retention and reduced-motion support; existing library, reader, offline dictionary and browser flow tests still run.
- **PASS (CI on exact source+test SHA `e64732a206d56c0ae4bcdf5350a6933041f53276`):** [Actions run 39962712916](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/39962712916), job `120444495073`, confirmed log `PASS: LT-03 scoped card paint optimization retains Liquid visuals and reduced-motion support`, `BUILD SUCCESSFUL`, reader/browser journey PASS. APK artifact ID `12504174717`, screenshot artifact ID `12505351887`.
- **NOT TESTED:** Xiaomi Pad 5 FPS/frame timing, RAM/CPU, user-perceived scroll jank, side-by-side screenshot review, repeated story open/close animations, RTL/i18n. Mark LT-03 fully PASS only after same-device baseline and improved measurements.
- **Next:** LT-02 open/close transitions with reduced-motion and state/scroll preservation; do not add expensive animation layers.

## 2026-10-23 — Reader navigation regression (production + tests)
- **Production fix:** `app/src/main/assets/reader-experience.js` now routes chapter picker and bookmark jumps through the live `renderReader()` enhancement chain instead of bypassing it with the captured base `originalReader()`. This restores sentence keyboard focus, long-press sentence translation, bookmark marker, saved read progress, and later reader preferences after navigation. The fix is independent of dictionary edits and stays in existing PR #1.
- **Regression:** `tools/reader-experience.test.cjs` runs the real enhancement script inside a deterministic Node VM, checks both navigation paths, sentence accessibility, translation listener binding, progress persistence and scroll restoration. CI workflow executes it before APK packaging.
- **PASS on source+test SHA `f8bfdd99f2d69d9684783b588dbcaabbf2e1fd4e`:** [GitHub Actions run 39954824587](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/39954824587), job `120417924749`, verified log contains `PASS: chapter and bookmark navigation preserve enhanced reader accessibility, translation and progress`. Gradle unit tests, Android Debug APK build, APK asset verification and browser UI flow also succeeded. Artifact `StoryLens-Debug-APK` ID `12502321256`, screenshots ID `12502191746`.
- **NOT TESTED:** physical Android installation, process death, TalkBack accessibility, actual long-press gesture on Xiaomi Pad 5, all content translations, visual fidelity to approved screenshot. The Node VM regression is not a physical-device test.
- **Remaining:** continue auditing inflected idioms and dictionary coverage, curate full story catalog, test offline reading/saved vocabulary/backup on Android, then independent acceptance recheck. No auto-merge or public release.


Last source review: 2026-10-23 (branch `automation/storylens-dictionary-saved-words-20261023`).
Production code changed in this iteration: **YES** — `app/src/main/assets/index.html` and `tools/build_freedict.py`.
Base reference: `main@c2117c5ca1a09afb8e923770857aa0dbfc777f20`.
Verified PR CI for source+tests at `2a3dc0ec1fa6b26336488d70c20e446a9f8a5bc9`: https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/39947411826 (SUCCESS, 2026-10-23). APK artifact #12498568304 and UI screenshot artifact #12498254394 uploaded. Later documentation-only commits require checking their own CI status; no on-device tests.
This record does not assert any physical Android verification.

| Requirement | Status | Evidence / limitation |
|---|---|---|
| Offline English–Arabic dictionary available in APK | PASS (CI packaging) | Verified pinned FreeDict 0.6.3 generated, syntax/functional tests passed, and dictionary + license found in PR APK, run #39947411826. Physical Android launch NOT TESTED. |
| Show up to two distinct dictionary senses where present | PASS (CI) | `python3 tools/test_freedict.py` and `node tools/freedict.test.cjs` passed in run #39947411826. Ordering follows source, not frequency. |
| Never confuse dictionary gloss with verified story-specific sense | PASS (CI) | `node tools/lexicon.test.cjs` executed actual word-sheet rendering for curated, generic, and unknown words, run #39947411826. Human review of all story contexts NOT TESTED. |
| Saved vocabulary retains meaning and original sentence translation | PASS (CI) | `node tools/lexicon.test.cjs` exercised saved cards, dictionary lookup, source sentence and translation rendering, run #39947411826. Android process-death restoration NOT TESTED. |
| Idiom/phrase longest match | NOT TESTED | Existing code examined; broader device and inflection cases still need coverage. |
| Offline story and sentence translation | PASS (base content only) | Existing paired English/Arabic paragraphs and no INTERNET permission in base. No human translation audit of all paragraphs. |
| Full 120-story professionally edited collection | FAIL | Base catalog 24 stories, target 120; editorial review outstanding. |
| Liquid Aurora fidelity and phone/tablet UI | NOT TESTED | Screenshot reference and on-device visual comparison not completed in this iteration. |
| Offline save/review/backup recovery | NOT TESTED | Unit regressions exist; Android cold start, process death, backup/restore and upgrade migration not tested. |
| Android APK builds and installs on Xiaomi Pad 5 | PARTIAL | PR Android unit tests + assembleDebug and packaged assets PASS at run #39947411826, APK artifact #12498568304. Physical install and runtime NOT TESTED. |
| Security, accessibility, performance, rotation and negative cases | NOT TESTED | Require full independent end-to-end QA. |

Next action: obtain physical Android installation/reader tap/save/restart evidence for artifact #12498568304, then quantify remaining missing story-word glosses from the generated FreeDict pack and audit real contextual senses. This documentation update is not a new feature implementation. Do not claim release ready without physical Android install + independent recheck.

## 2026-10-23 — Additional approved requirements (roadmap only)
**Production code changed by this administrative update: NO.** GitHub roadmap file `docs/LINGUA_TALES_REBRAND_UX_PERFORMANCE_I18N_PLAN.md` is the source of truth for detailed acceptance.

| Gate | Status | Future acceptance evidence |
|---|---|---|
| LT-07 real medium/long fiction; new reviewed batches, faithful public-domain edition verification and contextual Arabic translation | NOT TESTED | Chapter inventory, source/license records, editorial and dictionary tests |
| LT-08 in-reader context-matched images with legal source/asset provenance and attractive focal-point cropping/feathering | NOT TESTED | Image catalog, chapter anchors, offline mobile screenshots and performance |
| LT-09 category drawer at Arabic right/English left and corresponding edge swipe, without homepage clutter | PASS (source/VM/browser CI); NOT TESTED (device) | RTL/LTR swipe + Escape tests; categories, levels, sort, actions in drawer; run 39972837571 |
| LT-10 centralize theme controls in Settings | PARTIAL PASS (source/CI); NOT TESTED (device) | Theme gallery and offline persistence implemented; audio/fonts/language settings still pending |
| LT-11 optional playback-only UI effects and ~20 licensed music/nature ambiences; no microphone or TTS | NOT TESTED | License/asset audit, audio-focus, background, offline and CPU/RAM checks |
| LT-12 selectable separate Arabic/English fonts and typography | NOT TESTED | RTL/LTR readability, licensed assets and preserved state |
| LT-13 each substantive development/content batch adds one *genuinely visually different* functional theme, not just a palette shift, while runtime remains smooth | PARTIAL PASS (source/CI); NOT TESTED (theme visual/device performance) | Paper Atlas editorial layout, static compass, warm paper cards; run 39972837571; no Pad 5 FPS/RAM or Paper Atlas screenshot yet |

A plan or screenshot is **not** proof of implementation, and not every small hourly task automatically creates a theme. Track real batched deliveries, with standalone independent recheck when all features are satisfied.


## 2026-10-23 — LT-05 / LT-09 / LT-10 / LT-13: production shell and distinct Paper Atlas
- **Production source SHA:** `ccc8da7a5ba9c5aef5db2173227af6e4323f7fe7` on existing draft PR #1. Added `lingua-shell.js` and `lingua-shell.css`; wired after backup/library/reader wrappers in `index.html`; `library-experience.js` rehomes refreshed discovery controls into the menu; `data-backup.js` accepts `paper-atlas` theme in validated backups.
- **LT-05:** removed redundant brand copy, marketing metrics, repeated descriptions and oversized home controls, preserving cards, reader, offline words, review and backup behind the menu. Browser screenshots show a shorter, content-first library.
- **LT-09:** category/genre drawer opens at top-right in Arabic and top-left in English (based on HTML dir), with corresponding right/left edge swipe, reverse swipe, backdrop click and Escape; favorite/level/sort/search and learning actions remain functional. Tests check directional swipes, closed-drawer inert state, rehome hook and no repeated move.
- **LT-10:** theme picker moved to a dedicated Settings overlay; selection persists in the existing `storylens_uiTheme` key, and old themes remain selectable. Other Settings modules (fonts, language, audio) are **not implemented**.
- **LT-13:** new **Paper Atlas** theme changes page geometry, editorial card orientation, header and hero layout, compass ornament and warm paper palette; not a hue-only swap. Static CSS art avoids animated full-screen filters. **No device performance evidence** yet.
- **PASS GitHub CI on exact production SHA:** [Actions run 39972837571](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/39972837571) completed successfully: Node regression (`PASS: Lingua Tales shell RTL/LTR swipe, theme persistence, backup and Paper Atlas layout gates`), offline dictionary/content tests, Gradle unit tests and Debug APK, browser flow smoke and library/reader/backup screenshots. APK artifact **12509033991**, screenshots **12509473831**. Earlier APK at run 39971652217 was unpacked locally and verified to contain `assets/lingua-shell.js` and `assets/lingua-shell.css`; the latest run's artifact has not yet been unpacked in this record.
- **Additional isolated V8 execution:** actual `lingua-shell.js` verified with RTL swipe, rehome-once, persisted theme, no unknown theme and Escape; **not a substitute** for Android gesture/device tests.
- **NOT TESTED:** Xiaomi Pad 5 visual parity and real FPS/RAM/CPU, Android physical system back, full English locale switch (LT-06), Paper Atlas screenshot at selected theme, all 20 audio assets, fonts, story animations, long books and inline images. No claims of fully completed app or independent second-pass verification.
- **Next:** implement LT-02 story open/close animations preserving scroll/back-stack and reduced-motion, then full LT-06/12 localization/fonts; continue a genuinely different theme per next substantial batch and measure device performance.


## 2026-10-23 — LT-02 reader transitions and second distinct theme
- **Actual production source** on draft PR #1: `lingua-shell.js` now wraps the existing reader open/back path with a cancellable 190ms composited entrance/exit, native same-document history Back handling with a bounded WebView fallback, saved reader chapter scroll and restored library scroll. The system-back handler first dismisses an open modal; translation Back returns to the reader. `prefers-reduced-motion` disables motion. No reader content/lexicon/SRS keys were changed.
- **New LT-13 theme:** **Midnight Library**, fully selectable alongside Paper Atlas/Nebula/Aurora/Aqua. Unlike Paper Atlas, it uses ink-blue and brass, static bookshelf rails, narrow book-spine cards, a centered illuminated title plate and a dark reading treatment. No per-frame particles or live card blur. Offline backup validator accepts `midnight-library`.
- **Source/test commit SHA:** `32f0759628154dc057122e6b03e6357145b76e95`; preceding production commits `cc932ce07a8a7375cc44b52135e6d51a40ca18a6` (navigation/theme registry), `a1871e4d39ead05712f8c06ebc29cd2cc811b7f3` (CSS), `c30f496318aa739e6339ed8a8f3139289f8ebb97` (backup).
- **PASS CI on exact source/test SHA:** [GitHub Actions run 39980833626](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/39980833626) completed success: verified dictionary, offline catalog/JS including production navigation VM (rapid double-back, scroll restoration, modal back, reduced-motion), Gradle Debug APK, packaged-asset checks, Chrome smoke and screenshots. APK artifact **12512897827**, screenshots artifact **12513302194**.
- **LT-02 status:** **PARTIAL PASS (source/CI)**; **NOT TESTED** on real Android system-back gestures, repeated physical transitions, long chapters, rotation, real Pad 5 jank/FPS/RAM and independent device recheck. Browser screenshots were not captured with Midnight Library selected; do not infer visual QA from default-theme screenshots.
- **LT-13 status:** **PARTIAL PASS (source/CI)** for a second visually distinct functional theme, **NOT TESTED** device screenshots/contrast and performance. LT-03 measured CPU/RAM/FPS still NOT TESTED.
- **Next:** exercise reader transitions and Midnight Library on Xiaomi Pad 5; implement LT-06 full bilingual UI and LT-12 font selectors, then LT-07 long books, LT-08 inline art and LT-11 licensed audio in substantive batches with a new distinct theme for each batch. No auto-merge, paid APIs or public release.


## 2026-10-23 — LT-01 launcher and LT-09 native system Back integration
- **Production changes on existing draft PR #1:** Android `MainActivity.kt` now checks `LinguaShell.isDrawerOpen()` and closes the library drawer before finishing the activity or navigating backward; the HTML/JS drawer gesture implementation remains unchanged. Android launcher label is now **Lingua Tales** in `AndroidManifest.xml`, native backup export filename becomes `LinguaTales-backup.json`, and offline document `<title>` is now Lingua Tales. **No change to `applicationId=com.storylens.reader`, localStorage keys, backup JSON format or package namespace.**
- **Source commits:** native back/backup `db82ae74cee4ad1a1cfa63db9d314219b7604674`; launcher label `36c4ee684effdc17956d14d21385f3e8217333ca`; Node CI regression `6e6654036e4be75efbb542a473f5c2c60a8a3985`; document title `ecb6842a3711eb03582efb06b14510ccefd2ae35`.
- **PASS GitHub CI** on exact earlier source/test SHA `6e6654036e4be75efbb542a473f5c2c60a8a3985`: [run 39988932481](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/39988932481), including Android Gradle debug APK, existing dictionary/reader/backup checks and new manifest/package/Back static contract checks. APK artifact `12516577711`, screenshots artifact `12517236287`. ZIP digest `sha256:9823dd17335025de35dcafd19b0e67038f92e9849e982fa325a173f3d1a3dac8`. This CI run **does not** cover the subsequent HTML title commit.
- **PASS latest title-change source SHA** `ecb6842a3711eb03582efb06b14510ccefd2ae35`: [run 39989290251](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/39989290251) completed success with Android Gradle Debug APK, offline content/lexicon and native source-contract tests, browser smoke/screenshots. APK artifact **12516193613** (ZIP sha256 `fa8a0ab9fb615deebc9fe3be47ab9925f0dac910740d03e2ffe427d43df72279`), screenshot artifact **12516343329**. Extracted Debug APK integrity checked (sha256 `b45a5412201ff50f04b3b25681bcd51ab09aad5afb6ec4a2f7bdadc3432d4d80`). This is not a real-device test.
- **LT-01 PARTIAL PASS** (Android launcher label, backup export name and HTML document title) but full legacy branding audit, UI translation and real update-in-place data continuity **NOT TESTED**.
- **LT-09 PARTIAL PASS** (native Back routing source+static CI) but Android physical Back/gesture, modal priority and repeated rapid Back **NOT TESTED**.
- **LT-03 NOT TESTED:** no Xiaomi Pad 5 CPU/RAM/FPS baseline or after-change measurements. This is a small compatibility batch, not a new LT-13 theme delivery. Previously completed Paper Atlas and Midnight Library remain.
- **Next:** full bilingual UI LT-06 with Arabic translation preserved in English mode, font settings LT-12 and device-backed performance measurements. No auto-merge or release.


## 2026-10-23 — LT-12 independent offline font selectors (production + tests)
- **Production commits:** `e6497d099688d4f2b00470cf7844a3255e42d076` adds separate Arabic (modern/Naskh) and English (literary serif/modern sans) selectors inside Settings, with strict value allowlists and offline persistence under `storylens_fontArabic` and `storylens_fontEnglish`; `6adff243bf6d1016ae98d89f21b67c96c6a5f4ca` adds font-stack CSS for reader text and translations, no remote font requests; `844d6b91d5f4bdbe71d6e316ffb402db9ecc14d7` includes these keys in validated JSON backup/restore.
- **Tests:** `7b4b89b9d3e5a1c6dc08387ee867b9b7e4fc0e04` exercises preference isolation, persistence and malicious value rejection in the real shell VM; `b2d208ec5cd50ad212105bf75f7b7186f154b085` adds backup roundtrip/invalid-font checks.
- **PASS CI on exact source+test SHA `b2d208ec5cd50ad212105bf75f7b7186f154b085`:** [Actions run 39996774207](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/39996774207), build job `120562233677`, Android Gradle unit/build, offline dictionary/catalog tests, JS tests, APK asset verification and browser screenshot steps all succeeded. Debug APK artifact `12520381114`; screenshots artifact `12520700643`. Artifact ZIP and APK archives extracted and integrity-checked locally. Debug APK SHA-256 `72f5808108c2142b18ee506a66b72447c709d708a7b31bd17d4e3d0046818fd1` (4,211,874 bytes). ZIP SHA-256 `e58fd2b30b5f4d8d40ca32da54eaa468a29fafffd9c9390cdbb523e549901214`.
- **PARTIAL PASS (source/CI)** for LT-12, **NOT TESTED** font availability/rendering and RTL shaping on Xiaomi Pad 5; fallback stacks are device-dependent, no bundled font licenses or binary assets. LT-06 full UI bilingual translation, LT-03 physical FPS/RAM, LT-04 approved icon integration, LT-07 long literature, LT-08 in-reader images, LT-11 licensed audio and full independent recheck remain **NOT TESTED**. No new LT-13 theme claimed: this was a focused typography batch.
- **Automation state:** `IN_PROGRESS`. No main write, paid API, auto-merge or public release.

## 2026-10-23 — LT-06 bounded bilingual shell implementation (no APK build)
- **Production changed:** YES. Settings now offers an explicit Arabic/English interface-language selector; `uiLocale` persists under the existing `storylens_` storage prefix, restores on startup, changes `html[lang]`/`html[dir]`, re-renders the library without clearing progress, and localizes the shell header, menu, search and learning shortcuts. The English story body and Arabic learning translations are not rewritten.
- **Backup:** the same version-1 backup format now includes `uiLocale` with an allowlist of `ar`/`en`; unknown locale values are rejected. No applicationId or storage migration.
- **Tests added:** Node VM locale/direction/persistence/rejection and backup allowlist assertions in `tools/library-experience.test.cjs`. A JS syntax/VM smoke was performed in the development runner; full Node suite and Android runtime are **NOT TESTED** in this round.
- **LT-06 status:** PARTIAL / NOT TESTED for full UI translation (reader, dictionary, review, errors and accessibility strings still need a full catalog and bilingual audit). **No APK build or GitHub Actions build requested** per user's final-only build policy.
- **Next:** complete all remaining UI localization via a maintainable catalog, test both directions and persisted reading state, then continue LT-07/08/11 and the approved icon integration when its original asset is accessible.

- **Exact production/test commit:** `0499c900f1c1f123b5b43ef86a6680216f298015` ([PR #1](https://github.com/amroalhamedi2022-hue/Storylens/pull/1)). V8 actual-shell locale smoke **PASS**; full Node suite, Android CI and device **NOT TESTED**. Commit used `[skip ci]` to honor the no-interim-APK policy.

## 2026-10-23 — LT-06 reader-control bilingual pass (source-only; no APK)
- **Production changed: YES.** `reader-experience.js` now chooses Arabic/English interface labels at render time for reader sentence accessibility, saved-bookmark tooltip, chapter progress, reader navigation, bookmark/jump buttons and help text. English source text and the existing Arabic sentence translations are untouched; the older user-facing StoryLens hero eyebrow was rebranded Lingua Tales.
- **Production SHA:** `41ef0d45c0ac9e069cf6ccb92c4e770b825e0deb`; **regression SHA:** `06c7a02ba022307ecda3b1d9e455550c5ad93d32` on existing PR #1.
- **PASS (source test, in-memory V8 harness):** executed committed `tools/reader-experience.test.cjs` against committed `reader-experience.js` with a Node filesystem/VM shim; **24 assertions** passed, including Arabic/English labels, bookmarks, chapter navigation, progress and unchanged Arabic translation. Also parsed production/test JavaScript successfully.
- **NOT TESTED:** native `node tools/reader-experience.test.cjs` in full checkout, whole-suite tests, current SHA GitHub CI, Android compilation, physical Pad 5, complete LT-06 string inventory and offline device state/rotation. **No APK was built**; commits include `[skip ci]` to avoid triggering the PR Android packaging workflow. Current source SHA had no PR workflow run when checked.
- **Next:** complete full LT-06 UI catalog (reader, dictionary, SRS, backup, errors), icon integration LT-04 and remaining LT-07..13, with source tests only until final acceptance build.


## 2026-10-23 — LT-06 backup bilingual UI and immediate locale/font restore (source-only)
- **Production changed: YES.** The real offline JSON backup sheet now renders Arabic or English labels, controls, confirmation and completion feedback from the active UI locale. It preserves version-1 backup compatibility and the legacy `storylens_` storage keys. After explicit restore confirmation, imported `uiLocale`, `fontArabic` and `fontEnglish` are reapplied through `LinguaShell` immediately, before the library redraw; no restart needed. Invalid follow-up import clears staged data. No network, permissions or app identity changes.
- **Production + regression commit:** `02df291d373e7e050df6b09c5a058f25da158109` on draft PR #1. `tools/data-backup.test.cjs` adds a real-module VM bilingual dialog/confirmed-restore/invalid-input regression.
- **PASS (isolated actual production JS):** executed the modified `data-backup.js` in an in-memory V8 DOM/storage harness; English and Arabic sheet text, confirmed restore of locale + both fonts, and malformed JSON rejection passed. JS syntax parsed successfully. **NOT TESTED:** native `node tools/data-backup.test.cjs` against a full checkout, full Node suite, Android CI on this SHA, real device import and restart. The repository test is authored but was not executed here.
- **CI:** deliberately skipped via `[skip ci]` in the commit message under the final-only APK policy. **APK:** none built for this SHA. **LT-06/LT-12:** PARTIAL source PASS; full localization/font rendering remains NOT TESTED. No new LT-13 theme or icon is claimed.
- **Next:** finish dictionary/review/error i18n, restore validation and all LT-01..13 requirements, then single final Android build and independent real-device recheck. `AUTOMATION_COMPLETE: IN_PROGRESS`.

## 2026-10-24 — LT-06 Settings continuity and bilingual discovery/dictionary controls (source-only)
- **Production:** `lingua-shell.js` now preserves the open Settings dialog when changing UI language, reopens it in the selected locale and restores focus to the language selector after a library redraw; preserves library scroll and offline `uiLocale` preference. Commit `128006dc6e3a98f4e91af174ffda7df92b7b9844`.
- **Production:** `library-experience.js` now localizes discovery favorites, level/sort selectors, counts, empty states, accessibility labels, reading-comfort settings and dictionary sense-choice **UI labels** in Arabic/English. The underlying Arabic dictionary senses, original English stories, storage keys and translation content are unchanged. Commit `0ec872b0d6b86d813245aa6fab33be03e2c7dc24`.
- **Tests authored:** `tools/library-experience.test.cjs` now exercises the exact locale-switch handler in a Node VM (Settings close/reopen/focus/scroll), bilingual helper behavior, label coverage and Arabic dictionary-sense preservation. Test commits `1ff528e0f496b5b4d96e5b2fd8500a16b39bd3f1`, `7a54d25ff9537bb63df75ac60d8cc7954b02440b`.
- **PASS (isolated source execution):** production `applyLocale` extracted from latest branch and executed in V8; observed persisted `en`, close → library redraw → scroll restore → reopen Settings → focus locale selector. Parsed all three modified JavaScript files in V8; production locale helper returned Arabic/English correctly; nine new English labels and unchanged dictionary-sense assignment verified. **This is not a full Node suite run.**
- **NOT TESTED:** native `node tools/library-experience.test.cjs` in complete checkout, full JS suite, Android CI/APK, actual Pad 5 UI, complete LT-06 localization audit, approved text-bearing adaptive icon, LT-07/08/11 content/media and independent device recheck.
- **Build policy:** commits include `[skip ci]`; no interim APK or workflow was intentionally launched. `AUTOMATION_COMPLETE: IN_PROGRESS`.

## 2026-10-24 — Keyboard-accessible dialogs (source-only)
- **Production commit:** `339772e2c7dcf304a2b17e7d66474231e702c0f8` updates `lingua-shell.js`. Settings and genre drawer now trap forward/reverse Tab inside the active dialog; Escape dismisses the topmost dialog and restores menu focus after Settings. One global listener avoids multiplying handlers on library redraws.
- **Regression commit:** `59ca73ad58a9119b1c3e18987ea04a22807fb9fa` extends the existing Node shell suite with Tab, Shift+Tab, Settings Escape and focus restoration cases.
- **PASS (isolated V8):** syntax parse of the exact updated production JS; extracted production keyboard handler executed in 3 focused cases (Tab, reverse Tab, drawer Escape). **NOT TESTED:** complete repository Node test suite, new Settings regression execution, Android accessibility/TalkBack, keyboard hardware, actual launcher icon and device recheck. No APK, no GitHub Actions trigger, no main write or auto-merge.
- **Next:** complete bilingual UI and exact approved text-bearing icon asset, test all navigation with keyboard/TalkBack and physical Pad 5 before the single final APK.


## 2026-10-24 — LT-08 offline inline illustration rendering infrastructure (no APK)
- **Production source:** `reader-experience.js` renders optional chapter `inlineArt` entries immediately after their matching `paragraphs[index]` sentences. Each entry may specify `afterParagraph`, packaged relative `src` under `art/`, mandatory accessible `alt`, optional `credit`, and `position` (`wide`, `edge-start`, `edge-end`). Rendering uses DOM `textContent`, not HTML interpolation. CSS has responsive no-overlap fallbacks and lazy image decoding.
- **Security/offline:** external URLs, absolute paths, traversal, missing alt, duplicate paragraph anchors and unsupported formats are skipped; no `INTERNET` permission or remote image dependency added. Existing English text and Arabic translations are untouched.
- **Source/test SHA:** production `5b2095b601d409c040a7721c5eb13e1792419433`, CSS `c57d96bab84a98f422f54003da1fd7bf836f23e1`, regression `9439ef0f191ced5601b465b928fae926cdd1ce69`.
- **PASS:** executed actual committed reader JavaScript in V8 with simulated DOM: 2 valid images placed at expected anchors; rejected remote/traversal/duplicate; checked alt and lazy loading. **NOT TESTED:** committed Node test on Node, Android renderer, accessibility screen reader, image crop/contrast and offline loading from a packaged real illustration.
- **LT-08 PARTIAL ONLY:** this is the renderer and safety contract; **no approved, licensed, scene-matched art files have been bundled**. No new LT-13 theme claimed for this narrowly scoped infrastructure batch. The original user-approved text-inclusive launcher icon is still **NOT INTEGRATED**. No interim APK or Actions build.

## 2026-10-24 — LT-08 safe inline-art budget (source-only)
- **Production SHA:** `02f0bb74d8bfcff284f1850c9b6dd5075dbd3b02`; **regression SHA:** `902c838da7a6285c935a99e4d96453d8db00dbd3` on draft PR #1.
- **Fix:** invalid/remote/traversal/unlabeled illustration entries no longer consume the 12-valid-image budget. Reader scans at most 64 candidates to avoid unbounded work from a malformed catalog; duplicates remain excluded and local-path/alt allowlist is preserved.
- **PASS:** executed the modified **actual production** `reader-experience.js` in V8 with a fake DOM: 14 rejected remote entries followed by two safe anchored illustrations both render; 20 valid illustrations render only the first 12. No original Arabic paragraph text was altered.
- **NOT TESTED:** full Node test file execution, Android/WebView layout, image asset licensing and editorial review, physical-device scroll/memory, accessibility and independent recheck. No final licensed art has been supplied by this patch. **No APK build requested**; commits use `[skip ci]`.
- **Status:** LT-08 remains PARTIAL / IN_PROGRESS; approved text-bearing launcher icon and full LT-01..13 acceptance remain pending.


## 2026-10-24 — Corrupt bookmark navigation hardening (source-only)
- **Production commit:** `97e95b8aa4d6816e978f4069cbdb6172566b2683` in `reader-experience.js`. Restoring an old/imported bookmark now rejects non-integer, NaN and negative chapter indices; clamps chapters removed by content updates; sanitizes non-finite/negative scroll offsets. Direct chapter navigation rejects non-integers. Existing numeric bookmarks remain supported.
- **Regression commit:** `313a5425e0b9d78cd34c40731ae26ef1419e8fe1` adds `tools/bookmark-navigation.test.cjs` with invalid/valid chapter and scroll cases.
- **PASS:** executed the **actual modified production JS** from the PR in a V8 harness: four bookmark restoration scenarios (invalid chapter, infinite scroll, out-of-range chapter/negative scroll, valid chapter/scroll). Production file blob SHA `8cae8d93557cb8c5e003ce8b8d342d64d125a642`.
- **NOT TESTED:** Node test file through the full repository runner, Android browser/Pad 5, upgrade migration, device gestures, icon and media. No APK or Actions run intentionally triggered. Existing CI workflow remains unchanged. Status: **IN_PROGRESS**.


## 2026-10-24 — Legacy chapter progress and scroll safety (source-only)
- **Production commit:** `a4b74caea89612d34e2231d57fbcd3ded9134e97`; **regression commits:** `0564243b88ee532b2cf3c692f4e79073619b6694`, `c7f93cde9da14113212e5b983f1fad46bfe689b5` (draft PR #1, never main).
- **Fix:** reader's library/continue chapter index rejects fractional, NaN and non-finite saved progress, clamps removed chapters; chapter-picker restores only finite, nonnegative, bounded scroll offsets. This complements the earlier bookmark jump guard and does not alter story text or saved data formats.
- **PASS:** parsed and executed modified production JavaScript inside V8 with a mocked reader and storage; checked invalid/fractional/oversized chapter progress, infinite and negative scroll, and valid scroll restoration. Separately verified the committed regression test parses and its source-extraction regex matches the real production helper; 4 index cases passed in V8.
- **NOT TESTED:** full committed Node test suite, Android WebView/Pad 5, live migration, FPS, icon integration, final licensed art, full bilingual UI, independent recheck.
- **Build:** no APK, no workflow dispatch, no merge, no paid API; existing workflows unchanged. Status: **IN_PROGRESS**.

## 2026-10-24 — Fail-closed offline backup export (source-only)
- **Production commit:** `3304cdbf93aed5f20bc062d680290c0ead122851` updates `app/src/main/assets/data-backup.js`. An allowed learning/progress key with malformed JSON or an invalid schema now stops export with the exact key identified, rather than silently disappearing from an apparently successful backup. Unrelated storage keys remain excluded. Legacy `storylens_` keys and backup format remain unchanged.
- **Regression commit:** `693fc80b0e016a6e26656470febff82e5277230a` adds malformed cards, wrong-shaped cards and invalid chapter progress tests to `tools/data-backup.test.cjs`.
- **PASS (production V8 smoke):** executed the actual modified JavaScript export function with mock localStorage: corrupt JSON and wrong-shaped allowed values rejected; valid data exported; unrelated key excluded.
- **NOT TESTED:** complete Node test suite, Android/WebView storage-quota behavior, real restore/device upgrade and independent QA. No APK build, no Actions dispatch, no paid API, no main write or merge. **IN_PROGRESS.**

## 2026-10-24 — UTF-8-safe offline backup boundaries (source-only)
- **Production commit:** `7ed6ce311b36f97951b284dc0cf618a04e6fa952`; **regression commit:** `10055cb720853fbe36b6f767ba0df97d2e454026` on Storylens PR #1 (not `main`).
- **Fix:** backup export and pasted/imported JSON now enforce the 1,500,000 limit in actual UTF-8 bytes rather than UTF-16 code units. This prevents Arabic/CJK/emoji data from passing the WebView check only to exceed Android's UTF-8 SAF file limit. Correct surrogate-pair and malformed-surrogate replacement byte accounting; existing v1 format and `storylens_` storage identifiers unchanged.
- **PASS:** executed the exact committed production JS inside V8 with fake offline localStorage; 5 checks: CJK oversized export/import, valid Arabic backup roundtrip, mixed-script backup, emoji oversized import. Regression file parsed successfully. **No Node/Android APK build.**
- **NOT TESTED:** full `node tools/data-backup.test.cjs` in a complete checkout, full Node suite, Android SAF roundtrip, physical device, final approved icon and LT-01..LT-13 acceptance.
- **CI:** no PR workflow run on code/test head when checked. All commits use `[skip ci]`. **Status:** IN_PROGRESS.


## 2026-10-24 — Vocabulary backup schema and audio-free settings (source-only)
- **Production commits:** `df9b5f4476aa61374847f214001d10090b36f0af` (backup text-map validation) and `2f012d87612d082b65ed8c9d67cfd95a6c59999c` (settings wording). **Regression commits:** `f26002958d032ce49d468a427d0a3ca7d4cdfcc9` and `2dd56b73c710f71a2241ebf74692312a3626b99d`, all on draft PR #1.
- **Fix:** `written_examples` and `wordSenses` backups now reject nested objects, arrays, booleans, null, and oversized text keys/values; valid Arabic sense strings and ordinary English usage examples remain accepted. Export fails visibly for corrupt allowed keys instead of silently dropping learning data. Settings no longer advertise optional audio, which is outside the approved product scope.
- **PASS:** executed the **actual modified production JavaScript** inside V8 with fake offline storage: 10 checks covering valid maps, malformed imports, invalid export and roundtrip. Parsed the committed Node test file in V8. **FAIL:** none observed in the checks run.
- **NOT TESTED:** full committed Node suite, Android WebView backup import/export, real device upgrade, screenshot/launcher icon, complete LT-01..13 requirements, offline/performance/accessibility and final APK. The committed Node regressions are authored but not yet executed in the full project runner.
- **Build/merge:** no APK or Actions dispatch; no main writes, merge, paid API or Library/Handoff. Status **IN_PROGRESS**. Do not run APK builds until final feature/test gates pass.

## 2026-10-24 — Android SAF import callback execution regression
- **Production SHA:** `8e4efdf6d51531ec9ae36927ced17595705665f3`; **test SHA:** `f6fc40bd5b1e1b3b475d154515326b6496afee4c`. The prior source contained literal `\\n` inside a Kotlin `//` comment, swallowing the entire `notifyBackup("receiveImport", BackupUtf8.decode(...))` statement. Successful file picks therefore never delivered backup JSON to the JavaScript importer. Restored real source newlines so the strict UTF-8 callback executes after reading.
- **PASS (source/static):** 7 checks on actual PR-head `MainActivity.kt`, including exactly one executable `receiveImport` call, read-before-delivery, catch ordering, no escaped-newline comment, and JS regression test syntax. New regression lives in `tools/data-backup.test.cjs`.
- **FAIL:** 0 in the completed source/static gate. **NOT TESTED:** full Node suite, Android Kotlin compilation, SAF picker on device, backup round-trip, upgrade and performance. No APK or workflow run; zero PR-triggered runs reported for the test commit. User-approved icon and other product gates remain incomplete.

AUTOMATION_COMPLETE: IN_PROGRESS

## 2026-10-24 — LT-13 Botanical Folio editorial theme (source milestone)
- **Production:** `app/src/main/assets/lingua-shell.js` now registers **Botanical Folio** in the persisted Settings theme gallery; `lingua-shell.css` adds a distinct static field-journal composition: sage/moss palette, pressed-leaf hero, specimen-cover card geometry, botanical drawer, matte reading surface and responsive tablet/phone layout. No network images, downloaded fonts, continuous animation or new permissions.
- **PASS (production JS):** executed the latest GitHub `lingua-shell.js` inside V8 with mocked DOM; **12 checks** covered theme registration, applying/persisting the selection, replacing the previous body class, rejecting invalid themes, and six required CSS surfaces. A committed Node regression `tools/botanical-theme.test.cjs` exercises the actual production JS and stylesheet.
- **NOT TESTED:** committed Node suite as a complete repository checkout, Android CSS rendering, contrast screenshots, RTL/LTR visual comparison, reduced-motion, memory/FPS and real Pad 5 launcher. A static/CSS/V8 test is not device or visual acceptance.
- **Gate:** LT-13 implementation for this theme **PASS (source)** / **NOT TESTED (device)**; all remaining LT-01..LT-13 gates stay open until evidenced. Do not count one new theme as full app completion.
- **Commit checkpoint:** `31da47b49dcdec2791a499ed932dc1e95da1b369` (source + CSS + regression, PR #1 only). No APK/Actions build, no merge/main write.


## 2026-10-24 — LT-01/LT-04/LT-13 launcher + Rain Glass milestone
- **Source checkpoint before CI:** `596a8f95d5ee6f5684d84fe48025f20ce01b517f` was the prior head; subsequent commits on this PR add the milestone. Keep `applicationId=com.storylens.reader`, `storylens_` storage keys, backups and dictionary formats unchanged for upgrade continuity.
- **Production:** User-facing catalog/hero brand now **Lingua Tales**; launcher manifest uses a real Android adaptive icon with separate gradient background, open-book/petals foreground and monochrome themed layer. These are new project-specific vector resources, not imported third-party marks. This approximates the approved Liquid Glass motif; exact match to the previously approved raster reference is **NOT TESTED** because that source image is not in this repository.
- **Production:** **Rain Glass** is an additional selectable/persisted offline theme, with windowpane hero, horizontal framed cards, cool reading surfaces and RTL-aware existing drawer. No new network dependency, audio permission or per-frame animations.
- **PASS (source only):** 22 V8 checks executing the actual `lingua-shell.js` from the PR, validating theme registration/application/persistence, invalid-theme rejection, six CSS surfaces, static/offline CSS, launcher resource references, manifest label, and unchanged storage/application ID. Added `tools/rain-glass.test.cjs` and `tools/test_lingua_launcher.py`.
- **Build question:** Will Android 36 resource compilation accept the new adaptive vector/monochrome icon, package all layers, and retain the correct launcher label? Source-only checks cannot validate AAPT2 packaging. One purposeful PR CI build is justified for this milestone; record exact run/artifact/SHA separately once available. This is **not** a final APK or a physical device test.
- **NOT TESTED:** Android icon masks on real launchers, actual tablet screenshots/FPS/RAM, app upgrade with saved user data, full Arabic/English journeys, remaining LT-07/08/11/12 content/media QA. No final release.

## 2026-10-24 — LT-06 reader keyboard access to Arabic translations (source milestone)
- **Production SHA:** `a796c28dd0946d3f6274119d9f80f43f43c8ea55`; **regression SHA:** `f04dad849c59538cc9ea730a168f753ab0c42828` on draft PR #1, not `main`.
- **Change:** Focused English source sentences now support **Enter and Space** to toggle the exact same Arabic translation as long-press/context menu. Translation retains `lang=ar` and RTL; English sentence remains `lang=en` and LTR. Keyboard events from interactive descendants are ignored; Space prevents unwanted scrolling only when the sentence itself has focus. Accessibility help is bilingual. No new permission, microphone, TTS, content rewrite or storage migration.
- **PASS (source/V8):** Executed the **committed reader regression script** against the **committed production reader JavaScript** using a V8 Node-API compatibility shim. The script checked chapter/bookmark navigation, long-press, Enter/Space translation toggle, descendant focus, Tab, bilingual instructions and unchanged source translations. Also parsed the production JS and exercised 4 direct keyboard/context-menu scenarios with a simulated DOM.
- **FAIL:** None in the executed checks; an initial incomplete test mock lacked `classList` and was corrected before the successful production-script verification. This was not a product failure.
- **NOT TESTED:** Native `node tools/reader-experience.test.cjs`, full Node suite, Android TalkBack/physical keyboard, Android compilation/installation, Xiaomi Pad 5 performance, RTL visual screenshots, remaining LT-01..LT-13 end-to-end gates, APK/SHA-256.
- **CI:** Zero PR workflow runs reported at regression SHA when checked; commits use `[skip ci]`. **Build decision:** no APK build: this pure reader-interaction regression is testable at source level; a later purposeful APK must address native accessibility/visual/gesture questions with device evidence. **Status:** IN_PROGRESS.


## 2026-10-24 — LT-06 bilingual reader + LT-13 Solar Atelier milestone
- **Production:** `lingua-i18n.js` is loaded after the existing shell and reader wrappers. It localizes **app chrome only** for reader navigation, reader settings, dictionary word sheet, saved vocabulary, SRS review and full-translation navigation in English UI. It does **not** translate or mutate original English story paragraphs, Arabic glosses, saved card meaning or full Arabic translation. Existing `uiLocale` preference and legacy `storylens_` storage keys are retained.
- **Production:** new **Solar Atelier** theme in the Settings gallery: static warm cut-paper editorial layout, asymmetric sun-disc hero, geometric cards, independent reader colors, RTL-compatible existing drawer, and phone/tablet responsive rules. No remote assets or continuous animations.
- **PASS (source):** executed the **actual committed** `tools/locale-journeys.test.cjs` against actual committed `lingua-i18n.js` in V8 with limited Node API shims: **37 assertions**, including bilingual reader, dictionary labels, SRS, full Arabic translation, English source preservation and Arabic UI fallback. Executed the actual `tools/solar-atelier.test.cjs` against production `lingua-shell.js/css` with V8 shims: **16 assertions**. These are not native Node/Android runs.
- **FAIL:** none in 53 executed V8 assertions. **NOT TESTED:** full Node test suite, Android packaging, TalkBack/RTL screenshots, physical Xiaomi Pad 5 UI/FPS/RAM, real upgrade, entire LT-01..LT-13 acceptance, final APK and SHA-256.
- **Purposeful build question (authorized 2026-10-24):** do the new script and theme survive full native Node/Android CI, and does AAPT2 package the launcher/resources? Source-only V8 cannot answer Gradle compilation, APK asset packaging or integration with the real WebView. A single targeted CI run is justified for this milestone, **not a final release or device PASS**. Workflow and exact run/artifact must be recorded only if actually observed.
- **Scope:** draft Storylens PR #1 only; no `main`, no auto-merge, no paid API, no Library/Handoff. **IN_PROGRESS.**


### Targeted Android CI evidence for bilingual/Solar Atelier milestone
- **PASS (GitHub Actions):** source SHA `5b399aa8dc090c759d1b8c09b1e2669e715f4e4b`, run **40126808076**, `push` event on Storylens PR #1 head only. URL: https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40126808076 .
- **Verified job logs:** actual Node `locale-journeys.test.cjs` and `solar-atelier.test.cjs` PASS; Gradle `:app:testDebugUnitTest :app:assembleDebug` **BUILD SUCCESSFUL (29s)**; AAPT2 adaptive icon and critical offline assets including `lingua-i18n.js` packaged; desktop Chrome reader/word/chapter/bookmark/translation/theme flow PASS.
- **Real artifacts:** debug APK ZIP artifact **12573722602** (`StoryLens-Debug-APK`); browser screenshots artifact **12573652714** (`StoryLens-UI-Screenshots`). These are *CI debug artifacts*, not final release. APK inner-file SHA-256 **NOT TESTED** (not printed by this workflow). CI did not install it on Xiaomi Pad 5.
- **NOT TESTED:** real Android install/upgrade, physical Pad 5 bilingual UX/animations, performance/thermal, TalkBack, 100% offline field verification and all remaining LT acceptance. No claim of final app. **IN_PROGRESS**.


## 2026-10-24 — LT-02 resume/navigation continuity milestone
- **Production changes (PR #1 only):** `reader-experience.js` sanitizes imported/stale chapter indices before the original reader indexes chapter data; `lingua-shell.js` resumes the saved per-story/per-chapter scroll offset, restores the library's previous scroll and keyboard focus on the rebuilt card after close, focuses the reader heading without scrolling, and restores the English reader position after viewing the full Arabic translation. A deferred frame captures the exact story ID so rapid navigation cannot apply an older story's scroll offset to another one.
- **PASS (actual production navigation IIFE, V8):** 20 consecutive open/close cycles with synthetic browser history and DOM, persisted scroll and focus checks, plus chapter resume and Arabic-translation return; no stuck page or incorrect scroll in the executed scenarios. These checks execute the real production navigation function but simulate the DOM and Android history.
- **Committed regression:** `tools/story-transitions.test.cjs` exercises the actual production navigation block, 20 cycles, repeated Back, chapter resume, focus, full Arabic translation, invalid scroll and reduced-motion behavior; registered in `.github/workflows/android.yml`.
- **NOT TESTED:** native Node execution of the new committed regression, complete CI at this latest source SHA, Android system Back/gesture and real WebView timing, device upgrade/scroll FPS, accessibility/TalkBack, physical Pad 5. LT-02 is **PASS for the isolated production logic** but **NOT TESTED for real-device acceptance**.
- **Build decision:** no new APK for this source milestone: browser navigation logic is independently testable in V8 and the prior Android build already passed. A later targeted device build must answer Android Back/gesture and visual timing questions, not merely repeat a routine APK compilation.
- **Scope:** no main, auto-merge, paid API, private assets or Library/Handoff; LT-01..LT-13 final acceptance remains IN_PROGRESS.

## 2026-10-25 — Reader sentence-reveal continuity (source milestone)
- **Production SHA:** `102becb19ede1a472d92ec74b25b93a2a2b2ff5a`; **regression SHA:** `195ae8df186a7e1f577ee89aa0c73fcb755a0a57` on PR #1, not main.
- English sentences and exact Arabic translations are unchanged. User-revealed Arabic sentence translations now survive reader re-render and return to the same chapter; hiding a reveal remains hidden. Chapter state is isolated. In-memory state is capped at 40 chapters / 200 reveals each and avoids synchronous per-tap storage writes. Reveals are intentionally **not** persisted across app restarts.
- **PASS:** Six functional V8 checks executing the **fetched production reader-experience.js** with a synthetic reader DOM: first reveal, re-render restoration, explicit hide, hidden re-render, chapter isolation, return-to-chapter restoration. Added corresponding repository Node regression tests.
- **NOT TESTED:** Committed Node suite, new Android APK compile, TalkBack, Pad 5 re-render/scroll/performance, offline physical device. Earlier CI run `40126808076` and APK artifact `12573722602` passed/exists on an **older SHA**; they do not validate these changes.
- No new build requested: this round's question was isolated re-render state behavior; the existing production JS can be exercised without an APK. Device accessibility/performance remains a separate necessary acceptance gate.

## 2026-10-25 — Indexed dictionary/idiom taps + Ink Workshop theme (LT-03/07/13)
- **Functional source milestone:** new `app/src/main/assets/lingua-lookup.js` lazily indexes edited multiword phrases and dictionary headwords by clicked token, chooses the longest matching phrase at the exact occurrence (including repeated phrases), preserves inflection and licensed supplemental dictionary fallbacks, and returns unknown words without fabricated contextual definitions. `reader-experience.js` intercepts token taps in capture phase and reuses the existing word sheet/SRS path, avoiding the old full-phrase regex scan on every tap. This is a source-level performance improvement; no FPS or latency improvement is claimed without Pad 5 measurements.
- **LT-13 theme:** new **Ink Workshop** uses asymmetric black/red print-studio hero, magazine-style side-cover cards, serif reader rules, a high-contrast drawer, responsive narrow layouts and no network textures or infinite animations. The Settings gallery persists it offline. Backup validation now accepts **all** currently supported themes (including Botanical Folio, Rain Glass, Solar Atelier and Ink Workshop) instead of silently rejecting newer selections.
- **Regression and integration:** `tools/phrase-lookup.test.cjs` and `tools/ink-workshop.test.cjs` run against production modules in CI. A pre-existing synthetic LT-02 navigation fixture omitted `get` and `querySelectorAll`, which the real app supplies; the fixture was repaired without changing the production transition controller. Earlier run **40139684844 FAIL** in that fixture; do not misreport it as a reader runtime failure.
- **Purposeful build question:** Does Android compilation package the new offline lookup module and adaptive launcher, and does the full reader/word sheet/backup journey still work after interception? Isolated JS tests cannot establish APK resource packaging or WebView integration. A single end-to-end branch build is justified for this connected milestone; not a final release.
- **PASS CI on production SHA `ef9728546738b4874437407dfe6f18d15c25566a`:** [Actions run 40139926288](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40139926288) completed successfully. Logs show Ink Workshop and indexed idiom Node tests PASS, Gradle `BUILD SUCCESSFUL`, new asset and adaptive launcher packaged, and desktop-browser library + full reader/word sheet/chapter/bookmark/translation/theme journey PASS. Independent V8 fetch of production JS/CSS/backup recorded 11 focused assertions PASS.
- **Artifacts:** Debug APK archive **12578540992** and UI screenshot archive **12578865623** exist on that run. CI wrote `APK_SHA256.txt` into the APK artifact, but **inner APK SHA-256 has NOT been independently read/verified** here; do not confuse archive hashes with APK hashes.
- **NOT TESTED:** installation or upgrade on Xiaomi Pad 5, actual frame timing/jank, Android system Back, real-device icon masks, TalkBack, the theme's visual acceptance, editorial licensing/translation of new long works, licensed ~20 soundtracks, and independent second-pass device acceptance. **LT-01..13 remain IN_PROGRESS**, not all accepted.
- **Scope:** Storylens draft PR #1 only; no main, release, paid API, personal assets or ChatGPT Library/Handoff. Documentation-only commit uses `[skip ci]` to avoid an unnecessary second APK build; CI above validates the exact preceding production SHA.

### Independent Debug APK byte verification for LT milestone
- Downloaded the actual Actions artifact **12578540992**, opened its ZIP, and independently SHA-256 hashed `app-debug.apk` (**4,233,456 bytes**): **`f0c0f9abe571ed2677c1e028a1e8d5814e7f8e70ad3f68a63e60fbfe718684de`**. It exactly matches the bundled `APK_SHA256.txt`.
- Inspected the inner APK: `assets/lingua-lookup.js` and `res/mipmap-anydpi-v26/ic_launcher.xml` are present. **PASS artifact integrity/resource packaging.** Device installation, icon appearance and Pad 5 performance remain **NOT TESTED**. This is a Debug validation artifact, not a final release.


## 2026-10-25 — LT-11 opt-in offline soundscapes + LT-13 Velvet Theatre (functional batch)
- **Production source SHA:** `1baf327c9fc44781cfb4fc1ed219d8d10c6440c6`; **targeted CI/test workflow SHA:** `2a40d4b05abab880a0606f3349fa350b27909d0b`, draft PR #1 only.
- Added `lingua-ambience.js`: 8 original *procedurally synthesized* ambience previews (rain, distant storm, forest, night, ocean, fire, wind, cabin) using a single lazily created Web Audio context and a reused 2-second mono noise buffer, plus independent opt-in button feedback. Separate ambient/SFX volume, scene selector, explicit Play/Pause, silent default, pause on page hide, no microphone/network permissions, no recording/TTS. The presets are **not** 8 licensed recorded tracks or a finished ~20-track music catalog; music/audio quality and Android audio focus remain open.
- Added bilingual Settings controls and strict `audioPrefs` offline-backup validation. Added fully distinct **Velvet Theatre** theme: burgundy matte stage, gold marquee, ticket-shaped cards, opaque cream reading surface and responsive layout. Existing themes remain selectable.
- **PASS isolated production-source checks:** 16 functional V8 checks on fetched exact JS/HTML/shell/CSS/backup: no audio context at startup, 8 scenes, invalid scene rejection, volume clamp, preference persistence, lazy audio graph start, context reuse, old node cleanup on scene change, explicit pause, visibility pause, no hidden autoplay, Settings wiring, theme and backup validation. These use a fake AudioContext, **not acoustic output or WebView hardware**.
- Added `tools/ambience.test.cjs` and updated branch CI to run it and assert `assets/lingua-ambience.js` is packaged into Debug APK. **Purposeful build question:** does the complete Node test + Android resource/asset packaging and browser journey still pass after enabling optional Web Audio and a new theme? Isolated JS cannot prove Android asset inclusion or AAPT2 compatibility. Target [Actions run 40147334938](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40147334938) was **IN_PROGRESS at documentation time**; CI on the final SHA is **NOT TESTED pending completion**. Earlier run 40147250180 PASS on audio production SHA before adding targeted test.
- **NOT TESTED:** sound on Xiaomi Pad 5, audio focus/silent-mode interruptions, power use, physical theme screenshots/contrast, long authentic licensed literature, licensed ~20 music/ambience files, and final LT-01..13 acceptance. No final APK or merge. Do not count synthesized previews as completed LT-11.


### LT-11/LT-13 targeted CI completion (supersedes pending status above)
- **PASS:** [Actions run 40147334938](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40147334938) completed successfully on exact functional/workflow SHA `2a40d4b05abab880a0606f3349fa350b27909d0b`. Job steps show PASS for `node tools/ambience.test.cjs` within curated offline content checks, Android Gradle unit tests/Debug assembly, asset packaging (including `lingua-ambience.js`), and browser library/reader smoke. The new audio module is included in a real Debug APK.
- **Real artifacts:** Debug APK ZIP **12580578648**, screenshot ZIP **12580209339**. Archive digest is not the inner APK checksum; **inner APK SHA-256 independently verified: NOT TESTED**.
- **NOT TESTED:** audible output on Xiaomi Pad 5, Android audio focus and background battery, independent visual theme review, licensed music/20 tracks and real device install. The source and CI gates do not complete LT-11 or LT-13 final acceptance.


## 2026-10-25 — LT-11 expanded offline previews, lifecycle race and Celestial Atlas
- **Functional/CI SHA:** `11e9bda882726b2cbe690032a8a135adfc74d9b7`, draft PR #1 only.
- **Production:** expanded the **original procedurally synthesized** soundscape preview catalog from 8 to 20 bilingual selectable scenes; uses the existing single lazy Web Audio context, shared short noise buffer and one active graph at a time. These are **not** 20 licensed recordings, musical compositions, or verified acoustic-quality tracks; LT-11 recorded-music licensing, actual sound quality and Android audio focus remain open.
- **Lifecycle correctness:** generation token prevents an in-flight `AudioContext.resume()` from starting a hidden/paused sound graph after a visibility change or Pause. The user must explicitly Play again. Existing opt-in/silent-default, no mic/TTS/network restrictions remain.
- **LT-13:** **Celestial Atlas** is a new, static observatory/chart theme with brass grid, concentric compass hero, book-spine two-column cards, separate cream reading surface, RTL-compatible drawer and narrow responsive layout. Offline backup accepts its theme ID and all 20 scene IDs.
- **PASS source (exact production JS blob `b8d21704a616dc49c4c4e8ec11bd63079d0331ba`):** 29 V8 assertions with synthetic AudioContext across all 20 scene switches, graph cleanup, silent start and pause; additional delayed-resume/visibility race PASS (0 sound nodes started). This is **NOT real audio playback**.
- **New repository tests:** `tools/ambience.test.cjs` extended for 20 scenes/race, `tools/celestial-atlas.test.cjs` for real theme selection/persistence/CSS; CI workflow runs both.
- **Purposeful Android CI question:** do new audio/theme/backup modules pass native Node regression, Gradle Android compile, APK asset packaging and browser journey? Isolated V8 cannot verify these. [Run 40151342993](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40151342993) was **IN_PROGRESS** when checked; **CI/Artifact: NOT TESTED pending completion**.
- **NOT TESTED:** real Pad 5 audible output, focus/silent mode, battery/thermal, 20 licensed recordings/music, real visual screenshots/contrast, long literature/translation, end-to-end LT-01..LT-13, final signed APK. **IN_PROGRESS**. No main, auto-merge, paid APIs or Library/Handoff edits.


### Targeted CI completion for 20-scene/Celestial Atlas milestone
- **PASS** [GitHub Actions 40151342993](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40151342993) on exact functional/workflow SHA `11e9bda882726b2cbe690032a8a135adfc74d9b7`: curated offline Node suite including the new 20-scene audio/race regression and Celestial Atlas theme test; Gradle `:app:testDebugUnitTest :app:assembleDebug` **BUILD SUCCESSFUL**; APK packaged critical assets and adaptive launcher; Chrome library and full reader/word/chapter/bookmark/translation/theme journey PASS.
- **Actual artifacts:** `StoryLens-Debug-APK` ID **12583060932**, `StoryLens-UI-Screenshots` ID **12582946080**. GitHub CI `sha256sum` of inner `app-debug.apk`: **`5382dd98ffdf13707aeaf644f99fad2a434c6670267b19e381cef92d7d4812ab`**. This digest was recorded by CI logs; **independent re-download/re-hash NOT TESTED**.
- **NOT TESTED:** physical Xiaomi Pad 5 install/audio quality/volume/focus/performance, visual theme approval, licensed 20-track music catalog, all LT-01..LT-13 final acceptance. Debug APK is not a release. **IN_PROGRESS**.


## 2026-10-25 — LT-07 complete original bilingual novella + LT-13 Harbor Ledger

- **Functional branch SHA before evidence note:** `c00b5accb91e44bbded8137c0cdaae2000ad81bc`, draft PR #1 only; no `main` write.
- **New production content:** `app/src/main/assets/novella-salt-meridian.js` adds **The Salt Meridian**, a complete original five-chapter maritime mystery with **50 aligned English/Arabic passages**, **1,470 English words**, **14 edited, source-occurring expressions**, original-provenance metadata and explicit **independent editorial review pending**. This is original fiction, **not** a Jules Verne translation or a public-domain classic. Existing 36 stories are retained, bringing the runtime catalog to **37 works**.
- **Offline artwork:** five chapter-scene SVGs generated by the existing local editorial-art engine. These are chapter hero scenes, **not** independently licensed photographic/inline illustrations; LT-08 remains incomplete.
- **LT-13:** new **Harbor Ledger** theme: maritime ruled-paper reading surface, nautical compass hero, brass-accent field-book cards, responsive layout and RTL-aware drawer. Settings and offline backup theme whitelist updated; no animated texture loop or remote font request.
- **PASS source (production JS evaluated in V8):** novella registers, 5 chapters / 50 paired passages / 1,470 words, all 14 expressions occur in English passages, all Arabic pairs present, 5 local chapter SVG scenes, theme/backup/CI wiring. Additional committed Node regression `tools/salt-meridian.test.cjs`, editorial integration count updates and browser journey fixture updates.
- **Purposeful Android build question:** Does the 37-work catalog pass actual Node/Chrome navigation tests and does Android package the new offline book, art generator and theme without breaking the existing reader? Source-only V8 checks cannot verify Chrome reader flow, AAPT2/Gradle packaging or screenshots. Target [Actions 40155296890](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40155296890) **IN_PROGRESS at this checkpoint**. Earlier intermediate run 40155202446 **FAIL** in browser QA because fixture still expected 36 works; corrected in `tools/make_browser_fixtures.py` and the newest run is the acceptance candidate.
- **NOT TESTED:** independent bilingual literary editing, physical Xiaomi Pad 5 install/FPS, real licensed long classics (including Verne), per-scene inline licensed illustrations, ~20 licensed recordings/music, full LT-01..13 acceptance and final signed APK. **IN_PROGRESS**.
- **CI economy:** branch workflow now cancels superseded intermediate builds; no paid services, no auto-merge, no Library/Handoff changes.


### LT-07/13 purposeful CI result (supersedes pending status above)
- **PASS:** [Actions 40155296890](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40155296890) on exact functional SHA `c00b5accb91e44bbded8137c0cdaae2000ad81bc`. Curated Node suite including `salt-meridian.test.cjs`, Android Gradle unit/Debug assembly, APK offline asset packaging and full Chromium reader/word/chapter/bookmark/translation/theme journey passed. The browser fixture's old 36-work assumption was corrected to 37; earlier intermediate CI failures were not counted as success.
- **Real artifacts:** Debug APK ZIP **12583968311** and UI screenshot ZIP **12584407744**. CI-calculated SHA-256 of inner `app-debug.apk`: **`afd3cb4e6a1a741c9a781f9031c5eeeab0a0bdcd1712608027f8344f8f7fbf47`**. Independent download/re-hash **NOT TESTED**; this is not a final APK.
- **NOT TESTED:** actual Pad 5 installation/reading FPS, professional bilingual editorial review, long licensed classics, licensed music/inline images and independent final acceptance. LT-07 and LT-13 remain **IN_PROGRESS**, not complete.


## 2026-10-25 — Reader semantic bookmark recovery (LT-02/LT-03 continuity)

- **Production:** `reader-experience.js` now records the first visible English paragraph index plus its viewport offset when the user saves a bookmark, alongside the original chapter/pixel scroll. On reopening, it restores relative to that paragraph after font/theme/tablet layout changes. Existing bookmarks/backups with only pixel scroll still work; invalid/out-of-range/non-finite anchors fall back to the original validated pixel value. No new storage key, permission, network request or change to English/Arabic source text.
- **Tests committed:** `tools/semantic-bookmarks.test.cjs` exercises actual production reader navigation, reflowed paragraph geometry, legacy backup and corrupt anchor fallback; registered in Android workflow. **PASS isolated V8:** three direct executions of exact GitHub production JS verified paragraph capture, reflow restore and legacy fallback. **NOT TESTED:** the committed Node test through Node, full browser/device integration, TalkBack, font/theme visual changes, Android install/upgrade and Xiaomi Pad 5 performance.
- **Purposeful build question:** does the new semantic bookmark navigation pass the full Node reader suite and Chrome journey, and remain packaged in an installable Android APK? V8 mocks cannot prove DOM layout, packaging or Android compatibility. CI requested by this non-skip documentation checkpoint; mark **CI/Artifact NOT TESTED until a completed run for this exact SHA is inspected**. Debug APK, if produced, is not final.
- **LT-01..LT-13:** still **IN_PROGRESS**; the long licensed literature, professional Arabic editing, licensed recordings, real Pad 5 performance and final independent device acceptance remain outstanding. No main/merge/paid API/Library/Handoff changes.


### Semantic bookmark milestone — targeted CI completion

- **PASS:** [Actions 40159154937](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40159154937) completed successfully on exact production/test SHA `8a068821d6e010f5976be1cd30448fb9439f94a3`. The committed `tools/semantic-bookmarks.test.cjs` executed and logged PASS for layout reflow, legacy bookmark restore and invalid-anchor fallback. Full curated Node suite, Android Gradle tests/assemble, adaptive icon/offline asset packaging, and Chromium library/reader journey passed.
- **Artifacts:** `StoryLens-Debug-APK` ID **12585704121**; `StoryLens-UI-Screenshots` ID **12585990112**. CI-calculated **inner** `app-debug.apk` SHA-256: `5889de05c43501f88f9a438a16892fae9aaf4b58330a511a9d4d38db472645c0`. The ZIP artifact's SHA is a different value; **independent artifact download/re-hash NOT TESTED**.
- **NOT TESTED:** Xiaomi Pad 5 font reflow, real physical scroll restoration, upgrade continuity, FPS, full LT-01..13 acceptance and final signed APK. This is a validated debug milestone, not a final release.

## 2026-10-25 — Inflected idiom lookup + Circuit Notebook (LT-07/LT-13 partial)
- Production phrase lookup SHA `c7ddd8c89083047e0d9683caa3eae94beede3b82`: source-offset integrity check, story-authored multiword phrases matched through existing local lemma rules (e.g. *went on* → *go on*, *took off* → *take off*) without inventing glosses; punctuation cannot bridge unrelated words. Existing dictionary and exact phrase fallback preserved.
- Distinct `Circuit Notebook` theme: technical diagram grid hero, indexed squared cards, annotated ruled-paper reader, responsive layouts and reduced-motion fallback. Registered in settings and versioned backup validation. CSS and assets remain offline.
- Open-source review: evaluated MIT wink-lemmatizer / wink-nlp; avoided adding their extra runtime/model payload because the app already has a local lemma helper, preserving performance and avoiding dependency/security surface.
- **PASS (source):** direct execution of production JavaScript in V8: 8 phrase/offset cases before write and 4 additional source cases after commit; theme registration, CSS surfaces and persistence passed 7 direct checks. Committed Node regressions `tools/phrase-lookup.test.cjs` and `tools/circuit-notebook.test.cjs`, wired to CI.
- **CI/Android:** NOT TESTED at this checkpoint: no confirmed run on exact workflow SHA `fad08783c6c333c6d87c12d13aa051dd168334f6`. Build is purposeful to verify real Node regressions, Gradle packaging and the visual theme's assets; V8 checks alone cannot prove Android/WebView integration. No APK SHA or artifact can be claimed yet.
- **Device/editorial:** NOT TESTED — Xiaomi Pad 5 theme visual/FPS, accessibility, full LT-01..13, real long licensed literature and recording quality. PR #1 stays Draft; no main merge or final APK.
- **2026-10-25 follow-up verification:** corrected one pre-existing test fixture's click offset to the real token start (SHA `555ef25ee00dba8a8b26965ad146e12ecc1ed458`). Executed **the exact committed** `tools/phrase-lookup.test.cjs` and `tools/circuit-notebook.test.cjs` using production files in V8 with a Node compatibility shim: **PASS** for both. This is not native Node or Android CI. No confirmed CI run/artifact for this SHA; device NOT TESTED.


## 2026-10-25 — Keyboard dictionary accessibility + Terracotta Gallery (LT-06/07/13 partial)
- **Production:** shared `lookupToken` in `reader-experience.js` now serves click/touch and keyboard Enter/Space, using the same exact English source offsets, lemma/phrase resolver and existing saved-word sheet. Paragraph Tab focus + ArrowRight enters per-word navigation; ArrowLeft/Right/Home/End, Escape and visible focus outline support hardware keyboards without creating a Tab stop for every word. This follows the W3C WAI-ARIA keyboard-interface focus-management pattern; physical TalkBack/Pad 5 behavior remains **NOT TESTED**.
- **Theme:** **Terracotta Gallery**, an offline museum-wall style with terracotta/cream/green palette, framed landscape-cover cards, diagonal hero, gallery-border reader, responsive geometry and reduced-motion fallback; registered in Settings and backup allowlist. Distinct from Circuit Notebook's technical grid.
- **PASS (source):** executed the **exact committed** `tools/keyboard-lookup.test.cjs` and `tools/terracotta-gallery.test.cjs` with production JS/CSS in a V8 Node-compatible fixture. Both PASS; tests also wired into Android CI. No physical touch/keyboard/TalkBack evidence.
- **CI investigation:** run [40166497055](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40166497055) failed on an obsolete click-handler regex; corrected it. Run [40166579375](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40166579375) passed the new tests but failed on a pre-existing novella test that assumed Harbor Ledger was the final theme; updated that brittle assertion without weakening its backup check. **Latest targeted CI:** [40166639849](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40166639849), **IN_PROGRESS** at this checkpoint on functional/test SHA `28ade1d082ab5e93cfef5bed4a2931f4944050d8`; Android compilation, APK SHA and artifacts **NOT TESTED until completed**.
- **NOT TESTED:** Pad 5 actual keyboard and TalkBack focus, theme screenshots/contrast/FPS, licensed long novels and recorded audio, independent release/upgrade verification. LT-01..13 still **IN_PROGRESS**. No main/merge/Library/Handoff writes.


### Keyboard dictionary + Terracotta Gallery — Android CI completed
- **PASS:** [Actions 40166639849](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40166639849) on exact functional/test SHA `28ade1d082ab5e93cfef5bed4a2931f4944050d8`. Native Node suite including both new tests, catalog/offline dictionary validation, Android Gradle unit/assemble, adaptive icon and critical offline asset packaging, Chromium screenshots and full reader/word-sheet/chapter/bookmark/translation/theme journey succeeded.
- **Artifacts:** `StoryLens-Debug-APK` ID **12588662750**; `StoryLens-UI-Screenshots` ID **12588577922**. CI-calculated **inner APK SHA-256** `ed3f643d5743a02ccb330efb48c1b4253ece637c080873fc003a3071e88fc0b9`; independent download/re-hash **NOT TESTED**. Debug artifact is **not** final.
- **NOT TESTED:** physical keyboard/TalkBack on Pad 5, exact device FPS/memory, editorial licensing acceptance, final upgrade/signed release. LT-01..13 remain **IN_PROGRESS**.


## 2026-10-25 — LT-03 keyboard navigation for long chapters + LT-13 Monochrome Zine
- **Production SHA:** `9cf9a1c29876a2fd4a09fb3d48c504ac02b7e10e`; workflow/test SHA `82a509b7214c7cdec351c61e51e0bdcd981d0d29` on existing Storylens draft PR #1. `main` untouched.
- **Functional reader improvement:** English paragraphs use a roving single `Tab` stop per chapter; `ArrowUp/ArrowDown` navigate between paragraphs, and the existing `ArrowRight/ArrowLeft` word navigation, `Enter/Space` dictionary, and sentence translation remain. Boundary arrows and Tab are not trapped. Pattern checked against W3C WAI-ARIA keyboard interface guidance: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/ .
- **Distinct theme:** `Monochrome Zine` is a high-contrast black/off-white/lime indie-print layout with cut-paper masthead, staggered issue cards, squared cover frames, print-style reader margin, responsive mobile styles and reduced-motion override. Registered in Settings and offline backup allowlist; no remote resources.
- **PASS** [GitHub Actions run 40169849998](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40169849998): actual `node tools/monochrome-zine.test.cjs` and `node tools/paragraph-roving.test.cjs` both logged PASS; existing curated Node suite, Android Gradle unit/Debug assembly, APK asset/adaptive-icon packaging, and Chromium library/reader smoke all succeeded. Previous intermediate run 40169836610 was canceled by concurrency; do not count it as a failure.
- **Real Debug artifacts:** `StoryLens-Debug-APK` ID **12589033112**; `StoryLens-UI-Screenshots` ID **12588923583**. CI-calculated inner `app-debug.apk` SHA-256 **`527803e572d12ba0c904fdd59fbefeb803d7faa0af2e4fd2bc84b6e1dcd7748b`**. Independent artifact re-download/re-hash **NOT TESTED**.
- **NOT TESTED:** Xiaomi Pad 5 physical keyboard/TalkBack, long-book frame pacing, visual theme acceptance, real device install/upgrade, full-length licensed literature/Arabic editorial review, recorded licensed music, final LT-01..13 acceptance. This is a tested Debug milestone, not a final APK. **IN_PROGRESS**.


## 2026-10-25 — Arabic-tolerant bilingual chapter search + Saffron Archive (LT-07/03/13)
- Production search now folds Arabic vowel marks, tatweel, hamza/alef, ya and taa-marbuta variants without altering the displayed source or Arabic translation. The lazily built index retains normalized strings but no redundant English/Arabic source copies, and rebuilds when a later catalog batch is appended.
- New distinct **Saffron Archive** archival-folio theme: numbered-spine cards, green/gold manuscript desk, matte split hero and paper reader, responsive tablet/phone layout, static CSS only. Backup accepts and restores the theme.
- **PASS (source V8):** executed the actual committed `lingua-shell.js` with eight focused checks: Arabic diacritics/variant search, English case, catalog growth, theme activation and persisted selection.
- **NOT TESTED:** committed native Node test, Android CI/APK on this head, Xiaomi Pad 5 rendering, visual contrast, large-book memory/scroll performance, and full editorial acceptance. No device FPS claim.
- **Purposeful build question:** Does the new theme/search pass the real Node test and package/compile inside Android? V8 source tests cannot verify AAPT/Android packaging or Chromium UI. Run one CI build for this functional milestone, not a routine build per file.


### Validation closure for Arabic search / Saffron Archive (2026-10-25)
- **PASS:** targeted Android CI [40181610305](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40181610305), functional SHA `996e7504ef5688d5cec1e016f302b85780bd5e7a`: native Node tests, Gradle, packaged assets and Chromium journey.
- **PASS:** independently extracted 4,264,860-byte `app-debug.apk` from GitHub Artifact **12594795168**, SHA-256 `0b920f85f9caed4975c127a94737e467e4eebe4efb17d542c842090b91635236` matches CI. New JS/CSS theme and search modules confirmed inside APK.
- **NOT TESTED:** Pad 5/Android installation, FPS/RAM, accessibility, editorial/long-book acceptance. This is a debug validation build, not a final release.


## 2026-10-25 — LT-03/07/13 search-navigation and Bauhaus Studio milestone
- Production changes: full-text search now refreshes when chapters/paragraphs are appended to an existing work (not only when the story count changes); a search hit visibly highlights and keyboard-focuses the exact English paragraph, with an ephemeral 2.6-second marker and no mutation of English/Arabic source text. Added the offline **Bauhaus Studio** poster-geometry theme, Settings gallery choice and backup whitelist.
- Regression: `tools/chapter-search.test.cjs` now checks new chapter invalidation, paragraph focus/highlight/cleanup, theme geometry and persistence. **Source edits committed; CI/source test result PENDING** until workflow run completes.
- **Purposeful Android build question:** Does Android package the changed JS/CSS/backup, pass the real Node VM search regression and Chrome reader flow, and render the new CSS without parse errors? Source string inspection cannot prove APK packaging or browser integration. One branch build, not per-file builds.
- **NOT TESTED:** Xiaomi Pad 5 paragraph focus/TalkBack, theme contrast and real FPS/thermal; licensed long novels, editorial Arabic review and licensed audio remain open. Debug is not final. No main merge.

### LT search/Bauhaus CI and artifact evidence — 2026-10-25
- **PASS source/V8:** 5 direct production-script checks: bilingual search, appended chapter invalidation, paragraph focus/highlight/cleanup, theme selection and offline preference persistence. This is not a physical-device test.
- **PASS Android CI:** [run 40185612369](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40185612369), source SHA `953437dbf67369f569c8939521952573a0c9958a`; Node regressions, Gradle APK, packaged assets, Chromium journey.
- **PASS independent artifact rehash:** artifact `12595952491` contains `app-debug.apk` (4,266,184 bytes), SHA-256 `fe2d2b36d0d08fb486e24889b844be3c60a43cee270198a729c83f0b8ca0d6c3`, independently extracted and matched `APK_SHA256.txt`. New theme present in packaged JS/CSS/backup.
- **NOT TESTED:** Pad 5/phone installation, TalkBack focus, theme contrast, FPS/thermal, editorial long books/audio; final release remains IN_PROGRESS.


## 2026-10-25 — LT lexical source-boundary and Mosaic Courtyard checkpoint
- **Production/tests SHA:** `0357d3804570816f65e0c5ba5772c8d90943f27d` on draft PR #1. No main changes.
- **Production:** reject clicks selecting only part of a word/contraction; support combining marks in token spans; refresh lazy phrase/dictionary indexes when an existing story or dictionary array receives appended entries. This prevents missing later curated content batches while preserving original meanings. Added a distinct static, offline **Mosaic Courtyard** theme (ceramic-grid, arch hero, offset cards), selectable in Settings and accepted by backup validation.
- **PASS (direct V8 execution on fetched production):** 14 checks for exact phrase selection, complete token boundaries, accented/combining forms, appended term/dictionary lookup, theme registration, CSS and backup whitelist. Regression assertions committed in `tools/phrase-lookup.test.cjs`.
- **NOT TESTED:** native Node execution of the committed test, new SHA Android CI/APK packaging, visual theme screenshot, Pad 5 performance, TalkBack and full editorial content. No new verified APK or SHA-256 for this checkpoint; do not reuse earlier build fingerprints.
- **Next:** verify Node/Android CI on this exact source; independent device acceptance and long licensed literature remain open.


## 2026-10-25 — Serial chapter navigation and honest incomplete-book status
- **Production:** `lingua-chapter-navigation.js` decorates the fully installed reader after locale wrappers. The reader exposes accessible previous/next chapter buttons through existing `stlChapter` navigation (which preserves legacy chapter/scroll storage). The Towle novel now declares `totalChapters=37`; when only 2 chapters are packaged, the final visible chapter says **To be continued** rather than falsely claiming **The End**. Arabic and English UI labels are supported; complete books retain their existing ending. Added responsive navigation CSS and `tools/chapter-navigation.test.cjs`.
- **PASS (production V8 isolated):** fetched the committed production module and executed three DOM scenarios: ongoing English chapter 2/37, Arabic chapter 1/37, and a completed 2/2 book; navigation controls and status labels matched expectations.
- **NOT TESTED:** execution of the committed Node test file, full Android CI on this branch SHA, Chromium, Xiaomi Pad 5, accessibility/TalkBack, app install and final APK. The isolated V8 harness is **not** device acceptance.
- **Build question:** does the new script load after the locale wrappers in Android WebView, and do chapter controls preserve back navigation on device? Source inspection alone cannot prove this; a targeted Android/Chromium validation is justified, not a routine build after every edit.
- **Open:** only 2/37 authentic Towle chapters; English/Arabic editorial review, full licensed audio catalog and independent device acceptance remain IN_PROGRESS.

## 2026-10-25 — Serialized novel chapter progress and direct navigation
- The library progress denominator now uses `totalChapters` when larger than the offline `chapters.length`. For the Towle novel, finishing the currently published second chapter must not display 100% of 37 chapters. The badge also reports the number available offline.
- The reader chapter-end panel now offers a keyboard/touch chapter selector populated **only from locally available chapters**, preserving the existing `stlChapter` progress/scroll/bookmark path. Chapter titles use Arabic or English metadata without inserting HTML.
- **PASS (direct production V8 smoke):** ran the committed chapter-navigation module with two available chapters out of 37, selected the first chapter, and rejected a jump to unpublished chapter 37. Checked that the library denominator uses total chapters. This is not an Android or full Node test.
- **NOT TESTED:** complete Node test and Android/Chromium CI on the latest source SHA, Xiaomi Pad 5 navigation, TalkBack, portrait/landscape, real FPS, complete licensed literature and final acceptance.
- **Purposeful Android build question:** does the updated reader/navigation JS pass the repository's actual Node test and does the WebView asset remain packaged in an Android Debug APK? Static/V8 checks cannot verify Gradle packaging or Chromium flow. No physical device is accessible in this run.
