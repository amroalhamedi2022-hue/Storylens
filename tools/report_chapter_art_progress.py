#!/usr/bin/env python3
"""Evidence-only Lingua Tales chapter artwork inventory; do not auto-release art.

Offline stdlib tool: checks real local binaries, original archive manifests,
chapter-image-map v1 structure, SHA256 and rights/editorial flags.
Run from repo root: python tools/report_chapter_art_progress.py --write
"""
from __future__ import annotations
import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STAGING = ROOT / "docs/literature/staging"
OUT = ROOT / "docs/literature"
MAP = STAGING / "verne-chapter-cards/chapter-image-map.json"
HIST = OUT / "HISTORIC_VERNES_ASSETS.json"

FIVE = (
    ("treasure-island", "Treasure Island"),
    ("kidnapped", "Kidnapped"),
    ("the-black-arrow", "The Black Arrow"),
    ("the-last-of-the-mohicans", "The Last of the Mohicans"),
    ("the-gilded-age", "The Gilded Age"),
)
OLDER = (
    ("a-study-in-scarlet", "A Study in Scarlet"),
    ("dracula", "Dracula"),
    ("frankenstein", "Frankenstein"),
    ("the-hound-of-the-baskervilles", "The Hound of the Baskervilles"),
    ("the-lost-world", "The Lost World"),
    ("the-sign-of-the-four", "The Sign of the Four"),
    ("kalila-arabic-wikisource", "Kalila wa Dimna"),
)
APPROVED_RIGHTS = {"APPROVED_FOR_TARGET_TERRITORIES", "CLEARED_FOR_DISTRIBUTION"}


def jload(path: Path) -> dict | list:
    return json.loads(path.read_text(encoding="utf-8"))


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def local(root_relative: str) -> Path:
    if not isinstance(root_relative, str) or not root_relative:
        raise ValueError("Missing local image path")
    resolved = (ROOT / root_relative).resolve()
    if not resolved.is_relative_to(ROOT.resolve()) or not resolved.is_file():
        raise ValueError("Missing/out-of-repo image: " + root_relative)
    return resolved


def check_binary(root_relative: str, claimed_hash: str) -> None:
    if not isinstance(claimed_hash, str) or len(claimed_hash) != 64:
        raise ValueError("Missing SHA256 for " + root_relative)
    if sha256(local(root_relative).read_bytes()) != claimed_hash.lower():
        raise ValueError("Bad SHA256 for " + root_relative)


def map_coverage(path: Path, total: int) -> dict:
    data = jload(path)
    if data.get("schemaVersion") != 1 or data.get("chapterCount") != total:
        raise ValueError("Chapter map schema/count mismatch")
    chapters = data.get("chapters")
    if not isinstance(chapters, list) or len(chapters) != total:
        raise ValueError("Missing chapter rows; never invent placeholders")
    nums = [r.get("chapterOneBased") for r in chapters]
    if nums != list(range(1, total + 1)):
        raise ValueError("Chapter order must be 1..N with no gaps or duplicates")
    mapped, approved, names = [], [], set()
    for chapter in chapters:
        photo = chapter.get("primaryImage")
        if not photo:
            continue
        name = photo.get("imagePath")
        if name in names:
            raise ValueError("One image was reused as primary for several chapters: " + str(name))
        names.add(name)
        check_binary(name, photo.get("sha256"))
        if not photo.get("sourceUrl") or not photo.get("sceneAnchor"):
            raise ValueError("Missing image provenance or chapter scene: " + name)
        mapped.append(chapter["chapterOneBased"])
        if photo.get("editoriallyApproved") is True and photo.get("rightsStatus") in APPROVED_RIGHTS:
            if not photo.get("altAr") or not photo.get("altEn") or not photo.get("license"):
                raise ValueError("Rights-approved card lacks metadata: " + name)
            approved.append(chapter["chapterOneBased"])
    return {"mappedChapterNumbers": mapped, "readyChapterNumbers": approved,
            "localCandidateChapters": len(mapped), "readyForUICards": len(approved),
            "missingImageChapters": total - len(mapped),
            "missingReadyChapters": total - len(approved),
            "imageMap": str(path.relative_to(ROOT))}


