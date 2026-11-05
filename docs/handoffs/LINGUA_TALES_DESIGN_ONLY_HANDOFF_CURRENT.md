# Lingua Tales — Design-only handoff (5 Nov 2026)

This conversation owns ONLY visual design, Liquid Glass, interfaces, thematic styling, typography presentation, visual artwork framing and optical alignment. Other conversations own real paper-fold engineering, chapter functionality, story/image sourcing, dictionary, audio functionality, Android files, storage, signing and APK releases.

Use original Wen Sarafet source under glass-engine/src/main/java/app/wensarafet/glass: GlassMotion.java, WenNavigationLensDrawable.java, WenGlassBackdropDrawable.java and WenLiquidRuntimeOptics.java. Lingua Tales already has the working WebView equivalent lt-wen-glass-engine.js/css: one shared lens, 0.60 follow, 265ms settle, gesture cancellation. Do not duplicate its JS event handlers. Native Android AGSL pixel refraction cannot be directly reproduced in CSS; do not claim parity.

Visual batch adds lt-wen-reader-sanctuary.css, using six approved user theme IDs only: liquid-27, aurora, aqua, nebula, paper-atlas, midnight-library. Includes passive two-light atmosphere, a pearlescent crown on existing active lens, two-column tablet library with one-column phone fallback, original uncropped images, centered controls and reduced-motion/transparency fallbacks. No glass touching real book paper/ink. No idle animations, no content/assets changed.

QA: tools/wen-reader-sanctuary.test.cjs and qa-wen-reader-sanctuary.html in Chromium at phone 460x860 and tablet 1280x840; screenshot artifact. Do not merge until exact-source Actions success and conflict review against ongoing Codex page-curl PR #19 and chapter-layout PR #18; neither belongs to this chat. Physical Pad 5/120Hz testing remains pending.

Baseline main at authoring: 52a15610b5c16f71df0ea3c765d4c2c3279a3803. Always check newest main. Design reference Apple materials: https://developer.apple.com/design/human-interface-guidelines/materials ; medium line-length reference https://doi.org/10.1006/ijhc.2001.0458.

State at authoring: source PR and CI pending; NOT a signed APK, and not native AGSL.
