#!/usr/bin/env python3
"""Reproducible canonical 53-narrative-section index of unabridged The Moonstone.

Every chapter and narrator group is grounded in the repository's original
Standard Ebooks XHTML, checked against the pinned upstream git blob SHA and
byte length. Structural headings are NOT invented story chapters.
Historical 1874 print scan pages are NOT scene-matched chapter images.
No translation, publishing, reader/UI or rights approvals are performed.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs/literature/staging/the-moonstone"
MAP = SOURCE / "chapter-image-map.json"
X = "{http://www.w3.org/1999/xhtml}"
ORDINAL = {1: "First", 2: "Second", 3: "Third", 4: "Fourth", 5: "Fifth",
           6: "Sixth", 7: "Seventh", 8: "Eighth"}
GROUP_TITLE = {
    "prologue": "Prologue",
    "first-period": "First Period: The Loss of the Diamond (1848)",
    "second-period": "Second Period: The Discovery of the Truth (1848–1849)",
    "epilogue": "Epilogue: The Finding of the Diamond",
}
FIRST = re.compile(r"^chapter-1-(\d+)\.xhtml$")
SECOND_SUB = re.compile(r"^chapter-2-(\d+)-(\d+)\.xhtml$")
SECOND_SINGLE = re.compile(r"^chapter-2-(\d+)\.xhtml$")
EPILOGUE = re.compile(r"^epilogue-(\d+)\.xhtml$")


def roman(n: int) -> str:
    pieces = []
    for value, glyph in ((100, "C"), (90, "XC"), (50, "L"), (40, "XL"),
                         (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I")):
        q, n = divmod(n, value)
        pieces.append(glyph * q)
    return "".join(pieces)


def git_blob_sha(raw: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(raw)).encode("ascii") + b"\0" + raw).hexdigest()


def exact_parts() -> list[str]:
    return (["prologue.xhtml", "first-period.xhtml"]
            + [f"chapter-1-{n}.xhtml" for n in range(1, 24)]
            + ["second-period.xhtml"]
            + [f"chapter-2-1-{n}.xhtml" for n in range(1, 9)]
            + [f"chapter-2-2-{n}.xhtml" for n in range(1, 4)]
            + [f"chapter-2-3-{n}.xhtml" for n in range(1, 11)]
            + [f"chapter-2-{n}.xhtml" for n in range(4, 9)]
            + ["epilogue.xhtml"]
            + [f"epilogue-{n}.xhtml" for n in range(1, 4)])


def title_for(file: str, xhtml_title: str) -> dict:
    if file == "prologue.xhtml":
        if xhtml_title != "Prologue":
            raise ValueError("Original prologue title was changed")
        return dict(titleEn="Prologue", periodId="prologue",
                    sourcePeriodTitle=GROUP_TITLE["prologue"],
                    sectionKind="prologue", narrativeOneBased=None, chapterWithinGroup=None)
    first = FIRST.fullmatch(file)
    second = SECOND_SUB.fullmatch(file)
    single = SECOND_SINGLE.fullmatch(file)
    epilogue = EPILOGUE.fullmatch(file)
    if first:
        n = int(first.group(1))
        if n not in range(1, 24) or xhtml_title != roman(n):
            raise ValueError("First-period original Roman chapter title mismatch")
        return dict(titleEn="First Period · Chapter " + roman(n),
                    periodId="first-period", sourcePeriodTitle=GROUP_TITLE["first-period"],
                    sectionKind="chapter", narrativeOneBased=None, chapterWithinGroup=n)
    if second:
        group, n = map(int, second.groups())
        if group not in range(1, 4) or xhtml_title != roman(n):
            raise ValueError("Second-period original narrative/chapter title mismatch")
        return dict(titleEn="Second Period · " + ORDINAL[group] + " Narrative · Chapter " + roman(n),
                    periodId="second-period", sourcePeriodTitle=GROUP_TITLE["second-period"],
                    sectionKind="chapter", narrativeOneBased=group, chapterWithinGroup=n)
    if single:
        group = int(single.group(1))
        if group not in range(4, 9) or xhtml_title != ORDINAL[group] + " Narrative":
            raise ValueError("Second-period single narrative title mismatch")
        return dict(titleEn="Second Period · " + xhtml_title,
                    periodId="second-period", sourcePeriodTitle=GROUP_TITLE["second-period"],
                    sectionKind="narrative", narrativeOneBased=group, chapterWithinGroup=None)
    if epilogue:
        n = int(epilogue.group(1))
        if n not in range(1, 4) or not xhtml_title.startswith(roman(n) + ": "):
            raise ValueError("Original epilogue statement title mismatch")
        return dict(titleEn="Epilogue · " + xhtml_title,
                    periodId="epilogue", sourcePeriodTitle=GROUP_TITLE["epilogue"],
                    sectionKind="epilogue-statement", narrativeOneBased=None, chapterWithinGroup=n)
    raise ValueError("Unexpected source file in Moonstone narrative: " + file)


def generate() -> dict:
    manifest = json.loads((SOURCE / "manifest.json").read_text("utf-8"))
    if (manifest.get("id") != "collins-the-moonstone-1868" or
            manifest.get("completeOriginalSource") is not True or
            manifest.get("narrativeParts") != 53 or
            manifest.get("structuralParts") != 3):
        raise ValueError("Original unabridged English source structure changed")
    parts = manifest["sourceParts"]
    expected = exact_parts()
    if len(parts) != 56 or [part["file"] for part in parts] != expected:
        raise ValueError("Canonical period, prologue and epilogue source order drift")
    current = None
    sections = []
    for part in parts:
        name = part["file"]
        raw = (SOURCE / name).read_bytes()
        if len(raw) != part["bytes"] or git_blob_sha(raw) != part["upstreamGitBlobSha"]:
            raise ValueError("Pinned original English source bytes or git blob SHA changed: " + name)
        xml = ET.fromstring(raw)
        title = xml.find(f"./{X}head/{X}title")
        if title is None or not (title.text or "").strip():
            raise ValueError("Original source section title missing: " + name)
        xhtml_title = " ".join(title.itertext()).strip()
        if part["kind"] == "structural-heading":
            if name not in ("first-period.xhtml", "second-period.xhtml", "epilogue.xhtml"):
                raise ValueError("Noncanonical structural heading")
            current = name.removesuffix(".xhtml")
            if xhtml_title != GROUP_TITLE[current]:
                raise ValueError("Original part's published English heading changed")
            continue
        if part["kind"] != "narrative":
            raise ValueError("Misclassified original manuscript unit")
        metadata = title_for(name, xhtml_title)
        if name == "prologue.xhtml" and current is not None:
            raise ValueError("Original Prologue is not first")
        if name != "prologue.xhtml" and current != metadata["periodId"]:
            raise ValueError("Narrative placed under wrong source part")
        paragraphs = [" ".join("".join(p.itertext()).split()) for p in xml.findall(f".//{X}p")]
        if not paragraphs or sum(len(p) for p in paragraphs) < 300:
            raise ValueError("Narrative source is incomplete or structurally broken: " + name)
        sections.append({
            "chapterOneBased": len(sections) + 1,
            **metadata,
            "titleAr": "",
            "sourceOriginalTitle": xhtml_title,
            "sourceFile": (SOURCE / name).relative_to(ROOT).as_posix(),
            "sourceGitBlobSha": part["upstreamGitBlobSha"],
            "primaryImage": None,
            "imageStatus": "NO_VERIFIED_CHAPTER_SPECIFIC_ART__PERIOD_FACSIMILES_UNCLASSIFIED",
        })
    if len(sections) != 53 or len({x["sourceFile"] for x in sections}) != 53:
        raise ValueError("Original fifty-three narrative sections not recovered uniquely")
    if [x["periodId"] for x in sections].count("first-period") != 23:
        raise ValueError("First-period canonical twenty-three chapters changed")
    if [x["periodId"] for x in sections].count("second-period") != 26:
        raise ValueError("Second-period canonical twenty-six units changed")
    if [x["periodId"] for x in sections].count("epilogue") != 3:
        raise ValueError("Epilogue original three statements changed")
    return {
        "schemaVersion": 1,
        "bookId": manifest["id"],
        "source": manifest["source"]["editionURL"],
        "sourceEditionCommit": manifest["source"]["upstreamCommit"],
        "sourceStructure": "One Prologue, 23 First-Period chapters, 26 Second-Period narrative units, three Epilogue statements",
        "chapterCount": 53,
        "countSemantics": "NARRATIVE_SECTIONS_INCLUDING_PROLOGUE_AND_EPILOGUE__NOT_53_ORDINARY_CHAPTERS",
        "releaseApproved": False,
        "localCandidateChapters": 0,
        "missingCandidateChapters": 53,
        "readyForUICards": 0,
        "historicalSourceScansAwaitingSceneReview": "docs/literature/staging/moonstone-1874-original-scans/manifest.json",
        "chapters": sections,
    }


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--write", action="store_true")
    p.add_argument("--verify", action="store_true")
    args = p.parse_args()
    expected = generate()
    if args.write:
        MAP.write_text(json.dumps(expected, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if args.verify and json.loads(MAP.read_text("utf-8")) != expected:
        raise SystemExit("FAIL: committed Moonstone chapter map differs from original source")
    print("PASS: 53 complete SHA-pinned original narrative units; 0 fake image mappings or rights approvals")
