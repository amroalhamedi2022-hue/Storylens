#!/usr/bin/env python3
"""Archive only D. H. Friston's real 1887 A Study in Scarlet period engravings.

Source: https://commons.wikimedia.org/wiki/Category:A_Study_in_Scarlet_illustrated_by_D._H._Friston
Only four explicitly named historic original plate files are eligible; exclude
front covers, replicas, movies, arbitrary scan pages, tiny decorative initials
and AI art. Verify individual Commons public-domain metadata, real JPEG bytes,
source SHA256 and local-colour-preserving WebP SHA256 before retaining source.
Historical rights/scene/editorial remains pending, no reader publication.
"""
from __future__ import annotations

import argparse
import json
import re

import intake_verne_commons_period_gallery as engine

engine.DEST = engine.ROOT / "docs/literature/staging/study-in-scarlet-friston-1887-period-plates"
engine.MANIFEST = engine.DEST / "manifest.json"
engine.IMAGES = engine.DEST / "plates"
engine.SOURCE_CATEGORY = "Category:A Study in Scarlet illustrated by D. H. Friston"
engine.ORIGINAL_YEAR = 1887
engine.OUTPUT_PREFIX = "scarlet-friston"
engine.PERIOD_NAME = re.compile(
    r"^File:A Study in Scarlet Friston 0[1-4]\.jpg$",
    re.IGNORECASE,
)

ATTRIBUTION = "David Henry Friston (1820–1906), original Sherlock Holmes illustration artist"
EDITION = "A Study in Scarlet (Beeton's Christmas Annual, 1887); exact individual edition and scan rights require review"


def maintain_evidence() -> None:
    if not engine.MANIFEST.is_file():
        return
    doc = json.loads(engine.MANIFEST.read_text(encoding="utf-8"))
    if doc.get("category") != engine.SOURCE_CATEGORY:
        raise ValueError("Unexpected Commons category, refusing archive source metadata rewrite")
    doc["originalCreator"] = ATTRIBUTION
    doc["sourceEdition"] = EDITION
    doc["sourceWork"] = "A Study in Scarlet, Arthur Conan Doyle (1887)"
    doc["humanChapterSceneVerificationComplete"] = False
    doc["chapterSceneMatchingComplete"] = False
    doc["publicationApproved"] = False
    for image in doc["images"]:
        if not engine.PERIOD_NAME.fullmatch(image["wikiFile"]):
            raise ValueError("A non-Friston 1887 artwork file is present in the archive")
        image["originalCreator"] = ATTRIBUTION
        image["sourceEdition"] = EDITION
        image["artworkClassificationStatus"] = "PERIOD_ILLUSTRATION__CHAPTER_NOT_YET_MATCHED"
        image["altAr"] = None
        image["altEn"] = None
        image["editoriallyApproved"] = False
        image["rightsStatus"] = "PENDING_INDIVIDUAL_TERRITORY_AND_SCENE_REVIEW"
    engine.persist(doc)


def run(max_new: int) -> int:
    try:
        return engine.run(max_new)
    finally:
        # Bounded partial success must survive a temporary Commons API failure.
        maintain_evidence()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--max-new", type=int, default=4)
    args = parser.parse_args()
    if not 1 <= args.max_new <= 4:
        parser.error("max-new must be in 1..4")
    run(args.max_new)