def archived_illustrations(folder: Path) -> dict:
    manifest = jload(folder / "manifest.json")
    art = manifest.get("art", [])
    claimed = int(manifest.get("historicArtFiles", 0))
    verified = 0
    for row in art:
        source = str((folder / row["localPath"]).relative_to(ROOT))
        check_binary(source, row["webpSha256"])
        if row.get("literaryArtwork") is True:
            verified += 1
    if verified != claimed:
        raise ValueError("Historic art count mismatches original source for " + folder.name)
    return {"archivedLocalHistoricArt": verified, "allArchivedImageTags": len(art),
            "originalChapterMarkerOccurrencesNotVerifiedChapterCount":
                manifest.get("source", {}).get("chapterMarkerOccurrences")}


def generate() -> dict:
    manifest = jload(HIST)
    if len(manifest) != 9 or len({x["file"] for x in manifest}) != 9:
        raise ValueError("Pinned Verne source art differs from 9-image baseline; audit before refresh")
    for item in manifest:
        check_binary("app/src/main/assets/art/" + item["file"], item["webp_sha256"])
    verne = map_coverage(MAP, 37)
    expected = sorted(x["chapter"] + 1 for x in manifest)
    if verne["mappedChapterNumbers"] != expected:
        raise ValueError("Verne chapter map does not exactly match period-art provenance")
    rows = [
        {"bookId": "around-the-world-in-eighty-days-towle",
         "title": "Around the World in Eighty Days", "sourceState": "37 source chapters plus Arabic draft",
         "chapterCount": 37, "archivedLocalHistoricArt": len(manifest), **verne},
        {"bookId": "collins-the-moonstone-1868", "title": "The Moonstone",
         "sourceState": "staged English; chapter segmentation/rights pending",
         "chapterCount": None, "narrativeSourceUnitsNotChapterCount": 53,
         "localCandidateChapters": 0, "readyForUICards": 0,
         "missingImageChapters": None, "missingReadyChapters": None,
         "archivedLocalHistoricArt": 0},
        {"bookId": "wells-war-of-the-worlds-1898", "title": "The War of the Worlds",
         "sourceState": "27 original chapters staged; bilingual/rights pending",
         "chapterCount": 27, "localCandidateChapters": 0, "readyForUICards": 0,
         "missingImageChapters": 27, "missingReadyChapters": 27,
         "archivedLocalHistoricArt": 0},
    ]
    for slug, title in FIVE:
        archive = STAGING / "illustrated-five-20261105" / slug
        data = archived_illustrations(archive)
        rows.append({"bookId": slug, "title": title,
                     "sourceState": "full illustrated English original staged; distinct chapter map pending",
                     "chapterCount": None, "localCandidateChapters": 0,
                     "readyForUICards": 0, "missingImageChapters": None,
                     "missingReadyChapters": None, **data})
    for slug, title in OLDER:
        archive = STAGING / slug
        if archive.is_dir():
            rows.append({"bookId": slug, "title": title,
                         "sourceState": "older staged work; chapter-card coverage audit pending",
                         "chapterCount": None, "localCandidateChapters": 0,
                         "readyForUICards": 0, "missingImageChapters": None,
                         "missingReadyChapters": None})
    available = sum(r["localCandidateChapters"] for r in rows)
    ready = sum(r["readyForUICards"] for r in rows)
    return {
        "schemaVersion": 1,
        "contract": "docs/literature/CHAPTER_IMAGE_CONTRACT.md",
        "scope": "checked-in main branch only; open PR 16 artifacts NOT counted as main",
        "policy": "at least one distinct locally stored, sourced, chapter-matched and rights-cleared primary image per chapter",
        "counts": {"localCandidateChapterCards": available, "readyChapterCards": ready,
                   "verifiedArchivedHistoricArtFilesAmongTrackedEightBooks":
                       sum(r.get("archivedLocalHistoricArt", 0) for r in rows)},
        "books": rows,
        "nextWork": [
            "Backfill 28 Verne chapters without any locally sourced primary image; editorial/territory clearance of the nine candidates is still pending",
            "Derive exact narrative chapter indexes for five staged English illustrated books and The Moonstone, map original art to actual chapter scenes",
            "Source contextual art for all 27 The War of the Worlds chapters",
            "Revisit all older staged books and incoming PR book collections without counting unmerged materials on main",
            "Have reader/UI thread implement image-backed ordered chapter cards only from approved local chapter-image maps"
        ],
        "releaseStatus": "NOT_READY_FOR_CHAPTER_CARDS; DO_NOT_PUBLISH_PENDING_RIGHTS_AND_EDITORIAL"
    }


