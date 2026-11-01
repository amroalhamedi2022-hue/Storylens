# Lingua Tales — authenticated antique illustration candidates (NOT shipped)

**2026-11-01.** These are archives of genuine period art, not generated modern pictures. A listing is a research lead, **not permission to copy any particular image**: inspect each image page, exact creator, public-domain term/jurisdiction, scan rights, crop, alt text and historical edition before packaging. Images must match specific chapter passages and should appear **inside reading pages**, with title displayed ON cover. Avoid unrelated decorative stock and childish cartoons.

## Arabic heritage — كليلة ودمنة

- **1310 Egypt manuscript, 73 miniatures**; Library of Congress / World Digital Library item https://www.loc.gov/item/2021667224/ ; Bavarian State Library original shelfmark Cod.arab.616. LOC states it is unaware of copyright or other restrictions on the collection and provides a credit line; verify original hosting and specific item before redistribution.
- Foliated view: https://www.loc.gov/resource/gdcwdl.wdl_08933/?sp=24 . Match each illustrated lion, jackal, dove, turtle or other fable scene to the *actual* chapter of chosen 1816 Arabic editorial text; manuscript/recension is earlier and may have different order, captions and stories. Do not present one recension's image as a direct facsimile of the other.
- Additional historically illuminated image reference BnF folio 86r https://commons.wikimedia.org/wiki/File:Kalila_wa_Dimna_BNF_Arabe_3465,_folio_86r.jpg . Individual rights/attribution required.

## Sherlock Holmes — A Study in Scarlet

- **1887 Beeton's Christmas Annual** original engravings for Doyle's novel credited to **D. H. Friston** (other contributors to the periodical should not be attributed as this novel's illustrator). Table of contents and edition: https://en.wikisource.org/wiki/Beeton%27s_Christmas_Annual/A_Study_in_Scarlet .
- Public Commons archive category lists 18 historic page/plate images: https://commons.wikimedia.org/wiki/Category:A_Study_in_Scarlet_illustrated_by_D._H._Friston . Check each individual file's creator, source year, reuse rights and story event alignment. Introductory Watson/Holmes scene should not be mistaken for later Part II events.
- Original English novel source staged and verified by SHA in docs/literature/staging/a-study-in-scarlet. Full contextual Arabic translation remains an independent release blocker.

## The Lost World — 1912 period scientific adventure

- **Harry Rountree** illustrated the 1912 London *Strand Magazine* publication, documented with story plates: https://www.arthur-conan-doyle.com/wiki/The_Lost_World .
- Period journal and episode examples: https://www.conandoylecollection.com/conan-doyle/exhibitions/lost-world ; one original 1912 illustration of the prehistoric plateau https://en.wikipedia.org/wiki/The_Lost_World_(Doyle_novel) . Match illustrations to exact dinosaur/jungle/plateau sections in original 16-chapter source; confirm license and edition/artist attribution **per scan**. Some overseas serializations had illustrations by different artists — do not confuse them.

## Jules Verne — Around the World in Eighty Days, original 1872–1874 plates (new source verification)

- **Period creators:** Alphonse de Neuville (1835–1885) and Léon Benett (1838–1917); some individual plates are credited to one or the other, so do not assign specific artwork to an artist without its file-level record. A Wikimedia Commons category gathers 158 files from the historic engraved illustrations: https://commons.wikimedia.org/wiki/Category:Illustrations_from_Around_the_World_in_Eighty_Days_by_Neuville_and_Benett . A category listing alone does **not** establish each file's actual scene or image rights.
- **Individually checked candidate — 1872 itinerary map:** https://commons.wikimedia.org/wiki/File:%27Around_the_World_in_Eighty_Days%27_by_Neuville_and_Benett_01.jpg . Commons documents an 800×650, 132,690-byte historical scan; the file page labels it public domain in its origin country and the USA, including the life+100 rationale for Benett (died 1917) and US publication before 1931. Commons structured data reports SHA-1 `4dad34a533511ec83929a2a973cfc844a141177a` (**metadata only, not independently rehashed**). It is a **world route map**, NOT a specific action-scene illustration. Potential placement is beside the actual itinerary in the original novel, only after comparison with the Towle English chapter III itinerary; do not sprinkle it into unrelated chapters.
- **Individually checked period scene candidate:** https://en.wikisource.org/wiki/File:Around_the_World_in_Eighty_Days_(1873)_34.png , which records the historic caption about Passepartout carrying wings and a public-domain rationale. Do not infer the scene's Towle paragraph/chapter from file number 34. Trace the event against the English prose before adding it.
- **Important edition distinction:** the French original/Hetzel illustrations date from 1872–1874; Lingua Tales currently ships George Makepeace Towle's 1873 **English translation**, not the original French text. Match images against shared narrative events, not printed pages or captions assumed to have the same pagination/language.
- **Status: SOURCE CANDIDATES ONLY — NO ACTUAL IMAGE IMPORTED IN THIS BATCH.** Next artifact gate: per-file download and independent SHA-256, actual scene and source-paragraph anchor, per-image public-domain/rights review by distribution territory, original artist/edition credit, contextual AR/EN alt text, compressed local WebP and measured reader-page QA. Runtime must remain network-free and battery-friendly.

## Placement and performance contract

- Position 1–3 appropriate vintage illustrations per substantive chapter only when they advance the scene. Do not flood every page; no remote URLs at runtime.
- Keep each picture with the paragraph it depicts, adjacent to the original + contextual translation pair; never split a translation, bury the source, or overlap dictionary word selection.
- Mobile 1-column adaptive plate, tablet side-float where legible; preserve page height measurement and accessible, source-specific alt text.
- Lightweight CSS archival borders / parchment plate treatment shipped in lt-device-acceptance.css; no expensive continuous visual filters. **Existing legacy SVG assets still need historical accuracy review.** 

## 2026-11-01 — Real 1872–1873 illustrations actually PACKAGED (source-checked)

Three original period engravings have now been checksum-verified against individual Commons source images, compressed, stored as offline WebP binaries in `app/src/main/assets/art/`, and mapped to precise original Towle paragraphs:
- **Chapter III, paragraph 28 (0-based 27):** original Neuville/Benett engraved journey map, `art/verne-route-map-1872.webp`, at the original eight-segment travel timetable.
- **Chapter XI, paragraph 44 (0-based 43):** *Kiouni*, the elephant, Phileas Fogg and Passepartout, original 1873 Osgood image, `art/verne-kiouni-1873.webp`; also used for the actual scene-led BOOK COVER, replacing abstract patterns.
- **Chapter XXI, paragraph 35 (0-based 34):** *Tankadere* tossed by heavy waves, original Neuville/Benett illustration, `art/verne-tankadere-1872.webp`.
- Each image is credited in its in-reader figure; original Commons URLs, original SHA-1, actual downloaded SHA-256, packed WebP SHA-256, dimensions and image size are stored in `docs/literature/HISTORIC_VERNES_ASSETS.json`. All imagery loads exclusively from packaged APK assets. History/rights rationale: individual Wikimedia Commons Public Domain Mark for old original prints; confirm extra territorial requirements before public distribution.
- The reader reserves image size, uses lazy decode, preserves inline Arabic/English pairing and avoids remote requests. No historical claims for older synthetic SVGs; other staged literature still awaiting complete rights-cleared bilingual translations. Physical device 120Hz and editorial acceptance remain open.
