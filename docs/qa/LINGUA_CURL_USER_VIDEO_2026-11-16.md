# Lingua Tales: 16 November 2026 — owner video curl acceptance

## Source evidence

Owner's 17.9-second portrait Android recording `1000080416.mp4` was inspected frame by frame. Observed: narrow ribbon-like leaf folds, distorted ink on the strip, and a transient empty region near 16.5 seconds. The video does not establish whether a given fold used the WebGL2 path or the 22-facet fallback.

## This code change

- Portrait underlay is the actual destination page, not an unrelated following/prior page. This avoids showing one page underneath before abruptly committing another.
- Portrait reverse is blank paper instead of duplicating the destination on both underlay and folded face.
- WebGL2 idle snapshots can prime a single printed page. Landscape retains its separate front, verso and underlying page.
- No literary content, database, package ID, signing material, native permissions or finance app modified.
- Source is not a signed installable update. Existing signature requirements remain binding.

## Not yet accepted

1. Device re-test of full 17.9-second portrait gestures, release/re-grab and chapter boundaries.
2. Rework of strip/ribbon artifact, distorted folding ink, GPU/HTML handoff, and legacy facet fallback. This patch does not claim those problems solved.
3. Landscape facing pages, RTL/LTR, reader controls, dictionary tap/selection and real 120Hz jank measurements.
4. Exact-commit GitHub Android and browser CI, then separately an owner-signed update with the permanent certificate.

Source before change: `d44a885d78e31ebe0065cc0975294ccbfce7d4ac`. Screenshots from Chromium are not Android hardware visual acceptance.
