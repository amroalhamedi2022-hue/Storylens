## 2026-10-25 — Packaged draft Chapter IV: Departure from Charing Cross
- English: complete 43 paragraphs / 942 words from George Makepeace Towle's 1873 translation, Standard Ebooks CC0 editorial transcription, source https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-4.xhtml .
- Arabic: 43 newly drafted aligned paragraphs; independent bilingual editing **NOT TESTED**.
- 14 source-occurring contextual expressions; new offline original SVG scene of the rainy Victorian Charing Cross platform.
- New static Midnight Platform theme (iron canopy, amber lamps, departure-board cards), registered in Settings and backup.
- Serial status: **4 of 37 chapters**, not the complete book. International redistribution rights and actual Pad 5 QA **NOT TESTED**.
- The Node regression validates source count, narrative anchors, lexicon, local art and theme wiring; human literary review and device verification remain separate.

# Lingua Tales — literature provenance and editorial acceptance

Updated 2026-10-25. This ledger distinguishes **packaged original text** from
**researched but not yet imported** classic editions. A book is not accepted
merely because its title is present in a roadmap.

## Packaged draft: Around the World in Eighty Days — Chapter II (Towle; Standard Ebooks transcription)

- ID: `around-the-world-in-eighty-days-towle`; appended by
  `app/src/main/assets/classic-verne-towle-ch02.js` after Chapter I.
  **Two of 37 were packaged at this checkpoint; Chapter III is now also available**, not a completed novel.
- **English:** all 11 source paragraphs, **1,114 English words**, checked
  paragraph-by-paragraph against the public-domain Towle translation as
  transcribed by Standard Ebooks (11/11 exact matches after HTML and
  typographic spacing normalization). No synopsis or fabricated text.
- **Arabic:** 11 new aligned translations; **independent bilingual literary
  editing NOT TESTED**. Fourteen additional source-occurring
  contextual expressions; one original offline SVG of Fogg's numbered
  wardrobe and matching clocks, distinct from the Chapter I street scene.
- **Upstream English source:** 
  https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-2.xhtml
  (upstream Git blob `62c2a501351321b1251309ffd2d4587ca4a44e5a`).
  **Rights:** Standard Ebooks `LICENSE.md` (blob
  `87aa7d003e74ba350bcce690938ced732f96e06e`) states the
  original text is believed public domain in the United States, and
  contributors dedicate their own editorial contributions worldwide via
  CC0 1.0. Territory-specific rights verification remains **NOT TESTED**.
  No publisher logo or third-party art is included.
- **Source verification:** production scripts evaluated in V8 with the
  upstream XHTML: 11/11 paragraphs matched, 11/11 Arabic passages present,
  14 new terms appear in the English, correct chapter load order and
  distinct offline illustration. These checks do **not** verify Arabic
  translation quality or device performance.
- **Theme:** Station Tickets (railway ticket geometry, blue/ivory/red palette)
  registered in Settings, CSS and offline backup whitelist.
- **Android CI and Pad 5:** see `docs/AUTONOMOUS_ACCEPTANCE.md`; do not
  infer successful packaging or real-device acceptance from V8 checks.
- **Next batch:** Chapter III has now been added; independently proofread it,
  with independent editorial review of Chapters I–II before final release.

## Packaged draft: Around the World in Eighty Days — Chapter I (Towle 1873)

- ID: `around-the-world-in-eighty-days-towle`; asset:
  `app/src/main/assets/classic-verne-towle-ch01.js`.
- **Authentic Chapter I of 37** is packaged, not a completed novel.
  English: 1,453 words in 29 continuous source-aligned passage groups;
  new Arabic companion translations: 29; 14 contextual vocabulary/idiom cards;
  one original locally generated Victorian Saville Row SVG scene.
- Author: **Jules Verne (1828–1905)**; original French work (1872).
  English translator: **George Makepeace Towle (1841–1893)**; 1873 edition.
- Edition and full first chapter verified against:
  https://en.wikisource.org/wiki/Around_the_World_in_Eighty_Days_(Towle)/Chapter_1
  and https://www.gutenberg.org/ebooks/103 .
  No Gutenberg trademark, edition images or modern translation is bundled.
  Project Gutenberg lists the Towle text public domain in the **USA**.
  Both original author and translator died over 120 years ago, a strong
  public-domain rationale in common life+70 jurisdictions; **territory-specific
  redistribution review is still open**, as is attribution/edition cross-check.
