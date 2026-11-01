# Lingua Tales — source merge vs public release gate (2026-11-01)

User explicitly authorised merging whatever is ready into `main` on 2026-11-01. This authorisation replaces earlier "never merge main" development-routing instructions, but DOES NOT waive other quality gates.

## Code verified before source merge
- Development PR #1 source at `00e434e29fc5ab20e2df81199617942c4c44e70f`; exact SHA [Actions #41353504230](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/41353504230) completed **success**: curated content, original text checks, local scanned image checks, Android Debug unit tests/assemble, browser render journeys, screenshots and APK artifact.
- The sole one-commit `main` divergence `23bf6b7b9edfc04c43b945ec10ec0063dd923051` supplied an approved historical launcher file `app/src/main/res/drawable-nodpi/ic_brand_launcher.webp` and pointed its older manifest at that file. The mainline reconciliation retains the original launcher binary as a compatibility/design reference, while keeping the newer Android adaptive `@mipmap/ic_launcher` in the development manifest, with its tested 62dp centered mark. This resolves both changes without overwriting user branding.
- Preserve Android applicationId `com.storylens.reader`, encrypted? **No encryption added**, original WebView localStorage/saved vocabulary/backup behavior and explicit signing checks. Debug remains isolated at `com.storylens.reader.preview`.
- Original, source-verifiable historic illustrations are embedded locally inside relevant bilingual prose; newest image inspection UI is source-tested and scroll/focus safe.

## RELEASE BLOCKERS (NOT waived by merging source)
- Complete, independently edited natural translations for all catalog candidates; full Arabic-origin heritage companion coverage, source/translation attribution and accuracy.
- Jurisdiction-specific rights review per text, translation and historical image scan. Staged source files are not a licence to publish new editions.
- Real Xiaomi Pad 5 and phone accessibility, measured 120Hz frame pacing, image and page-curl gesture tests.
- Installed app signing certificate compatibility, durable private signing key/adequate versionCode, backup/restore recheck. Only a correctly signed `com.storylens.reader` APK can update the installed application.
- The current page curl is not a genuine continuous paper-fold mesh and remains unfinished.

**Merging source to main is not a final APK release, does not authorise app-store distribution and does not mean all product requirements are complete.**

Check newest `main` and Actions before continuing. Do not reuse old HEADs or duplicate commits. Continue with authentic historical book illustrations INSIDE the prose and complete contextual bilingual originals. Avoid writing synthetic stories.
