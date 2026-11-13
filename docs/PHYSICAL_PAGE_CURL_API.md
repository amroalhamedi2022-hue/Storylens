# Physical HTML page curl — integration contract

`physical-page-curl.js` and `.css` are bundled locally before `reader-experience.js`.
No CDN, text rasterization, new storage keys or runtime dependencies. Source text,
translations, illustrations and their existing listeners stay on original page
nodes. The renderer creates 22 temporary, clipped HTML facets of the held sheet,
with inert, accessibility-hidden, ID-free visual copies and no copied event
handlers. Word token spans are collapsed to text in these copies. No novel is
cloned; only the current sheet and its reverse are copied during a turn.

## Reader bridge

`window.LinguaReaderCurl` is the current reader instance:

- `turn(delta, source = 'control')`: delta must be +1 or -1; returns false at a
  boundary where no next chapter/page exists. Uses the same animation as touch.
- `cancel(reason = 'cancel')`: immediately restores the original interactive paper.
- `cancelIfActive()`: returns whether it consumed a pending/active fold. Native
  Android Back invokes this before the existing illustration/modal/drawer stack.
- `active`: true during a held fold or settling animation.
- `destroy()`: cancel, remove instance listeners/observer and animation frame.

A new primary contact can catch a settling sheet without creating a second turn.
Repeated keyboard/button turns replace an unfinished turn, cancelling it before
starting the next; they do not queue unbounded animations. Layout replacement,
modal opening, resize, pointer cancellation, a second finger, lost host capture,
window blur and page visibility loss cancel safely. Vertical scrolling wins
before horizontal lock. Taps on words remain dictionary taps until an actual
edge drag crosses the lock threshold. Escape cancels; arrows and PageUp/PageDown
work when the paper itself has focus. Reduced motion commits without a mesh or
animation frame; it still uses the same event contract.

## Events

Listen on `document`; names are case-sensitive:

```js
document.addEventListener('lingua:turncommit', ({detail}) => {
  // One successful logical page/spread/chapter change. Use detail.id to dedupe.
});
```

- `lingua:turnstart`: once, after horizontal lock or accepted programmatic turn.
- `lingua:turnprogress`: a painted frame; no idle or stationary-hold animation loop.
- `lingua:turncommit`: exactly once after successful navigation and cleanup.
- `lingua:turncancel`: once for a started transaction that does not commit.
  An unstarted tap/scroll emits neither commit nor cancel.

Detail: `{id, delta, source, progress, storyId, chapter, fromPage, toPage, spread}`.
IDs increase across reader remounts within the WebView session. `chapter` is the
origin chapter; `toPage` is null for a chapter boundary. Progress is normalized
0..1, with 1 supplied on commit; cancellation includes `reason`. At a chapter
boundary, the old host has been removed, so the final event is dispatched on
`document` directly. Do not depend on its target being the old page.

The existing licensed SFX bridge in `move()` still plays once at the navigation
commit, never at start/cancel. The audio workstream should replace that bridge
when adopting this event, **not add a second sound consumer beside it**. Assets,
preferences and audio-focus behavior are unchanged by this workstream.

## Binding, layout, persistence

Binding follows `story.sourceLanguage`, independently of interface language.
Portrait (or a narrow window) displays one sheet; landscape at >=700 CSS px
shows two pages in source order with the correct gutter. The existing paragraph
measurement is performed at sheet width. Original nodes are moved, not rebuilt
per gesture. Existing `readpage_*`, `readpage_anchor_*`, bookmark and translation
keys remain compatible. Hidden/visual copies are excluded from anchor capture.
The adjacent chapter boundary preview is bounded source text; the full existing
reader pipeline mounts that chapter only after commit.

The shell owns immersive chrome, native rotation, fonts and paper presets.
Paper styling is sampled at fold start; no changes to theme selection or audio
assets are required. CSS is scoped to `.lt-curl-book` and `.lt-curl-stage`.

## Geometry and limits

The sheet uses an offline, original ruled-surface approximation: a moving crease,
a tapered curved belly and a broad reverse surface. Local tangent matrices differ
across the belly; this is not a whole-card rotation or a uniform rolling tube.
The opposite edge lags at a corner hold, then the taper relaxes across the binding.
Lighting follows surface angle, with a narrow contact shadow and paper edge.
The reverse displays actual adjacent-page HTML; artwork is never recoloured or
rasterized. Spring integration uses elapsed time with <=8ms integration steps,
not a fixed assumed refresh rate. Only movement and release schedule rAF. The visual container clips transformed
layout overflow so a left-edge fold cannot shift an RTL viewport sideways.