- Arabic translation is a **new companion draft**, not a pre-existing published
  Arabic translation; independent bilingual editorial proofreading is
  **NOT TESTED**. The opening chapter is marked as a continuing batch.
- Functional source checks: `tools/verne-towle.test.cjs`, including chapter
  beginning/end, continuity anchors, source-occurring lexicon, bilingual
  alignment, offline art, settings theme and backup. CI/Pad 5 device acceptance
  to be recorded separately; do not claim final release.
- Chapter II is now included as a separate verified English/Arabic draft;
  next editorial batch is **complete Chapter III**, with independent review.
  No placeholder text should be represented as a completed chapter.

## Packaged: The Salt Meridian (original short serial)

- ID: `the-salt-meridian`; local source: `app/src/main/assets/novella-salt-meridian.js`.
- Status: **SOURCE/CI PASS; EDITORIAL REVIEW NOT TESTED**.
- Five complete chapters, 50 aligned English/Arabic passages, 1,470 English
  words, 14 source-occurring edited expressions, five locally synthesized SVG
  chapter-hero scenes. This is a **short serial story**, not a full-length
  novel and **not a Jules Verne translation**.
- Provenance: original text created for Lingua Tales; no third-party literary
  excerpts, audio, licensed photography or externally sourced illustrations.
  The Arabic companion text requires independent fluent-editor review before
  claiming professionally edited translations.
- Offline packaging and browser journey: Actions run 40155296890 on functional
  SHA `c00b5accb91e44bbded8137c0cdaae2000ad81bc` PASS.
- Remaining: Pad 5 reading/performance, scene fidelity, editorial QA, any
  additional long-form content and signed final release.

## Continuing research: remaining Chapters XIV–XXXVII of Around the World in Eighty Days

- Author: Jules Verne (1828–1905); original French novel published 1872.
- Specific **English translation**: George Makepeace Towle (1841–1893),
  published 1873; do not substitute a modern translation without rights review.
- Primary source: https://www.gutenberg.org/ebooks/103
- Edition/reference: https://en.wikisource.org/wiki/Around_the_World_in_Eighty_Days_(Towle)
- Project Gutenberg lists this edition **public domain in the USA**. Copyright
  status outside the USA, any trademark conditions for Project Gutenberg
  distribution, and each image's own rights require independent checking
  before public APK distribution. Avoid carrying Project Gutenberg branding
  or license text into an app without reviewing their redistribution terms.
- **Current package status supersedes the historical checkpoint below: Chapters I–IX are packaged as bilingual drafts; Chapters X–XXXVII are NOT PACKAGED.** Do not claim the complete novel is available offline in Lingua Tales.
- Next coherent editorial milestone: finish redistribution-territory review,
  add contiguous authentic Chapters IV onward with fresh Arabic
  paragraph translations and source-to-paragraph QA, retain chapter numbering,
  then test actual reader progress, vocabulary and visual context. Prefer
  licensed historical illustrations with per-file provenance and attribution.

## Packaged draft: Around the World in Eighty Days — Chapter III (Towle; Standard Ebooks)

- Added 2026-10-25 on the existing PR #1 branch. **Three of 37 authentic chapters
  now packaged**, not a completed book.
- English source: **65 original prose paragraphs** from the 1873 Towle
  translation as transcribed by Standard Ebooks, plus the **complete eight-leg
  80-day itinerary** preserved as an additional aligned passage. 66 aligned
  English/Arabic entries, **1,980 English words**, 18 new source-occurring
  contextual terms.
- Exact upstream chapter:
  https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-3.xhtml
  Source XHTML is flattened to plain English text with typographic formatting
  and invisible word joiners removed. This is not a synopsis.
- New Arabic draft translation covers all 66 entries; **independent fluent
  literary review NOT TESTED**.
- Original offline SVG depicts the Reform Club whist table, clock and itinerary;
  no third-party artwork or remote requests. Distinct **Reform Club Brass**
  theme is registered in Settings and offline backup.
- **PASS direct production-script V8:** 3 chapters, 66 bilingual entries,
  itinerary, source-occurring terms, unique local illustration.
