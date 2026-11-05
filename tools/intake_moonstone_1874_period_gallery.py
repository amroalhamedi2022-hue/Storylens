#!/usr/bin/env python3
"""Acquire genuine 1874 Harper & Brothers Moonstone facsimile pages, not chapter cards.

These are historical PRINT SCANS which may contain illustrations or text-only
matter. They are individually Commons-PD-tagged, SHA-256 stored, and must not
count as verified chapter artwork until a scene+chapter+territory editor signs.
Original colours are retained without AI enhancement or forced sepia.
"""
from __future__ import annotations

import argparse
import json
import re

import intake_verne_commons_period_gallery as engine

engine.DEST = engine.ROOT / "docs/literature/staging/moonstone-1874-original-scans"
engine.MANIFEST = engine.DEST / "manifest.json"
engine.IMAGES = engine.DEST / "plates"
engine.SOURCE_CATEGORY = "Category:The Moonstone (1874)"
engine.ORIGINAL_YEAR = 1874
engine.PERIOD_MIME = "image/png"
engine.PERIOD_MAGIC = b"\x89PNG\r\n\x1a\n"
engine.OUTPUT_PREFIX = "moonstone-1874"
engine.PERIOD_NAME = re.compile(
    r"^File:Moonstone novel - pg ([1-9][0-9]{0,3})\.png$", re.IGNORECASE
)

EDITION = "The Moonstone, 1874 Harper & Brothers period facsimile; individual plate imagery unclassified"


def run(max_new: int) -> int:
    count = engine.run(max_new)
    if engine.MANIFEST.is_file():
        doc = json.loads(engine.MANIFEST.read_text(encoding="utf-8"))
        doc["sourceEdition"] = EDITION
        doc["sourceWork"] = "Wilkie Collins, The Moonstone, first published 1868"
        doc["historicalPrintScanInventoryOnly"] = True
        doc["chapterSceneMatchingComplete"] = False
        doc["publicationApproved"] = False
        for image in doc["images"]:
            image["pageNumberInPrint"] = int(engine.PERIOD_NAME.fullmatch(image["wikiFile"]).group(1))
            image["sourceEdition"] = EDITION
            image["creator"] = "Harper & Brothers (1874 publisher); individual engraver unknown"
            image["artworkClassificationStatus"] = "PRINT_SCAN_UNCLASSIFIED_MAY_INCLUDE_TEXT"
            image["altAr"] = None
            image["altEn"] = None
            image["editoriallyApproved"] = False
            image["rightsStatus"] = "PENDING_HUMAN_TERRITORY_AND_SCENE_REVIEW"
        engine.persist(doc)
    return count


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--max-new", type=int, default=12)
    args = parser.parse_args()
    if not 1 <= args.max_new <= 24:
        parser.error("--max-new must be between 1 and 24")
    run(args.max_new)
