#!/usr/bin/env python3
"""Research-only acquisition: 1912 authentic original Lost World illustrated plates.

A Commons *category* includes film/fan art, covers, PDFs and later editions.
Whitelist precisely ten actual 1912 illustrated book images with named original
print pages; exclude the film adaptations and generic 1924 Swedish art. Actual
Commons per-file public-domain metadata + downloaded source+local WebP SHA256
is required; no guess at the depicted chapter, synthetic colour or rights grant.
"""
from __future__ import annotations

import argparse
import json
import re

import intake_verne_commons_period_gallery as engine

engine.DEST = engine.ROOT / "docs/literature/staging/lost-world-original-1912-period-plates"
engine.MANIFEST = engine.DEST / "manifest.json"
engine.IMAGES = engine.DEST / "plates"
engine.SOURCE_CATEGORY = "Category:The Lost World"
engine.ORIGINAL_YEAR = 1912
engine.OUTPUT_PREFIX = "lost-world-1912"
engine.PERIOD_NAME = re.compile(
    r"^File:(?:"
    r"Page (?:55|59|142|161|187|195|222|311) \(The Lost World[,.] 1912\)|"
    r"General view of plateau from top of gingho tree, page 225 \(The Lost World, 1912\)|"
    r"The Celestial Lake, page 299 \(The Lost World, 1912\)"
    r")\.jpg$",
    re.IGNORECASE,
)

ORIGINAL_WORK = "Arthur Conan Doyle, The Lost World (1912)"
EDITION = ("1912 Hodder and Stoughton original illustrated edition archive-source scans; "
           "individual image artist, final scene and territory rights pending review")


def maintain_provenance() -> None:
    if not engine.MANIFEST.is_file():
        return
    archive = json.loads(engine.MANIFEST.read_text("utf-8"))
    if archive["category"] != engine.SOURCE_CATEGORY:
        raise ValueError("Wrong historical 1912 original edition category")
    archive["sourceWork"] = ORIGINAL_WORK
    archive["sourceEdition"] = EDITION
    archive["historicalPrintYear"] = 1912
    archive["chapterSceneMatchingComplete"] = False
    archive["publicationApproved"] = False
    for image in archive["images"]:
        if not engine.PERIOD_NAME.fullmatch(image["wikiFile"]):
            raise ValueError("A modern/foreign Lost World media file was added to original archive")
        image["sourceEdition"] = EDITION
        image["originalPrintedYear"] = 1912
        image["originalCreator"] = "Individual original printed image artist not yet independently attributed"
        image["artworkClassificationStatus"] = "GENUINE_1912_PRINTED_ILLUSTRATION_CHAPTER_UNMATCHED"
        image["editoriallyApproved"] = False
        image["altAr"] = None
        image["altEn"] = None
        image["rightsStatus"] = "PENDING_1912_ORIGINAL_PRINT_AND_TERRITORIAL_REVIEW"
    engine.persist(archive)


def run(max_new: int) -> int:
    try:
        return engine.run(max_new)
    finally:
        maintain_provenance()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--max-new", type=int, default=10)
    args = parser.parse_args()
    if not 1 <= args.max_new <= 10:
        parser.error("--max-new must be between 1 and 10 unique original illustrated plates")
    run(args.max_new)