- **FAIL initial CI** [40217571565](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40217571565)
  on SHA `8e1e5a78aef9edd8ca52d708aaec8597164e3baf`: newly introduced
  regression used a literal backslash-s instead of whitespace. Fixed test
  regexes in SHA `00b206fb8386777e683ca3255b1898259be0c2d0`.
  [CI 40217753579](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40217753579)
  **completed SUCCESS** on source SHA `00b206fb8386777e683ca3255b1898259be0c2d0` (Node, Android Gradle, offline asset checks, Chromium).
- **CI-calculated APK SHA-256:** `47fb8906def0eca5d80e4c9e9a7a408a05b9b42daf7ef453a8031a7cffd1dee8`; Debug artifact **12607598645**; **PASS independent rehash:** downloaded Debug Artifact ZIP and independently extracted/hashed the 4,310,321-byte APK; checksum matches CI. Pad 5 device tests NOT TESTED.
- US public-domain rationale for Towle 1873; Standard Ebooks editorial CC0.
  **Territory-specific redistribution, independent Arabic proofreading,
  Pad 5 device FPS/RTL/TalkBack and final APK NOT TESTED**.

## Packaged draft: Around the World in Eighty Days — Chapter V (Towle; Standard Ebooks)

- Added on the existing PR #1 branch. **Five of 37 chapters are packaged**, not a completed novel.
- English source: 14 source paragraphs including the Suez-to-London telegram, 933 words, transcribed from Standard Ebooks' CC0 editorial XHTML:
  https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-5.xhtml
- Arabic: 14 aligned companion draft translations. Independent literary proofreading and territory-specific redistribution clearance remain NOT TESTED.
- Added 18 expressions that occur in the chapter source, a local original SVG of the Victorian newspaper/exchange setting, and the distinct offline **Exchange Gazette** theme with backup validation.
- Test coverage checks paragraph alignment, substantial source length, source-bound expressions, script load order, chapter-specific illustration and theme/backup registration. **PASS Android CI:** [run 40232066464](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40232066464) on final tested SHA `e9affbf84d3a5a2c88ea0830e99b29aa6d7d4f2c`. Debug artifact `12613321921`; CI-calculated inner APK SHA-256 `52e065d99a08bea3f2f218508f964cf00c613c4c3d4d08b5833c4c394507dfea`; independent APK re-hash NOT TESTED.
- The source edition is public domain in the United States; this does not by itself settle distribution rights in every territory.

## Rules

- Do not call an original AI-assisted serial a published historic classic.
- Never use web image-search results as proof of reuse permission.
- Every imported edition/translation/image needs a source URL, author/editor,
  license or public-domain rationale, checksum and per-chapter QA.
- No third-party PDF, personal medical data, model weights or secrets belong
  in this literature repository.


## 2026-10-25 — Towle Chapter VI (Suez and detective Fix)
- Complete original English chapter VI from [Standard Ebooks Towle 1873 transcription](https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-6.xhtml), 37 aligned prose/dialogue paragraphs and a new 37-paragraph Arabic draft. English source is public domain in the US; Standard Ebooks editorial transcription is CC0. Independent Arabic review and territorial distribution clearance remain **NOT TESTED**.
- Seventeen source-occurring English vocabulary/idiom entries, bespoke original offline Suez steamship SVG, and a distinct Suez Quays maritime chart theme. No unlicensed stock photo or network image.
- Only **six of the original 37 chapters** are now packaged, not the whole novel. Prior historical statements about five chapters describe earlier checkpoints.
- New Node content regression checks original paragraph alignment, source length, source-bound terms, art uniqueness, theme and backup compatibility. Android/Chromium/device result recorded separately in acceptance ledger.


## Towle Chapter VII — Consular passport inspection
- English source: [Standard Ebooks, Towle 1873 transcription, Chapter VII](https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-7.xhtml).
- SHA-256 of upstream XHTML fetched for this batch: `02d79d84d624a78dc6ac239e8a565ea001cd5fa1559014479c09a18b99cfb836`. The source has a header bridgehead plus 39 narrative paragraphs; all 39 narrative paragraphs are bundled in original English wording with 39 aligned Arabic companion drafts.
- Standard Ebooks editorial transcription is CC0; Towle's 1873 English translation is public domain in the United States. Territory-specific redistribution clearance and independent Arabic literary proofreading remain **NOT TESTED**.
- Added 19 source-occurring vocabulary/phrase entries, a bespoke offline SVG consulate/passport scene, and the distinct **Consular Ledger** theme. No external image or font asset is loaded.


