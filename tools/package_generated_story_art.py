#!/usr/bin/env python3
"""Fail-closed, offline-only AI companion-art packager. Historical art is separate.

Usage:
 python3 tools/package_generated_story_art.py --write
 python3 tools/package_generated_story_art.py --check
Separate REAL output image, paragraph proof, legal/editorial approval and
book release approval MUST exist before ANY new generated image reaches Android.
No API requests, image generation, or automatic rights assumptions occur here.
"""
from __future__ import annotations
import argparse
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = Path("docs/art-generation/approved/generated-art-release.json")
SRC = Path("docs/art-generation/approved")
OUT = Path("app/src/main/assets")
REG = "lt-generated-art-registry.js"
SCENE_RE = re.compile(r"^verne-ch0[1-4]-(?:color-)?[a-z0-9-]{1,65}$")
SHA_RE = re.compile(r"^[0-9a-f]{64}$")
VALID_BOOK = "around-the-world-in-eighty-days-towle"


def inside(base: Path, path: Path) -> bool:
    try:
        path.resolve().relative_to(base.resolve())
        return True
    except ValueError:
        return False


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def queue_from_actual_source(repo: Path) -> list[dict]:
    """Load both scene queues, freshly anchored to the real bilingual source.

    Multiple proposed art styles may target the same paragraph; published
    scenes are checked for duplicate anchors separately, after owner review.
    """
    queues = [("story_art_pilot.cjs", "classic"),
              ("prepare_color_scene_queue.cjs", "color")]
    verified: list[dict] = []
    seen: set[str] = set()
    with tempfile.TemporaryDirectory() as temp:
        for command, label in queues:
            out = Path(temp) / f"{label}.json"
            run = subprocess.run(
                ["node", str(repo / "tools" / command), "--export", str(out)],
                cwd=repo, capture_output=True, text=True, timeout=30
            )
            if run.returncode:
                raise ValueError("Verified original scene queue failed: "
                                 + label + ": " + run.stderr)
            data = json.loads(out.read_text(encoding="utf-8"))
            if (data.get("bookId") != VALID_BOOK or
                    data.get("releaseApproved") is not False or
                    not isinstance(data.get("queue"), list) or not data["queue"]):
                raise ValueError("Invalid verified scene queue: " + label)
            for scene in data["queue"]:
                if (not isinstance(scene, dict) or
                        scene.get("status") != "PROMPT_READY_NOT_GENERATED" or
                        scene.get("editoriallyApproved") is not False or
                        not isinstance(scene.get("sourceParagraphSha256"), str) or
                        not SHA_RE.fullmatch(scene["sourceParagraphSha256"]) or
                        scene.get("sceneId") in seen):
                    raise ValueError("Invalid/duplicated scene proof in: " + label)
                seen.add(scene["sceneId"])
                verified.append(scene)
    return verified


def approved_item(item: dict) -> bool:
    return (
        item.get("generated") is True
        and item.get("sourceType") == "AI_GENERATED_MODERN_COMPANION"
        and item.get("editoriallyApproved") is True
        and item.get("ownerImageApproved") is True
        and item.get("distributionReviewApproved") is True
        and item.get("imageRightsReviewed") is True
        and item.get("releaseApproved") is True
    )


