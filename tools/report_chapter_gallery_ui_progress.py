#!/usr/bin/env python3
"""Generate an honest reader/UI progress ledger from connected, offline source files.

The literature conversation gathers books, pictures and copyright proofs.
THIS reader conversation arranges chapter thumbnails, navigation, and tests.
Source candidates, release clearance, and published APK images are separate.
"""
from __future__ import annotations
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INPUT = "docs/literature/CHAPTER_ART_PROGRESS.json"
REGISTRY = "app/src/main/assets/lt-chapter-thumbnail-registry.js"
OUTPUT = "docs/CHAPTER_GALLERY_UI_PHASE2_PROGRESS.json"
REPORT = "docs/CHAPTER_GALLERY_UI_PHASE2_PROGRESS.md"
PREFIX = "window.LinguaChapterThumbnailRegistry=Object.freeze("


def checked_int(value, label):
    if not isinstance(value, int) or isinstance(value, bool) or value < 0:
        raise ValueError("Invalid nonnegative integer " + label)
    return value


def snapshot(root):
    source = json.loads((root / INPUT).read_text(encoding="utf-8"))
    encoded = (root / REGISTRY).read_text(encoding="utf-8")
    if PREFIX not in encoded:
        raise ValueError("Generated offline chapter-image registry is missing")
    approved_registry = json.loads(encoded.split(PREFIX, 1)[1].split(");", 1)[0])
    if not isinstance(approved_registry, dict):
        raise ValueError("Invalid registry object")
    counts = source["counts"]
    local = checked_int(counts["localCandidateChapterCards"], "localCandidateChapterCards")
    approved = checked_int(counts["readyChapterCards"], "readyChapterCards")
    if approved > local:
        raise ValueError("More ready illustrations than original-scene local candidates")
    books = []
    for item in source.get("books", []):
        if not isinstance(item, dict) or not isinstance(item.get("bookId"), str):
            raise ValueError("Malformed literature book coverage")
        chapters = item.get("chapterCount")
        if chapters is not None:
            chapters = checked_int(chapters, "chapterCount")
        candidate = checked_int(item["localCandidateChapters"], "localCandidateChapters")
        ready = checked_int(item["readyForUICards"], "readyForUICards")
        if (chapters is not None and candidate > chapters) or ready > candidate:
            raise ValueError("Impossible chapter art coverage for " + item["bookId"])
        books.append({
            "bookId": item["bookId"], "chapters": chapters,
            "locallyMappedCandidates": candidate,
            "editoriallyAndRightsReadySourceCards": ready,
            "unmappedChapters": chapters - candidate if chapters is not None else None
        })
    published = 0
    for book_id, book in approved_registry.items():
        if not isinstance(book, dict) or not isinstance(book.get("chapters"), list):
            raise ValueError("Invalid released book registry: " + book_id)
        for chapter in book["chapters"]:
            image = chapter.get("primaryImage") if isinstance(chapter, dict) else None
            if image is None:
                continue
            if not isinstance(image, dict) or not (
                image.get("editoriallyApproved") is True
                and image.get("distributionReviewApproved") is True
                and image.get("releaseApproved") is True
            ):
                raise ValueError("Unapproved source image leaked into Android")
            published += 1
    for file in [
        "app/src/main/assets/lt-chapter-gallery.js",
        "app/src/main/assets/lt-chapter-gallery.css",
        "tools/package_approved_chapter_thumbnails.py",
        "tools/chapter-thumbnail-gallery.test.cjs",
        ".github/workflows/chapter-gallery-fast-checks.yml"
    ]:
        if not (root / file).is_file():
            raise ValueError("Missing chapter-gallery implementation: " + file)
    return {
        "schemaVersion": 2,
        "scope": "Reader app organization, placement, images, chapter UI, and tests ONLY",
        "sourceFile": INPUT,
        "approvedAppRegistry": REGISTRY,
        "currentBranchPR": "https://github.com/amroalhamedi2022-hue/Storylens/pull/40",
        "implementedButRequiresFinalAcceptance": [
            "Search all AR/EN chapters by source title or number",
            "Incremental 36-card rendering for long multi-chapter sources",
            "Resume exact chapter without inventing finished percentage",
            "Safe in-reader jump and bounded Android Back handling",
            "Real image integrated into reader hero if individually approved",
            "RTL/LTR keyboard chapter access and original-colour display",
            "No book downloads, external image calls, or paper-curl alterations"
        ],
        "localSourceCandidates": local,
        "rightsAndEditorialReadySources": approved,
        "actualApprovedImagesInAndroidAppRegistry": published,
        "books": books,
        "outstanding": [
            "Approval of unique scene-matched pictures for EVERY chapter: other content chat",
            "Full contextual bilingual book text and legal review: other content chat",
            "End-to-end Chromium chapter-gallery screenshot acceptance on final head SHA",
            "Manual portrait/landscape phone and tablet Android tests",
            "Final stable signed update with existing private certificate"
        ],
        "warning": "Sources ≠ rights-reviewed editions ≠ published APK. No new APK has been delivered."
    }


def markdown(data):
    lines = [
        "# Lingua Tales | Chapter-gallery UI — live verified status",
        "",
        "## Coverage",
        "",
        "- Local source-mapped image candidates: " + str(data["localSourceCandidates"]),
        "- Rights/editorially approved source-image cards: " + str(data["rightsAndEditorialReadySources"]),
        "- Images in the actually packaged approved app registry: " +
            str(data["actualApprovedImagesInAndroidAppRegistry"]),
        "- **These counts are not interchangeable.**",
        "",
        "| Source book | Chapters | Mapped candidates | Rights-ready | Missing mapped |",
        "|---|---:|---:|---:|---:|"
    ]
    for row in data["books"]:
        number = lambda v: "unknown" if v is None else str(v)
        lines.append("| " + " | ".join([
            row["bookId"], number(row["chapters"]),
            str(row["locallyMappedCandidates"]),
            str(row["editoriallyAndRightsReadySourceCards"]),
            number(row["unmappedChapters"])
        ]) + " |")
    lines += [
        "",
        "## Implemented on the reader/UI branch",
        ""
    ]
    lines += ["- " + item for item in data["implementedButRequiresFinalAcceptance"]]
    lines += ["", "## Remaining", ""]
    lines += ["- " + item for item in data["outstanding"]]
    lines += [
        "",
        "Other conversation obtains authentic source books and pictures. This conversation",
        "organizes them in the reading UI, and never claims stage-only art is published.",
        "",
        "This report is generated by tools/report_chapter_gallery_ui_progress.py",
        "from source checksums coverage and the actual generated Android art registry.",
        ""
    ]
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--write", action="store_true")
    mode.add_argument("--report", action="store_true")
    parser.add_argument("--repo-root", type=Path, default=ROOT)
    args = parser.parse_args()
    root = args.repo_root.resolve()
    data = snapshot(root)
    if args.write:
        (root / OUTPUT).write_text(
            json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        (root / REPORT).write_text(markdown(data), encoding="utf-8")
    else:
        print(markdown(data))
    print("PASS: " + str(data["localSourceCandidates"]) +
          " locally mapped candidates, " +
          str(data["rightsAndEditorialReadySources"]) +
          " cleared sources, " +
          str(data["actualApprovedImagesInAndroidAppRegistry"]) +
          " packaged images; without false publication claims.")


if __name__ == "__main__":
    main()