## Towle Chapter VIII — Suez telegraph dispatch
- English source: [Standard Ebooks, Towle 1873 transcription, Chapter VIII](https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-8.xhtml).
- The source bridgehead is used as the chapter title; the 59 narrative paragraphs are bundled in English with 59 aligned Arabic companion drafts (1,080 English words).
- Standard Ebooks editorial transcription is CC0; Towle's 1873 English translation is public domain in the United States. Territorial redistribution clearance and independent Arabic literary proofreading remain **NOT TESTED**. The upstream XHTML digest was not computed in this batch.
- Added 26 source-occurring learning phrases, an original offline SVG of the telegraph dispatch desk and Red Sea steamship, and the distinct **Red Sea Dispatch** theme. No remote image, audio or font asset is loaded.


## Packaged draft: Around the World in Eighty Days — Chapter IX (Towle; Standard Ebooks)

- Added on the existing Storylens PR #1 branch. **Nine of 37 chapters are packaged**, not the complete novel.
- English: 30 original prose/dialogue paragraphs, 1,552 words, transcribed from the 1873 George Makepeace Towle translation as published in Standard Ebooks' CC0 editorial XHTML.
- Exact source: https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-9.xhtml
- Source XHTML SHA-256: `d61493072b960641c3bd7c0145dad1414b857dbcacabd058e09bf406b42fda1b`.
- Arabic: 30 aligned companion draft translations. **Independent Arabic literary proofreading and territory-specific redistribution clearance remain NOT TESTED.**
- Added 23 source-occurring contextual vocabulary/idiom entries, an original offline SVG of the Mongolia crossing the Indian Ocean toward Bombay, and the visually distinct **Monsoon Meridian** theme registered in Settings and backup.
- Automated coverage checks paragraph alignment, source length, source-bound terms, chapter load order, offline illustration, theme registration and backup allowlist. Android/Chromium integration and physical Pad 5 checks remain pending until the targeted workflow completes.


## Towle Chapter X — Bombay railway departure and lost shoes
- Source: [Standard Ebooks, Towle 1873 Chapter X](https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-10.xhtml).
- 24 narrative paragraphs, 1559 English words and 24 aligned Arabic companion drafts; source comparison passed before commit. Upstream SHA-256 not calculated in this run.
- Standard Ebooks editorial work is CC0; Towle's 1873 translation is public domain in the US. Territorial redistribution clearance and independent Arabic literary proofreading remain NOT TESTED.
- Added 26 source-occurring phrases, offline Bombay railway SVG and Deccan Timetable theme.

## Towle Chapter XI — Kholby and the elephant conveyance
- English source: Standard Ebooks, Towle 1873 transcription, Chapter XI: https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-11.xhtml
- Bundled source text contains 49 narrative paragraphs (2,533 words) in English, with 49 aligned Arabic companion drafts. The source bridgehead is the chapter title, not a duplicate paragraph.
- Standard Ebooks editorial work is CC0; Towle's 1873 translation is public domain in the United States. Territory-specific redistribution clearance and independent Arabic literary proofreading remain NOT TESTED.
- Added 29 source-occurring contextual phrases, a locally generated Kholby forest/unfinished railway/elephant SVG, and the distinct Kholby Crossing theme. The image is generated as offline SVG by production code; no external image URL is loaded.
- Android CI 40253482067 passed Node regressions, Gradle/Android packaging and Chromium reader integration. Independently verified Debug APK SHA-256 d5b70b14d80fb833ac38ed4956d9a853cedf0553a0c4d0269fb8254fc1e5e7b8 (4,408,785 bytes). Physical Pad 5 and final signed release remain NOT TESTED.


## Towle Chapter XII — Across the Vindhya forests