This is not a finite-element paper/material solver. Facets can be discernible at
extreme zoom; actual WebView GPU memory, finger feel, TalkBack and Xiaomi Pad 5
frame pacing/thermal behavior require device testing. No verified 120 FPS claim.
One oversized bilingual paragraph stays intact and scrollable, as before.

## Candidate research (5 November 2026)

Studied StPageFlip/page-flip **2.0.7**, MIT, tag commit
`ab30ecc1d9f6d98de1a99b8e296469382f41c120`:
https://github.com/Nodlik/StPageFlip/tree/v2.0.7 . NPM archive SHA-256:
`871f33a759f927f83e92556beeebfe264aa78c2ccb2686092c1d43a19f5a0cf2`.

`src/Page/HTMLPage.ts` preserves HTML, creates temporary DOM copies, and its
`drawSoft()` applies a polygon clip plus a single 2D rotation. `FlipCalculation`
computes corner/edge intersections and rotation, not a deforming textured mesh.
`Render.start()` perpetually schedules rAF, including idle frames. `UI.ts` uses
mouse/touch handlers with delayed touch and limited target filtering; the app
needs explicit dictionary ownership, pointercancel/multitouch and exactly-once
commit semantics. Portrait and landscape support are useful precedents, but
integrating its unmodified renderer would not meet the user's rejection of a
flat simulated sheet. The new implementation does not copy or bundle its code;
there is no additional runtime licence dependency. turn.js was not used.

## Repeatable validation

- `node tools/physical-page-curl.test.cjs`: mesh coverage, finite corner matrices,
  mirrored binding, spreads and direction/velocity release intent.
- `node tools/physical-page-curl-browser.cjs` with Playwright and Chromium installed:
  actual app, local server, all nonlocal requests blocked; four language/layout
  combinations, live mesh screenshots, cancellation, dictionary, chapter and
  saved-anchor checks, plus browser-generated touch, implicit capture transfer,
  vertical edge scroll, real second contact, rapid turns and original image inspection. `CHROME` can select the executable; `CURL_SCREENSHOTS`
  selects the artifact directory.
- The existing Android workflow runs all Node/Android/Chromium checks and the new
  browser acceptance, uploading `StoryLens-UI-Screenshots`. Generated QA HTML and
  test screenshots are not added to Android runtime assets.


## 13 November 2026 — eBook reader core stabilization (pending CI/device check)

Source-based review considered `harism/android-pagecurl` (Apache-2.0, OpenGL ES),
`eschao/android-PageFlip` (Apache-2.0, OpenGL ES),
`oleksandrbalan/pagecurl` (Compose),
`Nodlik/StPageFlip` (MIT, HTML), and the open Readium Mobile EPUB reading toolkit.
This application renders live bilingual HTML in an offline Android WebView;
switching to an EPUB/GLSurfaceView/Compose engine would replace the existing
DOM dictionary, authentic illustration and saved-anchor pipeline. No foreign
code, network asset, license-restricted renderer or binary was imported.

This change fixes three direct integration faults instead:

1. **First-frame responsiveness:** `makeVisual` builds the 22 extremely cheap
   geometric facet shells, then `paint` creates a clipped ink copy **only**
   when the facet's polygon intersects the sheet. Each visible face is copied
   once and reused throughout that turn. The interactive original remains the
   only dictionary/translation event target; invisible faces allocate no ink.
2. **Physical paper dimensions:** measured pagination now uses the final
   portrait/spread paper height (viewport minus the respective 118/82 px
   reader furniture), rather than the old 72vh budget contradicting the final
   CSS paper size. Orientation/font rebuilds still use paragraph anchors.
3. **Recoverable navigation:** touch-sized Previous/Next buttons are visible in
   portrait even if Android's system Back gesture consumes the outer edge.
   The established on-demand landscape toolbar behavior is retained.

No changes to app ID, signing, literary source, DRM, money/finance, text
acquisition, licensed sounds, bookmarks, storage keys or offline policy.
`tools/physical-page-curl-browser.cjs` checks that only intersecting facets
materialize faces and that the portrait button can actually be tapped.
Chromium, Android emulator and physical Xiaomi Pad 5 test outcomes must be
reported separately; new source code is not itself proof of device acceptance.
