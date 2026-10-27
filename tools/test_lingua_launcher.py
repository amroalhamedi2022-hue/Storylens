#!/usr/bin/env python3
"""Source-level LT-01/LT-04 gate. Device launcher masks and upgrade remain NOT TESTED."""
from pathlib import Path
from xml.etree import ElementTree as ET
import re

ROOT = Path(__file__).resolve().parents[1]
RES = ROOT / "app/src/main/res"
ANDROID = "{http://schemas.android.com/apk/res/android}"

def xml(path):
    return ET.parse(path).getroot()

manifest = xml(ROOT / "app/src/main/AndroidManifest.xml")
app = manifest.find("application")
assert app is not None
assert app.get(ANDROID + "label") == "Lingua Tales"
assert app.get(ANDROID + "icon") == "@mipmap/ic_launcher"
assert app.get(ANDROID + "roundIcon") == "@mipmap/ic_launcher"
assert manifest.findall("uses-permission") == [], "reader must remain fully offline"

adaptive = xml(RES / "mipmap-anydpi-v26/ic_launcher.xml")
assert adaptive.tag == "adaptive-icon"
refs = {"background": "lingua_icon_background", "foreground": "lingua_icon_foreground",
        "monochrome": "lingua_icon_monochrome"}
for tag, name in refs.items():
    child = adaptive.find(tag)
    assert child is not None and child.get(ANDROID + "drawable") == "@drawable/" + name
    assert (RES / "drawable" / (name + ".xml")).is_file()

background = xml(RES / "drawable/lingua_icon_background.xml")
gradient = background.find("gradient")
assert gradient is not None
for color in ("startColor", "centerColor", "endColor"):
    assert re.fullmatch(r"#[0-9A-Fa-f]{6}", gradient.get(ANDROID + color, ""))

for name in ("lingua_icon_foreground", "lingua_icon_monochrome"):
    vector = xml(RES / "drawable" / (name + ".xml"))
    assert vector.tag == "vector"
    assert vector.get(ANDROID + "viewportWidth") == "108"
    assert vector.get(ANDROID + "viewportHeight") == "108"
    paths = vector.findall("path")
    assert len(paths) >= 5
    for path in paths:
        data = path.get(ANDROID + "pathData")
        assert data and data.startswith("M")
        # All actual shape coordinates are in the 108x108 viewport.
        # Adaptive clipping/safe-zone appearance still requires Android testing.
        assert not re.search(r"https?://", data)
    assert any(("54,42" in p.get(ANDROID + "pathData", "") or "54,43" in p.get(ANDROID + "pathData", "")) for p in paths), "open-book/petal center anchor is present"

html = (ROOT / "app/src/main/assets/index.html").read_text(encoding="utf-8")
assert '"displayName":"Lingua Tales"' in html
assert '>LINGUA TALES</div>' in html
assert '>STORYLENS</div>' not in html
assert "storylens_" in html, "legacy localStorage keys must not be renamed"
gradle = (ROOT / "app/build.gradle.kts").read_text(encoding="utf-8")
assert 'applicationId = "com.storylens.reader"' in gradle, "upgrade identity must be preserved"
print("PASS Lingua Tales LT-01/04: XML adaptive layers, brand, offline manifest and storage identity")