- English source: Standard Ebooks transcription of George Makepeace Towle's 1873 translation, Chapter XII: https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-12.xhtml
- Packaged source: 48 paragraph blocks (including the chapter bridgehead), approximately 2,100 English words, with 48 aligned Arabic companion drafts. English strings are extracted from the upstream XHTML with markup/entities/spacing normalized; the Node regression verifies key source phrases, bilingual alignment and term occurrences.
- Added 28 source-occurring contextual entries, an original local SVG of the elephant route through the Vindhya forest, and the distinct **Vindhya Passage** theme. Theme selection and backup allowlist are updated; no remote images, fonts, audio, permissions or model files were added.
- Standard Ebooks editorial transcription is CC0; Towle's 1873 English translation is public domain in the United States. Territory-specific redistribution review and independent Arabic literary proofreading remain **NOT TESTED**.
- The chapter includes historical descriptions of sati and threatened coerced immolation; the Arabic draft preserves the plot context without presenting the practice as acceptable. Editorial sensitivity review remains **NOT TESTED**.


## Towle Chapter XIII — Passepartout's rescue at Pillaji

- English source: Standard Ebooks transcription of George Makepeace Towle's 1873 translation, Chapter XIII: https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-13.xhtml
- Bundled source text contains 48 narrative paragraphs (the bridgehead is used as the chapter title), 2,036 English words, and 48 aligned Arabic companion drafts. English text is normalized only for XHTML markup, nonbreaking spacing and invisible word-joiners; independent Arabic literary proofreading remains NOT TESTED.
- Added 34 source-occurring contextual phrases, an original local SVG depicting the party's dawn escape without graphic violence, and the distinct **Dawn Escape** theme. Theme selection and backup validation are updated; no remote image, font, audio or model file was added.
- The episode portrays coercion and threatened widow-burning as danger in the historical plot, not as endorsement. Historical-sensitivity review, territory-specific redistribution clearance and independent Arabic literary review remain NOT TESTED.
- Standard Ebooks editorial work is CC0; Towle's 1873 English translation is public domain in the United States. Other-territory rights clearance remains NOT TESTED.


## Packaged draft: Around the World in Eighty Days — Chapter XIV (Towle; Standard Ebooks)

- Source: [Standard Ebooks Towle transcription, Chapter XIV](https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-14.xhtml), English translation by George Makepeace Towle (1841–1893); Standard Ebooks editorial transcription is CC0. Territorial distribution review remains a separate gate.
- Added 27 source-aligned English/Arabic draft paragraphs (1,917 English body words), 28 contextual entries found in the English text, an original offline Ganges/railway SVG, and a distinct Ganges Panorama theme registered in Settings and backup.
- This is **14 of 37** chapters, not the complete novel. Arabic is a draft requiring independent literary/sensitivity review; Pad 5 and final release remain NOT TESTED.


## Chapter XIV verification record — 2026-10-26
- Android CI: [run 40266145893](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40266145893) **PASS**. The browser fixture opens Chapter XIV in the actual reader and verifies the rendered text; the screenshot artifact [12626636801](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40266145893/artifacts/12626636801) includes `verne14-phone.png`.
- APK artifact [12626597198](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40266145893/artifacts/12626597198), size 4,458,901 bytes. SHA-256 independently recomputed from the extracted APK: `7a935f68cc542bdb4a23c8f8a46fa0fff0e09fad87f57c6afeb6cc8011a36afc`, matching the CI manifest.
- The screenshot is a Chromium simulation, not Xiaomi Pad 5 device evidence. Arabic literary/sensitivity review, territorial rights review, RTL/TalkBack, performance and final signed release remain NOT TESTED.


## Packaged draft: Around the World in Eighty Days — Chapter XV (Towle; Standard Ebooks)

- Source: [Standard Ebooks Towle transcription, Chapter XV](https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-15.xhtml), English translation by George Makepeace Towle (1841–1893); Standard Ebooks editorial transcription is CC0. Territorial distribution review remains a separate gate.
- Added 33 English source-aligned paragraphs (about 1833 English words), 33 Arabic companion draft paragraphs and 36 contextual entries found in the English text. The new offline Calcutta courtroom SVG and distinct Calcutta Ledger theme are registered in Settings and backup validation.
- This is 15 of 37 chapters, not the complete novel. The chapter includes a false sacrilege accusation and a mistaken legal proceeding; the Arabic translation is a draft and needs independent literary/sensitivity review. Pad 5 and final release remain NOT TESTED.
- Standard Ebooks editorial work is CC0; Towle's 1873 English translation is public domain in the United States. Territorial redistribution clearance remains NOT TESTED.


