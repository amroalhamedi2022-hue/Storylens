#!/usr/bin/env python3
"""Real fixture assertions for AI companion image packager; no user art modified."""
from __future__ import annotations
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

SRC = Path(__file__).resolve().parents[1]
SCRIPT = SRC / "tools/package_generated_story_art.py"
BOOK = "around-the-world-in-eighty-days-towle"
SCENE = "verne-ch01-saville-house"


def invoke(root: Path, *args: str, passes: bool = True):
    p = subprocess.run([sys.executable, str(SCRIPT), "--repo-root", str(root), *args],
                       capture_output=True, text=True)
    if (p.returncode == 0) != passes:
        raise AssertionError(f"unexpected result: {p.stdout}\n{p.stderr}")
    return p


with tempfile.TemporaryDirectory() as folder:
    root = Path(folder)
    for file in ("tools/story_art_pilot.cjs",
                 "docs/art-generation/verne-pilot-scenes.json",
                 "app/src/main/assets/classic-verne-towle-ch01.js",
                 "app/src/main/assets/classic-verne-towle-ch02.js"):
        dest = root / file
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(SRC / file, dest)
    approved = root / "docs/art-generation/approved"
    approved.mkdir(parents=True)
    registry = root / "app/src/main/assets/lt-generated-art-registry.js"
    real_queue = root / "queue.json"
    p = subprocess.run(["node", str(root / "tools/story_art_pilot.cjs"), "--export",
                        str(real_queue)], capture_output=True, text=True)
    assert p.returncode == 0, p.stderr
    source = json.loads(real_queue.read_text("utf8"))["queue"][0]
    # Real WebP RIFF binary signature with a small dummy payload: test fixture
    # is byte integrity only, not a valid displayable book illustration.
    data = b"RIFF" + (512).to_bytes(4, "little") + b"WEBP" + b"VP8 " + b"\0" * 512
    path = approved / BOOK / (SCENE + ".webp")
    path.parent.mkdir(parents=True)
    path.write_bytes(data)
    item = {
        "sceneId": SCENE, "generated": True,
        "sourceType": "AI_GENERATED_MODERN_COMPANION",
        "sourceParagraphSha256": source["sourceParagraphSha256"],
        "chapterOneBased": 1, "afterParagraph": 0,
        "sha256": hashlib.sha256(data).hexdigest(),
        "model": "test-fixture-only",
        "credit": "Modern AI-generated illustration — test only",
        "editoriallyApproved": True, "ownerImageApproved": True,
        "distributionReviewApproved": True, "imageRightsReviewed": True,
        "releaseApproved": True
    }
    manifest = {"schemaVersion": 1, "bookId": BOOK, "releaseApproved": False, "images": []}
    doc = approved / "generated-art-release.json"
    def save(): doc.write_text(json.dumps(manifest, ensure_ascii=False), "utf8")
    save()
    invoke(root, "--write")
    invoke(root, "--check")
    assert "Object.freeze({})" in registry.read_text("utf8")
    assert not (root / "app/src/main/assets/art/generated").exists()

    manifest["images"] = [item]
    save()
    invoke(root, "--write", passes=False)  # cannot ship before book-release review
    manifest["releaseApproved"] = True
    save()
    invoke(root, "--check", passes=False)  # cannot claim packaged before genuine promotion
    invoke(root, "--write")
    invoke(root, "--check")
    output = root / "app/src/main/assets/art/generated" / BOOK / (SCENE + ".webp")
    assert output.read_bytes() == data
    assert "AI_GENERATED" in registry.read_text("utf8")
    assert "chapterOneBased" in registry.read_text("utf8")

    for key, invalid in (
        ("editoriallyApproved", False),
        ("ownerImageApproved", False),
        ("distributionReviewApproved", False),
        ("imageRightsReviewed", False),
        ("sourceParagraphSha256", "0" * 64),
        ("chapterOneBased", 2),
        ("afterParagraph", 3),
        ("sha256", "0" * 64),
        ("credit", "fake historic plate")
    ):
        old = item[key]
        item[key] = invalid
        save()
        invoke(root, "--write", passes=False)
        item[key] = old
    item["sha256"] = hashlib.sha256(data).hexdigest()
    manifest["images"] = [item, item]
    save()
    invoke(root, "--write", passes=False)
    manifest["images"] = []
    manifest["releaseApproved"] = False
    save()
    invoke(root, "--write", passes=False)  # orphaned published art is never silently erased
    output.unlink()  # explicit owner-reviewed removal simulated in disposable fixture
    invoke(root, "--write")
    invoke(root, "--check")
print("PASS: no premature AI art, 10 gates, byte integrity, original-story paragraph hashes, offline promotion, revoked-file orphan block")