def markdown(report: dict) -> str:
    lines = [
        "# Lingua Tales — chapter-image coverage LIVE snapshot",
        "",
        "**Contract:** docs/literature/CHAPTER_IMAGE_CONTRACT.md. This file is generated by "
        "tools/report_chapter_art_progress.py from actual locally present, SHA256-verified binaries. "
        "**Scope: main only; sources in other PRs are not counted here.**",
        "",
        "**Important:** local image candidates are not approved for release or UI. "
        "Archived image counts are NOT distinct chapter thumbnails.",
        "",
        "## Current totals",
        "",
        "- Locally mapped chapter candidates: **" +
          str(report["counts"]["localCandidateChapterCards"]) + "**.",
        "- Chapter cards with both territorial rights and editorial approval: **" +
          str(report["counts"]["readyChapterCards"]) + "**.",
        "- Verified historical art binaries retained in audited archives (all editions): **" +
          str(report["counts"]["verifiedArchivedHistoricArtFilesAmongTrackedEightBooks"]) + "**; "
          "NOT necessarily chapter-aligned.",
        "",
        "## Book-by-book audit",
        "",
        "| Book | Actual chapters | Local primary image candidates | Approved chapter cards | Missing candidates | Source / blocker |",
        "| --- | ---: | ---: | ---: | ---: | --- |",
    ]
    for r in report["books"]:
        total = str(r["chapterCount"]) if r["chapterCount"] is not None else "Needs segmentation"
        missing = str(r["missingImageChapters"]) if r["missingImageChapters"] is not None else "Unknown"
        lines.append("| " + r["title"] + " | " + total + " | " +
                     str(r["localCandidateChapters"]) + " | " + str(r["readyForUICards"]) +
                     " | " + missing + " | " + r["sourceState"] + " |")
    lines.extend([
        "", "## Next actions (highest to lowest priority)", "",
    ])
    lines.extend(str(i) + ". " + item for i, item in enumerate(report["nextWork"], 1))
    lines.extend([
        "", "## Data & handoff", "",
        "- Machine-readable counts: docs/literature/CHAPTER_ART_PROGRESS.json.",
        "- Chapter-level Verne candidate map: docs/literature/staging/verne-chapter-cards/chapter-image-map.json.",
        "- Exact historic scan/rights source list: docs/literature/HISTORIC_VERNES_ASSETS.json.",
        "- GitHub handoff: docs/handoffs/LINGUA_TALES_HANDOFF_CURRENT.md.",
        "- Story content automation is separate from the scheduled GitHub report; inspect latest Actions SHA and output before claiming any new image.",
        "- This inventory does NOT assert that a chapter card exists for any staged book lacking a verified chapter-to-image map, even if its archive contains hundreds of figures.",
        "", "## Remaining counts",
        "",
        "- Verne: **28 chapters without candidates, 37 without approved chapter thumbnails**; nine distinct locally mapped historical plates await approvals.",
        "- War of the Worlds: **27 chapters without candidates**.",
        "- Moonstone/five illustrated classics/older works: formal edition-specific chapter segmentation, scene mapping, artwork/rights and review still open.",
        "- Book cover art, full bilingual human review and signed reader release require independent checks.",
        "",
    ])
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--write", action="store_true")
    args = parser.parse_args()
    report = generate()
    text = json.dumps(report, indent=2, ensure_ascii=False) + "\n"
    page = markdown(report)
    if args.write:
        (OUT / "CHAPTER_ART_PROGRESS.json").write_text(text, encoding="utf-8")
        (OUT / "CHAPTER_ART_PROGRESS.md").write_text(page, encoding="utf-8")
    print("PASS: local candidate chapter cards =", report["counts"]["localCandidateChapterCards"],
          "ready =", report["counts"]["readyChapterCards"],
          "audited archive art =", report["counts"]["verifiedArchivedHistoricArtFilesAmongTrackedEightBooks"])


if __name__ == "__main__":
    main()
