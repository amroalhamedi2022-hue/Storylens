# Lingua Tales — Chapter Gallery & Image Placement, permanent UI workstream
**Checkpoint:** 2026-11-05. **Owner:** THIS conversation: presentation, chapter structure, user flow, image placement, UX/reader integration, testing, status and handoff. NOT owner of fetching original stories or of sourcing/downloading original images. Those remain with the separate Literature/Images conversation.

## Binding user request / المطلوب
- From the book's exterior cover/card, tap the book to OPEN A DEDICATED CHAPTER CHOOSER, not jump straight into reading.
- Show its available narrative chapters in exact source order, side by side in a horizontal scrollable gallery. Tablets display multiple rich chapter cards in the same row; phones swipe horizontally. Do not invent future chapters.
- **Each chapter card ultimately gets ONE distinct chapter-specific genuine locally packaged thumbnail.** Photos/engravings/colour paintings are supplied by the other conversation, which must provenance-map one per chapter, with legal and editorial approval. Authentic historical original COLOUR is preferred and never filtered, cropped, desaturated or falsely colourised.
- Tap a chapter card to open THAT real chapter in the existing reader, retaining bookmarks, dictionary, translations, page folding, theme, progress and chapter navigation. Existing chapter progress only changes once a chapter is intentionally selected.
- Within the reader, a labelled **Illustrated chapters / الفصول المصوّرة** button reopens the same gallery. Browser/Android back, Escape, reduced motion, portrait/landscape, RTL/LTR and touch scrolling must be handled.
- If a picture is not yet sourced or NOT approved for display, keep its accurately ordered, readable chapter card with a quiet numbered paper image placeholder and explicit **image pending approval** label. **NEVER** recycle another chapter's art or claim legal clearance by virtue of a file existing.
- The Android app must not load remote URLs. Stage-only binaries under docs/literature cannot be used in the app until actually copied to app/src/main/assets/art and independently approved.

## Separation of duties
| Role | Owns | Does not do |
|---|---|---|
| Literature/image conversation | Discover whole authentic books, full translations, source rights, choose distinct period image per chapter, source binary SHA-256, precise chapter/scene mapping, publish approved input manifest | Reader/gallery UX, interface styling, page turn, UI app code |
| This conversation | Gallery screen, carousel, chapter sorting and responsive thumbnail sizing, safe image-loader/asset binding to approved maps, cover-to-gallery-to-chapter UX, progress/bookmarks/back navigation, reader integration, testing and signed-release coordination | Search for or generate new literary content or original book image binaries |
| Codex physical curl task | Physically accurate paper mesh & associated gestural mechanics | Concurrency edits from this chapter-gallery track |
 
## Data contract / integration
The other conversation maintains **docs/literature/CHAPTER_IMAGE_CONTRACT.md**, chapter-image-map.json and CHAPTER_ART_PROGRESS.json.
Frontend accepts optional `story.chapterThumbnails[index]`, `chapter.chapterThumbnail` or future `window.LinguaChapterThumbnailRegistry[bookId].chapters[index].primaryImage` entries.
For historical images **show only** if:
1. path matches a strict *packaged local* `art/*.webp/png/jpeg` path, never remote/doc staging;
2. chapter-matched editorial and territorial rights approvals are explicit (`editoriallyApproved=true`, `releaseApproved=true`, `distributionReviewApproved=true`, `rightsStatus=APPROVED or CLEARED`), or the in-prose archival scene passes its own source+paragraph+rights+editorial gates;
3. accessible bilingual alt and honest artist/archive credit provided;
4. source image belongs to same chapter, with distinct source path for each chapter (enforced upstream by content contract).
Existing shipped, non-archival short-story illustrations may be reused for backwards compatibility ONLY; never classify them as genuine old scanned classics and never use as future authentic novels' historical art.

## Implementation and work evidence
**CHG-01** Source implemented on branch `feature/chapter-thumbnail-gallery-20261105`:
- `app/src/main/assets/lt-chapter-gallery.js`: intercept final lazy-source-aware global openStory; separate accessible modal with numbered image cards; local portrait/landscape; selection calls original existing reader with saved target; lazy Verne novel loaded before presenting all chapter cards; navigation Back route; in-reader chapter chooser button. No change to source text, chapter grouping, physical curl engine, library database, signing.
- `app/src/main/assets/lt-chapter-gallery.css`: horizontal card rail/scroll snapping, no cropping/colour filters, focus targets, portrait bottom sheet, landscape layout and reduced motion.
- `app/src/main/assets/index.html`: includes CSS and loads gallery script after content loader.
- `tools/chapter-thumbnail-gallery.test.cjs`: source executable tests for real gallery, safe image approvals, lazy load, chapter index, RTL labels, navigation and missing-art states. Connected to `.github/workflows/android.yml`.

## Actual status (honest)
| Item | State at this document's creation |
|---|---|
| CHG-01 gallery JavaScript & CSS on branch | CODE COMMITTED; exact PR CI pending |
| CHG-02 book card→chapter list→correct reader route | CODE COMMITTED; browser & physical Android acceptance pending |
| CHG-03 all available chapters side-by-side in order | CODE COMMITTED; real device UI approval pending |
| CHG-04 image asset loader/reuse only from packaged/approved images | CODE COMMITTED; final art availability depends on content track |
| CHG-05 all 37 chapters of Around the World in Eighty Days with approved thumbnails | **0/37 READY**, 9 local historic mapped candidates pending rights/editorial, 28 missing candidate chapter images |
| CHG-06 all other staged works with 1 image per real chapter | NOT READY; original images may exist but complete, independently approved chapter maps are pending |
| CHG-07 real phone and Xiaomi Pad 5 portrait/landscape/RTL, TalkBack and return navigation | NOT TESTED ON DEVICE |
| CHG-08 stable signed APK update under existing `com.storylens.reader` certificate | NOT DONE; do not create new key, preserve private signing |
| CHG-09 content sourcing/acquisition | NOT OWNED HERE; delegate to content conversation |
| CHG-10 exact-head Android/Node/Chromium acceptance | PENDING at document creation |

### Remaining release priorities
1. Pass actual Node/Android/Chromium tests on this PR's exact SHA; repair any failures and merge only when green and current main reviewed.
2. Test book→chapter rail→selected chapter + Back →chapter chooser; test realistic 37-chapter lazy book, keyword search/favourites, split-screen, keyboard and accessibility. Keep reader's real paper curl owned by Codex.
3. Content chat fills missing distinct chapter-picture mappings, rights and editorial approvals. This UI stream then packages ONLY cleared image assets, wires the explicit local registry and verifies uncropped original-colour previews without affecting prose.
4. Complete 100% per-chapter approved image coverage for each published complete novel; if not, honestly show numbered image-pending chapter cards.
5. Update `docs/LINGUA_TALES_LIVE_STATUS.md`, this file, canonical `docs/handoffs/LINGUA_TALES_HANDOFF_CURRENT.md` and private user Library after EVERY meaningful batch; include exact code SHA, tested Actions URL, counts of truly ready vs sourced/staged vs missing, open blockers.
6. Before signed Android release verify same permanent certificate, APK package/versionCode >100866, data-safe update, Android phone/tablet; never claim APK exists without the artifact.

**No fake completion:** GitHub source code ≠ green CI ≠ real device acceptance ≠ full book/image publication ≠ signed APK.