## Packaged draft: Around the World in Eighty Days — Chapter XVI (Towle; Standard Ebooks)

- Source: [Standard Ebooks Towle transcription, Chapter XVI](https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-16.xhtml), English translation by George Makepeace Towle (1841–1893); Standard Ebooks editorial transcription is CC0. Territorial distribution review remains a separate gate.
- Added 25 source-aligned English/Arabic draft paragraphs (1,614 English words), 32 contextual entries found in the English text, an original offline Rangoon steamer SVG, and a distinct Rangoon Passage theme registered in Settings and backup.
- This is 16 of 37 chapters, not the complete novel. The historical text contains period language about Indigenous peoples; the Arabic is a draft and requires independent literary/sensitivity review. Pad 5 and final release remain NOT TESTED.
- Standard Ebooks editorial work is CC0; Towle's 1873 English translation is public domain in the United States. Territorial redistribution clearance remains NOT TESTED.


## Chapter XVII — Singapore to Hong Kong
- Exact English edition: Standard Ebooks editorial transcription of George Makepeace Towle's 1873 translation, source file `src/epub/text/chapter-17.xhtml`, blob SHA-1 `9032cb0cbc51867336e21dfd73885a2f8bee7c66`.
- Source URL: https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-17.xhtml
- Standard Ebooks identifies its editorial transcription as CC0; the underlying Towle translation is treated as public domain in the United States. Territory-specific redistribution clearance remains NOT TESTED. Arabic paragraphs are editorial drafts pending independent review.
- The Singapore Lantern scene is original local SVG artwork created for this project; no third-party image was copied.


## Chapter XVIII — Hong Kong and the delayed Carnatic
- Exact English edition: Standard Ebooks editorial transcription of George Makepeace Towle's 1873 translation, source file `src/epub/text/chapter-18.xhtml`, blob SHA-1 `74292ce1802d0b83eeb13605795d60fc04b0fce7`.
- Source URL: https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-18.xhtml
- The offline chapter adds **31 aligned English/Arabic draft passages**, approximately **1,339 English words**, 35 context-bound vocabulary/phrase entries, and original local SVG artwork for the storm-bound Rangoon. The **Typhoon Timetable** theme is a distinct storm-chart layout registered in Settings and backup validation.
- Standard Ebooks identifies its editorial transcription as CC0; Towle's underlying 1873 English translation is treated as public domain in the United States. Territory-specific redistribution clearance remains **NOT TESTED**. Arabic text is a draft pending independent literary review; no claim of professional proofreading or Pad 5 acceptance is made.
- The SVG was drawn in-project and does not copy third-party illustration assets.


## Chapter XIX — “In which Passepartout takes a too great interest in his master, and what comes of it”
- **Source:** Standard Ebooks' editorial transcription of George Makepeace Towle's English translation of Jules Verne, *Around the World in Eighty Days*, Chapter XIX: https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-19.xhtml
- **Exact source blob SHA-1:** `c1d30bba75d0a72629c6047d436c745ca8844b5e`.
- **Source/asset status:** the English text is transcribed from the linked XHTML chapter; Standard Ebooks' editorial transcription is CC0. Towle's 1873 translation is public domain in the United States; redistribution clearance for every target territory remains **NOT TESTED**.
- **Arabic companion:** 71 aligned paragraph-level Arabic draft translations, not yet independently proofread by a literary editor. The chapter includes period colonial framing and historical depictions of opium use; the translation preserves the source's historical narrative and must not be read as endorsement or medical guidance.
- **Vocabulary:** 34 context-bound terms/phrases; automated checks require each entry to occur in the English chapter body.
- **Illustration:** original offline SVG “Victoria Harbour Dispatch”, generated as project artwork; no remote image or third-party illustration is used.

