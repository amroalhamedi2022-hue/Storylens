# Page curl library candidates — ISOLATED comparison (2026-11-17)

**Safety:** This experiment is on a dedicated branch; it is never included by
production \`index.html\`, reader scripts, Gradle assets, Android manifest, or app
signing. No \`main\` merge and no signed APK are implied by a green experiment.

## Candidates and verified upstream facts
- \`page-flip@2.0.7\` / StPageFlip: MIT, HTML pages, landscape/portrait, no
  native RTL binding option; portrait duplicates DOM nodes. Its upstream issue
  #71 reports possible endless RAF after \`destroy()\`; independently measure.
- \`@openpageflip/core@0.7.0\`: MIT, maintained pre-1.0 successor, supports
  \`binding:right\` RTL, pointer edge pickup, interactive HTML exclusions,
  \`flipProgress\`, and destroyed DOM restoration. Verify these claims against
  the actual pinned bundle, not README assertions.

## Actual executable evaluation
- \`tools/engine-eval/index.html\` and \`demo.js\` load eight real paragraph
  pairs from the project's archived public-domain 1873 George Towle translation
  of *Around the World in Eighty Days*, Chapter I. They preserve the source
  content (no made-up book text). The Arabic companion is a separately drafted
  text with existing rights/editorial caveats.
- \`compare.cjs\` loads the **published bundles**, locally only, in Chromium:
  six configurations (original St LTR portrait/landscape; OpenPageFlip LTR and
  RTL portrait/landscape). Checks programmatic flips forward/back, genuine
  pointer hold without commit, visually clickable dictionary button, original
  paragraph selection, orientation, RAF after destroy, runtime errors, plus
  physical screenshot evidence and JSON telemetry.
- NPM download only on CI, pinned versions; browser routes block all internet
  resources. Original installed Android key is never accessed.

## Release veto / next gates
1. Candidate must be genuinely visually superior, with correct two-page spreads,
   non-cloned interactive text and RTL. A green screenshot job alone is **not**
   a release sign-off.
2. Integrate only behind a disabled feature flag on an isolated integration
   branch after acceptance tests reproduce original user complaint.
3. Actual Xiaomi Pad 5 120Hz hardware and phone test: hold/regrab anywhere,
   fast taps, chapter boundary, split-screen, dictionary, text selection,
   semantic bookmark restore, no memory leak, no degraded battery.
4. Restore damaged installed version with a **newer owner-signed** verified
   APK once the rollback branch qualifies; never suggest uninstalling or
   installing a lower version code.
5. Keep issue #96 open. If both libraries fail gates, do not merge either.

Source references: https://github.com/Nodlik/StPageFlip and
https://github.com/benhonda/openpageflip .

## Additional free-grab gate

`grab=anywhere` runs three extra OpenPageFlip configurations. It checks that a
pointer press in the middle actually enters `user_fold`, that the book does
not commit while held, and (crucially) that native pointer text selection
continues to work. If selection is hijacked, free-grab must NOT be enabled
in production without an independently verified gesture guard.

## Selection-vs-hold conflict exposed by second run

The initial `click:anywhere` probe correctly folded the page but blocked native
pointer text selection, even though the app's word button remained clickable.
We now explicitly protect `.source-text,h2` through OpenPageFlip's
`ignoreDragOn` option. Free-grab is tested on the blank lower paper, not
within actual words. **This is a deliberate compromise**: a single pointer
gesture on live text cannot simultaneously select text and seize the leaf.
Do not claim unlimited grab everywhere. Re-test both interactions in real
Android WebView before any production integration.
