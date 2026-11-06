#!/usr/bin/env python3
"""Package ONLY fully approved existing chapter-image maps for Lingua Tales UI.

This is the UI/arrangement workstream's image-placement bridge. The OTHER
literature conversation finds/downloading/rights-reviews source picture files.
No original literature/image acquisition, AI art generation or network.
Source art + chapter map stay unchanged. Source bytes are checked by SHA-256.
Approved pictures are copied into the offline Android asset tree and a
deterministic local JS registry is emitted for lt-chapter-gallery.js.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import re
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
_MAP = "docs/literature/staging"
_DEST = "app/src/main/assets"
_REGISTRY = "lt-chapter-thumbnail-registry.js"
IMAGE_EXT = {".webp", ".png", ".jpg", ".jpeg"}
WORK_ID = re.compile(r"^[a-z0-9][a-z0-9-]{1,94}$")
CHECKSUM = re.compile(r"^[a-f0-9]{64}$")
ASSET_NAME = re.compile(r"^art/[a-z0-9_-]+(?:/[a-z0-9_-]+)*\.(?:webp|png|jpe?g)$", re.I)
TRUSTED_ARCHIVES = {
    "commons.wikimedia.org", "www.metmuseum.org", "www.loc.gov",
    "gallica.bnf.fr", "www.gutenberg.org", "archive.org",
}



def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def beneath(root: Path, p: Path) -> bool:
    try:
        p.resolve().relative_to(root.resolve())
        return True
    except ValueError:
        return False


def approved(image: dict, book_release: bool) -> bool:
    return (
        book_release and
        isinstance(image, dict) and
        image.get("editoriallyApproved") is True and
        image.get("releaseApproved") is True and
        image.get("distributionReviewApproved") is True and
        image.get("rightsStatus") in ("APPROVED", "CLEARED")
    )


def image_source(repo: Path, source_path: str, expected_sha: str) -> tuple[Path, bytes]:
    if not isinstance(source_path, str) or source_path.startswith("/") or "\\" in source_path:
        raise ValueError("Image path must be repo-relative and offline")
    if not CHECKSUM.fullmatch(str(expected_sha).lower()):
        raise ValueError("Approved image lacks a real SHA-256")
    f = repo / source_path
    if not beneath(repo, f) or not f.is_file() or f.is_symlink() or f.suffix.lower() not in IMAGE_EXT:
        raise ValueError(f"Untrusted/missing/non-raster approved image: {source_path}")
    data = f.read_bytes()
    if sha(data) != expected_sha.lower():
        raise ValueError(f"Source picture SHA mismatch: {source_path}")
    if len(data) < 300 or len(data) > 26_000_000:
        raise ValueError("Unsupported approved image byte size")
    suffix = f.suffix.lower()
    signature = (
        suffix == ".webp" and data[:4] == b"RIFF" and data[8:12] == b"WEBP"
    ) or (suffix == ".png" and data[:8] == b"\x89PNG\r\n\x1a\n") or (
        suffix in (".jpg", ".jpeg") and data[:3] == b"\xff\xd8\xff"
    )
    if not signature:
        raise ValueError(f"Approved image extension and real bytes disagree: {source_path}")
    return f, data


def add_book(repo: Path, doc: Path, packaged: dict, transfers: dict,
             assets_dir: Path, global_seen: set[str]):
    raw = json.loads(doc.read_text(encoding="utf-8"))
    book_id = raw.get("bookId")
    if not isinstance(book_id, str) or not WORK_ID.fullmatch(book_id):
        raise ValueError(f"Malformed book ID in {doc}")
    chapters = raw.get("chapters")
    count = raw.get("chapterCount")
    if not isinstance(chapters, list) or not isinstance(count, int) or count < 1 or count > 1001:
        raise ValueError(f"Malformed chapter count for {book_id}")
    if len(chapters) != count:
        raise ValueError(f"Chapter index length mismatch {book_id}")
    if book_id in packaged:
        raise ValueError(f"Two source maps for {book_id}")
    if raw.get("schemaVersion") != 1:
        raise ValueError(f"Unsupported source-map schema for {book_id}")
    if raw.get("releaseApproved") is not True:
        # Staging-only candidates must NEVER leak through an app image registry.
        return
    chapters_out = []
    source_seen: set[str] = set()
    for index, entry in enumerate(chapters, 1):
        if not isinstance(entry, dict) or entry.get("chapterOneBased") != index:
            raise ValueError(f"{book_id}: source chapters out of order at index {index}")
        image = entry.get("primaryImage")
        if not approved(image, True):
            chapters_out.append({"primaryImage": None})
            continue
        source_path = image.get("imagePath")
        source_hash = image.get("sha256")
        _, data = image_source(repo, source_path, source_hash)
        if source_hash.lower() in source_seen or source_hash.lower() in global_seen:
            raise ValueError(f"Duplicate illustration across book or chapter cards: {book_id}")
        source_seen.add(source_hash.lower())
        global_seen.add(source_hash.lower())
        alt_ar = image.get("altAr")
        alt_en = image.get("altEn")
        credit = image.get("credit")
        scene = image.get("sceneAnchor")
        url = image.get("sourceUrl")
        source_edition = image.get("sourceEdition")
        license_note = image.get("license")
        if not all(isinstance(t, str) and t.strip() and len(t) <= 320 for t in
                   (alt_ar, alt_en, credit, scene, url, source_edition, license_note)):
            raise ValueError(f"{book_id} chapter {index}: missing original scene/alt/edition/licence")
        parsed = urlsplit(url)
        if parsed.scheme != "https" or parsed.hostname not in TRUSTED_ARCHIVES or parsed.username:
            raise ValueError(f"{book_id} chapter {index}: untrusted picture archive source")
        ext = Path(source_path).suffix.lower()
        local = f"art/chapters/{book_id}/chapter-{index:03d}{ext}"
        if not ASSET_NAME.fullmatch(local):
            raise ValueError(f"Invalid packaged asset name: {local}")
        target = assets_dir / local
        if not beneath(assets_dir, target):
            raise ValueError(f"Unsafe Android target path: {local}")
        if target in transfers and transfers[target] != data:
            raise ValueError(f"Colliding target image binary: {target}")
        transfers[target] = data
        chapters_out.append({"primaryImage": {
            "src": local,
            "sha256": source_hash.lower(),
            "sourceUrl": url,
            "sourceEdition": source_edition,
            "license": license_note,
            "credit": credit,
            "altAr": alt_ar,
            "altEn": alt_en,
            "sceneAnchor": scene,
            "editoriallyApproved": True,
            "releaseApproved": True,
            "distributionReviewApproved": True,
            "rightsStatus": "APPROVED",
        }})
    packaged[book_id] = {"chapters": chapters_out}


def build(repo: Path):
    root = repo / _MAP
    app = repo / _DEST
    if not root.is_dir() or not app.is_dir():
        raise ValueError("Repository root or Android assets not found")
    out, binary_transfers, global_seen = {}, {}, set()
    for doc in sorted(root.rglob("chapter-image-map.json")):
        if not beneath(root, doc) or doc.is_symlink():
            raise ValueError(f"Invalid map location {doc}")
        add_book(repo, doc, out, binary_transfers, app, global_seen)
    # A source file is never rewritten; only distinct approved binaries may be
    # copied into app assets, preserving original colour and content SHA-256.
    js = "/* Generated by tools/package_approved_chapter_thumbnails.py; do not hand-edit. */\n"
    js += "window.LinguaChapterThumbnailRegistry=Object.freeze(" + json.dumps(
        out, ensure_ascii=False, sort_keys=True, separators=(",", ":")
    ) + ");\n"
    return app / _REGISTRY, js.encode("utf-8"), binary_transfers, out


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo-root", type=Path, default=ROOT)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--write", action="store_true")
    group.add_argument("--check", action="store_true")
    args = parser.parse_args()
    repo = args.repo_root.resolve()
    registry, script, pictures, book_maps = build(repo)
    # Rights may be withdrawn AFTER an earlier approval. An orphaned chapter
    # photo would remain inside an APK even if no JS references it; fail both
    # verification and write, requiring an explicit reviewed removal from Git.
    # NEVER delete any historic image silently.
    generated_dir = repo / _DEST / "art/chapters"
    stored = set()
    if generated_dir.is_dir():
        for file in generated_dir.rglob("*"):
            if file.is_file() or file.is_symlink():
                stored.add(file)
    orphaned = stored - set(pictures)
    if orphaned:
        raise ValueError("Orphaned/revoked packaged chapter art (manual removal required): " +
                         ", ".join(str(p.relative_to(repo)) for p in sorted(orphaned)))
    if args.check:
        if not registry.is_file() or registry.read_bytes() != script:
            raise ValueError("App chapter thumbnail registry not synchronized with approved source maps")
        for dest, data in pictures.items():
            if not dest.is_file() or dest.read_bytes() != data:
                raise ValueError(f"Approved local image not copied/incorrect: {dest}")
    else:
        for dest, data in pictures.items():
            if dest.exists() and dest.read_bytes() != data:
                raise ValueError(f"Refusing to overwrite a different packaged chapter image: {dest}")
        for dest, data in pictures.items():
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(data)
        registry.write_bytes(script)
    print(f"{'VERIFIED' if args.check else 'PACKAGED'} {len(book_maps)} release-approved book maps, "
          f"{len(pictures)} distinct rights-cleared/scene-matched CHAPTER images; "
          "unapproved source candidates remain excluded.", flush=True)


if __name__ == "__main__":
    main()
