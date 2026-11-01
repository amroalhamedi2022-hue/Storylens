# Lingua Tales — Novel-first library and touch UX contract (2026-11-01)

This is an explicit user decision, not an optional visual experiment. It supplements the current PR #1 acceptance documents.

## Product decisions

1. **No short fiction in the user-facing library.** The reader wants substantive, complete, long-form novels rather than two- or three-chapter stories or roughly 1,500-word novellas. Do not pad the catalog with fake chapters or mislabel short works as novels.
2. **Keep old data intact.** Existing short-story assets, saved words, study cards, bookmarks, chapter checkpoints and backups must remain readable at the data layer. Hide their shelf/search discovery rather than erasing those records or changing the Android app identity.
3. **Book cover is the title surface.** Every displayed novel cover must show a readable, correctly directed story title ON the cover artwork, without relying on a separate side title. Keep the meaningful art tied to the actual story; never invent a generic photo or fetch remote art at runtime. For Arabic-original novels use correct RTL script.
4. **Reference composition:** combine editorial, cover-first Apple Books browsing with clear Libby-style library navigation. Preserve the app's own Liquid design, offline themes, Arabic/English settings and mobile/tablet responsiveness.
5. **Tactile water-bubble interaction:** primary pointer/keyboard activation produces a bounded translucent water-bubble ripple. A long press maintains a light liquid depression until pointer up/cancel (or keyboard release); prevent blue rectangular highlight, text-selection handles on controls and repeated infinite animations. Do not interfere with word selection, scroll, physical page turn, accessibility focus, or the preference to reduce motion.
6. **Performance cannot be assumed.** Keep inexpensive transform/opacity transitions, no required per-frame layout loops, no extra network/fonts. Physically benchmark on the intended tablet/phone before promising 120 Hz or perfect page curl.

## Current implementation boundaries

- The shelf uses a temporary **12-chapter discovery threshold** (and recognizes deferred 37-chapter classic metadata); this is a *display gate*, NOT proof a work is a genuinely substantial novel. Future content acceptance must verify real story length, completeness, originality/rights, chapter continuity, Arabic editorial quality, meaningful offline illustrations and chapter navigation before publishing it as a long novel.
- Existing approved full 37-chapter Towle novel can appear without eagerly parsing all lazy chapter payloads. At this checkpoint it may be the only long-form title; do not show dummy books to fill genres.
- Genres with no long novel are hidden from the discovery drawer. User-facing chapter search is scoped to the long-form set, while the legacy source remains accessible for data compatibility and prior learning state.
- The original card-list and tap-feedback code remain in the repository for compatibility; the library decoration is the visible source of truth. Avoid duplicate overlays/animations.

## Acceptance tests before release

- Test actual Android portrait/landscape and tablet widths: title remains legible on the book cover; overflow and screen-reader names are safe.
- Long books only on the visible shelf, available genre drawers and user-facing chapter-search results; no deletion of saved data.
- Pointer down / held press / up / cancel / scroll, long-press themes, click on favorite stars, and reduced-motion preference work without getting stuck.
- Open the long 37-chapter book from its lazy cover, preserve the progress and return to the shelf.
- Run the existing complete Node, Android Gradle, packaged-content and Chromium CI. Physical device signing, backup and in-place update need separate verification; a Debug `.preview` APK must never be delivered as a safe production update.
