# StoryLens architecture and evolution

The existing v0.2 Android app was built with Kotlin/Jetpack Compose but was not previously in GitHub.
The first CI-enabled repository migration embeds the complete self-contained v0.2 reading preview
(12 original adult stories, 30 chapters, 30 art scenes, contextual popup, Arabic translations,
library filters, saved vocabulary and review) inside a **secure offline Android WebView host**.

Why temporary hybrid: binary source archive could not be directly transferred through the connected
GitHub file-editing interface. Rather than claim that the earlier Compose modules were pushed when they
were not, this repository uses one verifiable and runnable content-preserving source of truth.

Security: no INTERNET or audio permissions; all markup and story data are app-bundled; Android blocks
navigation to external URLs; JavaScript is confined to authored bundled content; no injected JS bridge.

Next native migration: recreate/restore the prior Compose screens against a separately extracted
JSON catalog. Keep visual QA parity and avoid regressions in study records. Persistent progress is
currently in WebView localStorage and must be migrated before replacing the UI.
