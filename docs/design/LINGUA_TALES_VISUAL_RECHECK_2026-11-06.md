# Lingua Tales — Complete visual request recheck (2026-11-06)

**This conversation owns only design and presentation.** Do not modify physical page curl, Android functionality, story source/content, chapter navigation, audio playback, OCR/copy controls, account/database, saved data or signing. Reuse the original Wen Sarafet glass principles and the EXISTING Lingua Tales one-lens WebView port, rather than duplicating a gesture engine.

## Requirements and defensible status

| User request | Delivered source or owner | Final gap |
|---|---|---|
| Latest Wen Liquid Glass / fluidity | Existing 60% follow / 265ms release plus V2 neutral clear lens, colour-linked glass, pressed crowns; shared one lens | Actual native AGSL refraction is not equivalent to CSS; Pad 5 120Hz measurement outstanding |
| All NEW Wen visual designs | Five **optional colour editor presets**: Royal Dark Gold, Imperial Dark Gold, Champagne Gold, Orange-Sage, Orchid-Rose | These are NOT five additional app theme IDs: only user-approved first six remain |
| Exactly six app themes | Existing ordered Liquid Glass 27, Liquid Aurora, Aqua Glass, Nebula Flow, Paper Atlas, Midnight Library; new V2 removes gallery hide action while retaining old backup field as inert compatibility | Visual screenshots on device |
| Reader fills screen, low noise | V2 dynamic viewport padding, wider portrait tablet book, visually hidden duplicate heading counters and progress stripe, existing visible chapter title | Real page turn/spread belongs to Codex PR #19 |
| Book / fibre / white / cream / comfort / night paper | Six independent existing settings, V2 explicit opaque ink + backgrounds, corrective CSS for legacy reader.dark collision | Chromium measured 7:1 in all six, physical eyestrain subjective |
| Calm historic illustration and chapter/gallery images | Original pixels always object-fit contain, no tint/opacity/sepia/blur, exhibition framing, quiet captions, chapter gallery tiles | Sourcing correct historical image for each chapter belongs to content workstreams |
| Theme and photo ambience visual delight | Static Wen-inspired dual light, neutral refraction glint, no moving wallpaper or idle blurs | AGSL pixel-parity and actual thermal testing outstanding |
| Center every icon / prevent corner bias | 48px targets, optical center glyph, focus ring, RTL-aware layout | Screen reader + Android accessibility scanner/device visual check |
| Additional handwriting, global font choices | Existing 7 Arabic + 7 English offline fonts kept unchanged, V2 respects language selection and doesn't change typography stack | Device mixed AR/EN screenshot QA |
| Remove extra metadata | Redundant reader-label/progress/eyebrow visually hidden, actual book title/credits/alt and source metadata remain accessible | Some required legal credit remains intentionally visible |
| Launcher symbol matches approved | Icon untouched in visual branch | Real adaptive mask comparison against user's approved screenshot outstanding |
| Turn pages by touching real paper | Codex page curl PR #19 | Outside this visual-only conversation |
| Two facing landscape pages, device rotation | Reader visual chrome sizing only, no native config or curl change | Codex and functional owner |
| No copy / first-party dictionary gestures | Not altered | Separate functional PR #11 and native QA |
| Page rustle/SFX and relaxing ambience | Not altered | Separate audio owner |
| APK with same signature | Not built | Separate release owner after all exact-SHA CI green |

## Source audit evidence and non-regression gates
- Style: `app/src/main/assets/lt-reader-comfort-v2.css` loaded last after chapter gallery. Existing `lt-wen-glass-engine.js` entirely unchanged.
- Behavioural/structural Node test: `tools/reader-comfort-v2.test.cjs`.
- Real browser CSS computed matrix: `app/src/main/assets/qa-reader-comfort-v2.html`; run phone 460x860, tablet portrait 768x1024, tablet landscape 1280x840; all 6 paper modes with legacy dark flag, all 6 theme palettes, normal + specialty novel bookshelf, real original image containment, 48px menu target, no horizontal overflow and 7:1 ink/background contrast.
- Screenshot evidence: `qa-screenshots/reader-comfort-v2-tablet.png` from browser fixture. Not a screenshot of production app; no physical-device FPS claim.
- Native Wen source: `amroalhamedi2022-hue/Wen-sarafet/glass-engine` (GlassMotion, WenNavigationLensDrawable, WenGlassBackdropDrawable, WenLiquidRuntimeOptics). Design guidance: Apple HIG [Materials](https://developer.apple.com/design/human-interface-guidelines/materials), Google [48dp touch targets](https://support.google.com/accessibility/android/answer/7101858), [WCAG 2.2](https://www.w3.org/TR/wcag/).
