#!/usr/bin/env python3
"""Source regression: WebView must exclusively own Android media audio focus.

Earlier the Android Activity independently acquired an AudioFocusRequest before
Chromium played HTMLAudio/WebAudio. Chromium could then acquire its own focus,
cause our listener to receive LOSS and stop audio a fraction of a second later.
This source contract does NOT claim a physical Android audio playback test.
"""
from pathlib import Path

root = Path(__file__).resolve().parents[1]
activity = (root / "app/src/main/java/com/storylens/reader/MainActivity.kt").read_text(encoding="utf-8")
procedural = (root / "app/src/main/assets/lingua-ambience.js").read_text(encoding="utf-8")
recorded = (root / "app/src/main/assets/lingua-licensed-audio.js").read_text(encoding="utf-8")
manifest = (root / "app/src/main/AndroidManifest.xml").read_text(encoding="utf-8")

# Both JavaScript players keep an explicit gesture-only playback handshake.
assert 'addJavascriptInterface(ReaderAudioFocusBridge(), "LinguaTalesAudioFocus")' in activity
assert "fun requestFocus(): Boolean = true" in activity
assert "fun releaseFocus() = Unit" in activity
assert "requestNativeAudioFocus()" in procedural
assert "releaseNativeAudioFocus()" in procedural
assert "requestFocus()" in recorded
assert "releaseFocus()" in recorded

# Never request platform focus separately from the embedded Chromium engine.
assert "audioManager.requestAudioFocus(" not in activity
assert "AudioFocusRequest.Builder(" not in activity
assert "abandonAudioFocusRequest(" not in activity
assert "readerAudioFocusListener" not in activity

# A backgrounded Activity must stop BOTH Web Audio and HTMLAudioElement,
# rather than only the former; no remote playback or surprise autoresume.
pause = activity.split("override fun onPause()", 1)[1].split("override fun onResume()", 1)[0]
assert "window.LinguaLicensedAudio.pause()" in pause
assert "window.LinguaAmbience.pauseFromNative()" in pause
assert "reader.onPause()" in pause
assert "fun onNativeAudioFocusLoss()" in procedural
assert "function onNativeAudioFocusLoss()" in recorded
assert "doc.addEventListener('visibilitychange'" in recorded
assert "RECORD_AUDIO" not in manifest and "android.permission.INTERNET" not in manifest
print("PASS: no competing Android audio focus request; both offline players pause on Activity background.")
print("NOT TESTED: real WebView OGG playback, physical interruptions, acoustic quality and Xiaomi Pad 5.")
