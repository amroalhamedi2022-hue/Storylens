#!/usr/bin/env python3
"""Exercise real approved-image packager against disposable offline fixtures.
No genuine literary data or image files are touched by this test.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
import struct
import subprocess
import sys
import tempfile
import zlib

SCRIPT = Path(__file__).with_name("package_approved_chapter_thumbnails.py")


def png_fixture(w=40, h=40):
    def chunk(kind, content):
        return struct.pack(">I", len(content)) + kind + content + struct.pack(
            ">I", zlib.crc32(kind + content) & 0xFFFFFFFF
        )
    raw = b"".join(b"\0" + b"".join(bytes(((x*3+y)%256, (y*5+x)%256, (x+y*2)%256))
                                    for x in range(w)) for y in range(h))
    return (
        b"\x89PNG\r\n\x1a\n" +
        chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)) +
        chunk(b"IDAT", zlib.compress(raw)) +
        chunk(b"IEND", b"")
    )


def invoke(root, *args, success=True):
    p = subprocess.run([sys.executable, str(SCRIPT), "--repo-root", str(root), *args],
                       text=True, capture_output=True)
    if success and p.returncode != 0:
        raise AssertionError(f"Packager failed: {p.stdout} {p.stderr}")
    if not success and p.returncode == 0:
        raise AssertionError(f"Packager accepted invalid proof: {p.stdout}")
    return p


with tempfile.TemporaryDirectory() as name:
    root = Path(name)
    src_dir = root / "docs/literature/staging/sample-classic"
    art_dir = src_dir / "art"
    art_dir.mkdir(parents=True)
    assets = root / "app/src/main/assets"
    assets.mkdir(parents=True)
    image = png_fixture()
    assert len(image) > 300
    (art_dir / "original-colour.png").write_bytes(image)
    proof = hashlib.sha256(image).hexdigest()

    entry = {
        "chapterOneBased": 1,
        "primaryImage": {
            "imagePath": "docs/literature/staging/sample-classic/art/original-colour.png",
            "sha256": proof,
            "sourceUrl": "https://commons.wikimedia.org/wiki/File:Real_source_page.png",
            "sceneAnchor": "Source chapter one scene exact passage",
            "credit": "Original collection credited",
            "altAr": "صورة مخطوطة تاريخية ملوّنة",
            "altEn": "Authentic historical colour miniature",
            "editoriallyApproved": True,
            "releaseApproved": True,
            "distributionReviewApproved": True,
            "rightsStatus": "APPROVED"
        }
    }
    doc = src_dir / "chapter-image-map.json"
    map_data = {
        "schemaVersion": 1, "bookId": "sample-classic", "chapterCount": 2,
        "releaseApproved": False, "chapters": [entry, {"chapterOneBased": 2, "primaryImage": None}]
    }
    def write(): doc.write_text(json.dumps(map_data), "utf-8")
    write()
    # Staged book: even a locally copied original image must NOT appear on the
    # Android chapter carousel until book+picture approval is explicit.
    invoke(root, "--write")
    registry = assets / "lt-chapter-thumbnail-registry.js"
    assert "Object.freeze({})" in registry.read_text("utf-8")
    invoke(root, "--check")
    assert not (assets / "art").exists(), "No source pictures should be packaged prematurely"

    map_data["releaseApproved"] = True
    write()
    invoke(root, "--check", success=False)  # Explicit asset promotion required.
    invoke(root, "--write")
    invoke(root, "--check")
    expected = assets / "art/chapters/sample-classic/chapter-001.png"
    assert expected.read_bytes() == image, "Approved original colour must retain exact binary/colour"
    result = registry.read_text("utf-8")
    assert '"src":"art/chapters/sample-classic/chapter-001.png"' in result
    assert result.count('"primaryImage":null') == 1, "Missing second chapter must remain explicit"
    assert "https://commons.wikimedia.org/" in result
    assert '"editoriallyApproved":true' in result

    # The same image must not masquerade as a unique thumbnail for two chapters.
    duplicate = json.loads(json.dumps(entry))
    duplicate["chapterOneBased"] = 2
    map_data["chapters"][1] = duplicate
    write()
    invoke(root, "--write", success=False)

    map_data["chapters"][1] = {"chapterOneBased": 2, "primaryImage": None}
    map_data["chapters"][0]["primaryImage"]["imagePath"] = "../../outside.png"
    write()
    invoke(root, "--write", success=False)
    map_data["chapters"][0]["primaryImage"]["imagePath"] = entry["primaryImage"]["imagePath"]
    map_data["chapters"][0]["primaryImage"]["sha256"] = "0" * 64
    write()
    invoke(root, "--write", success=False)
    map_data["chapters"][0]["primaryImage"]["sha256"] = proof
    map_data["chapters"][0]["primaryImage"]["distributionReviewApproved"] = False
    write()
    invoke(root, "--write")
    assert "Object.freeze({})" not in registry.read_text("utf-8"), (
        "A globally released book with no approved images must still have a 2-chapter empty map"
    )
    assert '"primaryImage":null' in registry.read_text("utf-8")

print("PASS: original-colour genuine-image binary intact, no premature art, correct chapter order, no duplicate source or traversal, strict rights and integrity checks")
