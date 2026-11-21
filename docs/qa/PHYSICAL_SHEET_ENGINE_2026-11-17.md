# Physical sheet renderer — 17 November 2026

Base: main `45f7f788`, after user-rejected PR97 was rolled back. This work does not reapply its tapered deformation. Acceptance is pending; no physical Android/120Hz, zero-defect or finite-element simulation claim.

## Root causes confirmed in source

- Canvas snapshots were warm, but GL contexts, shader programs and `texImage2D` uploads were created on gesture start. New idle preparation keeps those resources resident in one context per reader.
- A one-page framebuffer clipped a left-moving sheet at the book spine. New framebuffer covers the book, using explicit source offset.
- The old GPU crease traveled only W while gestures traveled 2W; the fully released sheet never reached its actual end pose.
- A regular UV grid connected vertices across very tight bends. New mesh clips material-space polygons at exact cylinder bands; no triangles bridge the straight/curved/back boundaries.
- The old shader included a perspective shrink about the page center and static tilt even at rest. Flat faces now coincide with DOM dimensions, brightness and orientation.
- Portrait deliberately used an unprinted reverse. The new four-face composition prints the actual next/prior face, distinct underlay, and stationary page. Its portrait camera follows that physical reverse into the screen. Source text and pagination remain untouched.
- Commit previously removed the fold before changing the logical page. Commit now happens before cleanup in the same task.

## Engine evaluation

Primary upstream references inspected 17 November:
- https://github.com/harism/android-pagecurl — Apache-2.0, OpenGL ES 1.x native renderer, separate front/back textures. Native View integration would still need WebView page-content capture and dictionary/accessibility bridge; not a drop-in solution for this reader.
- https://github.com/eschao/android-PageFlip — Apache-2.0, Android OpenGL ES engine. Same native/DOM integration cost; not measured on this machine and not claimed slower.
- https://github.com/Nodlik/StPageFlip — MIT, HTML/image renderer. Existing repo evaluation found lifecycle/RTL gaps; HTML renderer rotates clipped planes rather than a continuously bent 3D sheet.
- Existing OpenPageFlip 0.7 evaluation (run 44038340214) already tested seven scenarios. Not repeated or misrepresented as an Android comparison. It remains a useful fallback candidate; no unmeasured performance superiority claim.

Decision: retain the app's WebGL2 integration and replace its geometry, resource lifetime and physical-face composition. This preserves interactive original DOM pages when idle. Original mathematical implementation; no new third-party engine code copied or new licence dependency.

## Validation

`node tools/physical-sheet-geometry.test.cjs`: 1,650 combinations, exact material area, both pinned binding corners, finite geometry and normals, both flat endpoints. 396 vertices maximum in these cases (old grid: 4,753 vertices). CPU benchmark is build-machine throughput, not Android FPS.

`tools/physical-sheet-pixels.cjs`: independent colored corner probes for upright, unmirrored, correct-size verso landing at both edges and in both layouts; renders 28 actual GPU frames.

`tools/lingua-curl-v2-browser.cjs`: real app, RTL/LTR × portrait/spread, held/reverse/cancel and watchdog; instruments zero new captures, texture uploads, or contexts between idle-ready state and a held turn.

## Known remaining gates

- Cold/not-yet-prepared turns and chapter-boundary previews still use the preexisting fallback. This is NOT a claim that all rapid gestures meet the GPU-only requirement.
- Existing DOM-to-canvas rasterizer is still idle-time main-thread work. Physical device input latency, pixel fidelity, GPU/thermal usage and 120Hz pacing need measurement.
- Developable cylinder with feasible binding constraints is a geometric paper model, not an elastic material solver. No evidence yet that users find it indistinguishable from paper.
- Native Android installation, original signer and all release gates are separate. Do not label an APK production accepted merely because these tests pass.

## Reuse

`sheetGeometry()` accepts only dimensions and gesture state; `createRenderer()` accepts prepared image surfaces. Neither edits textual content. A future Quran app adapter must supply verified immutable source pages; existing `quran-safe-curl-adapter.js` integrity checks remain unchanged. No Quran application or sacred text was edited.

## Actual local results and blocked steps

- All 1,650 geometry/material-coverage cases passed. Additional 1,001 portrait camera inversion checks preserve one screen pixel of travel per finger pixel for an unskewed edge grip. These are numerical checks, not display evidence.
- Updated production face-order tests passed for forward/reverse portrait and landscape and odd trailing spreads. The old fallback retains its own correct portrait underlay; it cannot use the new camera's N+2 underlay.
- Existing edge-zone test failed on unmodified main because it matched obsolete source spelling. Replaced that check with calls to the real `grabEdge` implementation, preserving required margins and dictionary-safe stationary taps.
- JavaScript syntax, the five Android update identity unit tests, audio focus source checks, and existing Quran integrity tests passed. No Quran content accessed.
- Full Node results are in `PHYSICAL_SHEET_LOCAL_RESULTS_2026-11-17.json`; missing generated dictionary/audio assets were reproduced on unmodified baseline.
- Chromium execution failed before page load (`socket() Operation not permitted`). Local escalation is unavailable under the current approval policy. No screenshots or GPU pixel passes have been claimed.
- Public source push was rejected by automatic approval review as an external publication requiring explicit user authorization. No attempt to bypass that decision. The branch has only local commits, and neither GitHub CI nor an Android build was run for this change.
- Next concrete action after authorization: push `feature/physical-sheet-engine-20261117`, open a draft PR, run the included independent pixel/real-reader and full Android workflows; inspect actual frames, correct failures, then produce a same-signer APK only from verified source.