## Chapter XX — “In which Fix comes face to face with Phileas Fogg”
- **Source:** Standard Ebooks editorial transcription of George Makepeace Towle's 1873 English translation of Jules Verne, Chapter XX: https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-20.xhtml
- **Exact source blob SHA-1:** `844ca4176ab3330e01b2745b68a51c6737d66a94`.
- **English:** 72 aligned paragraph entries, 1,744 words in the current committed transcription; CI source checks enforce key phrases and the chapter's source-bound vocabulary.
- **Arabic:** 72 aligned companion draft passages; independent literary proofreading remains **NOT TESTED**.
- **Vocabulary:** 33 contextual entries; two surface forms were corrected to match the source exactly (“shuffling his hat” and “venturing so far”). The test continues to require every glossary term to occur in the chapter body.
- **Illustration/theme:** original offline Shanghai/Tankadere SVG scene and distinct **Shanghai Wind Ledger** theme, registered in Settings and backup. No remote image is required.
- **Rights:** Standard Ebooks identifies its editorial contribution as CC0; the underlying 1873 Towle translation is treated as public domain in the United States. Territory-specific redistribution clearance remains **NOT TESTED**.


## Chapter XXI — The Tankadere races the typhoon toward Shanghai

- **Source:** Standard Ebooks editorial transcription of George Makepeace Towle's 1873 English translation of Jules Verne, Chapter XXI: https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-21.xhtml
- **Exact source blob SHA-1:** `47c6a1144e756752618e36c56f21832d1020f3fb`.
- **English:** 55 source-aligned body paragraphs, approximately 2,562 words; source text is normalized from the XHTML without rewriting the English passage.
- **Arabic:** 55 aligned companion draft translations. They are editorial drafts and have not received independent literary proofreading.
- **Vocabulary:** 33 contextual entries; automated regression requires each surface phrase to occur in the English chapter body.
- **Illustration/theme:** original offline SVG of the Tankadere under storm conditions with a distress signal, plus distinct **Typhoon Signal** theme registered in Settings and backup.
- **Rights:** Standard Ebooks identifies its editorial contribution as CC0; the underlying Towle translation is treated as public domain in the United States. Territory-specific redistribution clearance remains **NOT TESTED**.


## Chapter XXII — Passepartout arrives in Yokohama

- **Source:** Standard Ebooks editorial transcription of George Makepeace Towle's 1873 English translation of Jules Verne, Chapter XXII: https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-22.xhtml
- **Exact source blob SHA-1:** `1ae20fed64d05d867c7021cdfd1033a7fc71a879`.
- **English:** 31 source-aligned body paragraphs, 2,072 tokenized words; the module records the upstream source and the regression requires source-occurring glossary phrases.
- **Arabic:** 31 aligned companion draft translations. Independent literary proofreading remains **NOT TESTED**.
- **Vocabulary:** 34 contextual entries; the Node regression checks every English surface phrase against the chapter body.
- **Illustration/theme:** original offline SVG of Yokohama harbour, a Japanese junk and red lanterns; distinct **Yokohama Lantern** theme is registered in Settings and backup.
- **Rights:** Standard Ebooks dedicates its editorial contribution to CC0 and the 1873 Towle translation is treated as public domain in the United States. Territory-specific redistribution clearance remains **NOT TESTED**.


## Chapter XXIII — Passepartout’s long-nose circus escape

- **Source:** Standard Ebooks editorial transcription of George Makepeace Towle’s 1873 English translation of Jules Verne, Chapter XXIII: https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-23.xhtml
- **Exact source blob SHA-1:** `0757ba736579c0474a2e8e55b4dd4262a78da966`.
- **English:** 53 source-aligned body paragraphs, 1,933 tokenized words; source paragraph boundaries are preserved in the module.
- **Arabic:** 53 aligned companion translation drafts. Independent literary proofreading remains **NOT TESTED**.
- **Vocabulary:** 35 contextual entries; the regression checks every surface phrase against the English chapter body.
- **Independent source comparison (2026-10-26):** all 53/53 narrative paragraphs match the upstream XHTML after markup/entity/whitespace normalization; the Chapter XXIII comma spacing was corrected to match the source.
- **Illustration/theme:** original offline SVG of the travelling circus’s paper-lantern stage and acrobatic pyramid; distinct **Paper Lantern Circus** theme registered in Settings, reduced-motion styling and backup allowlist.
- **Rights:** Standard Ebooks dedicates its editorial contribution to CC0 and the underlying 1873 Towle translation is treated as public domain in the United States. Territory-specific redistribution clearance remains **NOT TESTED**.