def build(repo: Path) -> tuple[Path, bytes, dict[Path, bytes], dict]:
    root = repo / SRC
    app = repo / OUT
    doc = repo / MANIFEST
    if not doc.is_file() or not app.is_dir():
        raise ValueError("Required generated-art release manifest or Android asset root missing")
    m = json.loads(doc.read_text("utf-8"))
    if m.get("schemaVersion") != 1 or m.get("bookId") != VALID_BOOK or not isinstance(m.get("images"), list):
        raise ValueError("Unexpected/generated-art schema or book")
    real = queue_from_actual_source(repo)
    by_id = {s["sceneId"]: s for s in real}
    images = m["images"]
    if m.get("releaseApproved") is not True:
        # Unapproved/preview candidates MUST NEVER be silently shipped.
        if images:
            for item in images:
                if not isinstance(item, dict) or item.get("releaseApproved") is True:
                    raise ValueError("Premature scene release inside unapproved book manifest")
        images = []
    if len(images) > 12:
        raise ValueError("Unbounded first-batch image release")
    transfers, entries, seen_hashes, seen_ids, seen_anchor = {}, [], set(), set(), set()
    for item in images:
        if not isinstance(item, dict) or not approved_item(item):
            raise ValueError("Generated image lacks every human/territory/release gate")
        sid = item.get("sceneId")
        if not isinstance(sid, str) or not SCENE_RE.fullmatch(sid) or sid not in by_id or sid in seen_ids:
            raise ValueError("Invalid, unknown or duplicate approved scene id")
        seen_ids.add(sid)
        scene = by_id[sid]
        if not sid.startswith(f"verne-ch0{scene['chapterOneBased']}-"):
            raise ValueError("Scene ID does not match real source chapter")
        if item.get("sourceParagraphSha256") != scene["sourceParagraphSha256"]:
            raise ValueError("Original source paragraph fingerprint mismatch")
        if item.get("afterParagraph") != scene["afterParagraph"] or item.get("chapterOneBased") != scene["chapterOneBased"]:
            raise ValueError("Wrong narrative position or chapter")
        key = (scene["chapterOneBased"], scene["afterParagraph"])
        if key in seen_anchor:
            raise ValueError("Duplicate paragraph illustration")
        seen_anchor.add(key)
        rel = f"{VALID_BOOK}/{sid}.webp"
        fp = root / rel
        if not inside(root, fp) or fp.is_symlink() or not fp.is_file():
            raise ValueError("Approved local image missing or untrusted: " + sid)
        data = fp.read_bytes()
        digest = sha(data)
        if digest != item.get("sha256") or not SHA_RE.fullmatch(digest):
            raise ValueError("Generated binary checksum mismatch")
        if digest in seen_hashes:
            raise ValueError("Same generated image reused for two scenes")
        seen_hashes.add(digest)
        if not (300 < len(data) <= 10_000_000 and data[:4] == b"RIFF"
                and data[8:12] == b"WEBP" and
                int.from_bytes(data[4:8], "little") + 8 == len(data) and
                data[12:16] in (b"VP8 ", b"VP8L", b"VP8X")):
            raise ValueError("Invalid, oversized or non-WebP image")
        model = item.get("model")
        if not isinstance(model, str) or not 3 <= len(model) <= 80:
            raise ValueError("Missing true image model provenance")
        credit = item.get("credit")
        if not isinstance(credit, str) or "AI" not in credit or not 10 <= len(credit) <= 160:
            raise ValueError("Must explicitly distinguish AI image from historical art")
        local = f"art/generated/{VALID_BOOK}/{sid}.webp"
        dest = app / local
        if not inside(app, dest):
            raise ValueError("Unsafe offline asset path")
        transfers[dest] = data
        entries.append({
            "src": local,
            "sceneId": sid,
            "sha256": digest,
            "sourceParagraphSha256": scene["sourceParagraphSha256"],
            "sourceExcerpt": scene["sourceExcerpt"],
            "generated": True,
            "sourceType": "AI_GENERATED_MODERN_COMPANION",
            "ownerImageApproved": True,
            "imageRightsReviewed": True,
            "afterParagraph": scene["afterParagraph"],
            "chapterOneBased": scene["chapterOneBased"],
            "altAr": scene["altAr"],
            "altEn": scene["altEn"],
            "credit": credit,
            "origin": "AI_GENERATED",
            "model": model,
            "editoriallyApproved": True,
            "distributionReviewApproved": True,
            "releaseApproved": True
        })
    # Consumer registry is distinct from the immutable original historic-art registry.
    ordered = {}
    for s in sorted(entries, key=lambda x: (x["chapterOneBased"], x["afterParagraph"])):
        ordered.setdefault(str(s["chapterOneBased"]), []).append(s)
    registry = ({VALID_BOOK: {"chapters": ordered}} if ordered else {})
    text = "/* AI companion illustrations ONLY; never historic-source art. Generated by offline packager. */\n"
    text += "window.LinguaGeneratedArtRegistry=Object.freeze(" + json.dumps(
        registry, ensure_ascii=False, sort_keys=True, separators=(",", ":")
    ) + ");\n"
    return app / REG, text.encode("utf8"), transfers, registry


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__)
    group = p.add_mutually_exclusive_group(required=True)
    group.add_argument("--write", action="store_true")
    group.add_argument("--check", action="store_true")
    p.add_argument("--repo-root", type=Path, default=ROOT)
    args = p.parse_args()
    repo = args.repo_root.resolve()
    registry, text, transfers, active = build(repo)
    existing = repo / OUT / "art/generated"
    stored = set(f for f in existing.rglob("*") if f.is_file() or f.is_symlink()) if existing.is_dir() else set()
    orphaned = stored - set(transfers)
    if orphaned:
        raise ValueError("Revoked/orphaned app-generated files need manual removal: "
                         + ", ".join(str(f.relative_to(repo)) for f in sorted(orphaned)))
    if args.check:
        if not registry.is_file() or registry.read_bytes() != text:
            raise ValueError("Generated-art Android registry outdated")
        for dest, data in transfers.items():
            if not dest.is_file() or dest.read_bytes() != data:
                raise ValueError("Approved image missing from offline Android assets")
    else:
        for dest, data in transfers.items():
            if dest.exists() and dest.read_bytes() != data:
                raise ValueError("Refusing to overwrite an existing generated image")
        for dest, data in transfers.items():
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(data)
        registry.write_bytes(text)
    print(("VERIFIED" if args.check else "PACKAGED")
          + f": {sum(len(x['chapters']) for x in active.values()) if active else 0} approved book manifests, "
          + f"{len(transfers)} distinct AI images; historic source untouched")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError, subprocess.TimeoutExpired) as err:
        print("FAIL:", err, file=sys.stderr)
        sys.exit(1)
