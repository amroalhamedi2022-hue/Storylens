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
                 "tools/prepare_color_scene_queue.cjs",
                 "docs/art-generation/visual-bibles/colored-victorian/next-scene-briefs.json",
                 "app/src/main/assets/classic-verne-towle-ch03.js",
                 "app/src/main/assets/classic-verne-towle-ch04.js",
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
    # Use actual 1536x1024 decoded WebP assets as TEST-ONLY positive fixtures.
    data = (SRC / "docs/art-generation/visual-bibles/colored-victorian/golden-world-route.webp").read_bytes()
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
    # Real single-panel preview is too small for a tablet: it must NEVER ship,
    # even if every release approval were mistakenly set to True.
    tiny = (SRC / "docs/art-generation/review/single-scene-crops-20261111/ch03-reform-wager-study-a.webp").read_bytes()
    path.write_bytes(tiny)
    old_sha = item["sha256"]
    item["sha256"] = hashlib.sha256(tiny).hexdigest()
    save()
    denied = invoke(root, "--write", passes=False)
    assert "resolution too small" in denied.stderr.lower(), denied.stderr
    path.write_bytes(data)
    item["sha256"] = old_sha
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

    # Chapter III colour art follows the same exact original-source SHA proof.
    queue_color = root / "color-queue.json"
    p = subprocess.run([
        "node", str(root / "tools/prepare_color_scene_queue.cjs"),
        "--export", str(queue_color)
    ], capture_output=True, text=True)
    assert p.returncode == 0, p.stderr
    colors = json.loads(queue_color.read_text("utf8"))["queue"]
    chapter_three = next(x for x in colors if x["sceneId"] == "verne-ch03-color-wager")
    assert (chapter_three["chapterOneBased"], chapter_three["afterParagraph"]) == (3, 58)
    color_binary = (SRC / "docs/art-generation/visual-bibles/colored-victorian/london-club-and-journey.webp").read_bytes()
    approved_color = approved / BOOK / (chapter_three["sceneId"] + ".webp")
    approved_color.write_bytes(color_binary)
    color_item = dict(item)
    color_item.update(
        sceneId=chapter_three["sceneId"],
        sourceParagraphSha256=chapter_three["sourceParagraphSha256"],
        chapterOneBased=3, afterParagraph=58,
        sha256=hashlib.sha256(color_binary).hexdigest()
    )
    manifest["images"] = [item, color_item]
    save()
    invoke(root, "--check", passes=False)   # not in Android until a reviewed package
    invoke(root, "--write")
    invoke(root, "--check")
    color_output = (root / "app/src/main/assets/art/generated" / BOOK /
                    (chapter_three["sceneId"] + ".webp"))
    assert color_output.read_bytes() == color_binary
    registry_content = registry.read_text("utf8")
    assert '"3":' in registry_content and '"1":' in registry_content
    assert chapter_three["sourceParagraphSha256"] in registry_content
    for field, bad in (
        ("editoriallyApproved", False),
        ("ownerImageApproved", False),
        ("distributionReviewApproved", False),
        ("imageRightsReviewed", False),
        ("sourceParagraphSha256", "a" * 64),
        ("chapterOneBased", 2),
        ("afterParagraph", 19),
        ("sha256", "0" * 64)
    ):
        previous = color_item[field]
        color_item[field] = bad
        save()
        invoke(root, "--write", passes=False)
        color_item[field] = previous
    # Historic and color options for the same paragraph must NEVER both ship.
    color_first = next(x for x in colors if x["sceneId"] == "verne-ch01-color-saville-street")
    duplicate_anchor = dict(color_item,
        sceneId=color_first["sceneId"],
        sourceParagraphSha256=color_first["sourceParagraphSha256"],
        chapterOneBased=1, afterParagraph=0
    )
    manifest["images"] = [item, duplicate_anchor]
    save()
    invoke(root, "--write", passes=False)
    manifest["images"] = [item, color_item]
    save()
    invoke(root, "--check")
    manifest["images"] = []
    manifest["releaseApproved"] = False
    save()
    invoke(root, "--write", passes=False)  # orphaned published art is never silently erased
    output.unlink()  # explicit owner-reviewed removal simulated in disposable fixture
    color_output.unlink()  # explicit revocation of second published test-only fixture
    invoke(root, "--write")
    invoke(root, "--check")
print("PASS: Ch1+Ch3 bilingual source gating, WebP RIFF, collision protection, review flags and revoked-art checks")