## 2026-10-26 — Towle Chapter XXIV: Pacific crossing and the Golden Gate

- **Source:** Standard Ebooks editorial transcription of George Makepeace Towle's 1873 English translation of Jules Verne, Chapter XXIV: https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-24.xhtml
- **Upstream Git blob SHA-1:** dd14ef8731bcc974e5d7c8f025f50d408f58badc; 36 narrative paragraphs and 1,955 English words after XHTML markup/entity normalization. Standard Ebooks' editorial transcription is CC0; the underlying 1873 translation is public domain in the United States. Territory-specific rights remain a separate review gate.
- Added 36 aligned Arabic companion drafts, 38 source-occurring lexical/idiom entries, an original offline SVG of a nineteenth-century paddle steamer approaching the Golden Gate headlands (no anachronistic bridge), and the distinct Pacific Meridian theme with Settings/gallery/reduced-motion/backup registration.
- Source, bilingual alignment, word count, glossary occurrences, art uniqueness and theme registration are covered by tools/verne-towle-ch24.test.cjs. Arabic literary review and rights clearance remain NOT TESTED until independently reviewed.
- **Independent source comparison (2026-10-26):** all 36/36 narrative paragraphs match the upstream XHTML after markup/entity/whitespace normalization.
- Chapter XXIV is 24 of 37; the novel remains incomplete. Device reading/performance/accessibility checks remain NOT TESTED.


## 2026-10-26 — Towle Chapter XXV: San Francisco civic gathering

- **Source:** Standard Ebooks editorial transcription of George Makepeace Towle's 1873 English translation of Jules Verne, Chapter XXV: https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-25.xhtml
- **Upstream Git blob SHA-1:** dd5e34efeaffca11b3b6aa3e9ef32a5f75639a0f; 50 narrative paragraphs and 2011 English words after XHTML markup/entity/whitespace normalization. Standard Ebooks' editorial transcription is CC0; the underlying 1873 translation is treated as public domain in the United States. Territory-specific redistribution rights remain a separate review gate.
- Added 50 aligned Arabic companion translation drafts, 38 source-occurring lexical/idiom entries, an original offline SVG of San Francisco's nineteenth-century waterfront and civic platform, and the distinct **Civic Panorama** theme with Settings/gallery/reduced-motion/backup registration.
- `tools/verne-towle-ch25.test.cjs` checks paragraph alignment, source word count, glossary occurrences, source provenance, chapter order, art uniqueness and theme registration. English body paragraphs are extracted directly from upstream XHTML after markup/entity normalization; independent Arabic literary proofreading remains **NOT TESTED**.
- Chapter XXV is 25 of 37; the novel remains incomplete. Device reading/performance/accessibility and territory-specific redistribution clearance remain **NOT TESTED**.

- **Verification addendum (2026-10-26):** all 50/50 stored English Chapter XXV paragraphs were compared with the upstream XHTML after markup/entity/whitespace normalization; no paragraph differences. The packaged Debug APK passed CI asset inspection, and its SHA-256 was independently recomputed. Arabic remains an unreviewed draft.


## Chapter XXVI — Pacific Railroad (added 2026-10-26)

- Source: Standard Ebooks repository tree 56c82e97ff5d4f8950afca05b71af72688a8da34, file src/epub/text/chapter-26.xhtml, blob d81f9235390ec9dac8c7e27ed08ba76ecf55a709.
- Text: George Makepeace Towle's 1873 English translation of Jules Verne's Around the World in Eighty Days, transcribed paragraph-by-paragraph from the pinned XHTML; 25 body paragraphs and 1,605 words. Standard Ebooks' editorial transcription is CC0; the underlying 1873 translation is treated as public domain in the United States. Territory-specific redistribution clearance must still be checked before release.
- Arabic: 25 aligned translation drafts created for learning use. They are not independently proofread and must not be described as professionally reviewed.
- Assets: original offline SVG artwork for the Sierra Nevada locomotive/buffalo scene; no third-party image or remote asset.
- Acceptance: the chapter regression verifies the source pin, paragraph count, word count, 36 source-occurring glossary surfaces, script order and unique art. Android/Chromium CI and device checks are tracked in docs/AUTONOMOUS_ACCEPTANCE.md.
