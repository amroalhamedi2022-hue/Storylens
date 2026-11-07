#!/usr/bin/env python3
"""Acquire ONLY authentic early illustrations and book cover for The Woman in White.

Commons has eight 1903 Thomas Eyre Macklin lithographs, the original 1861
John Gilbert frontispiece and a separately documented 1860 Harper cover.
These are THREE distinct archival edition contexts. No claim that the 1903
plates appeared in the first 1859-1860 English serial, which was unillustrated.
Source: https://commons.wikimedia.org/wiki/Category:The_Woman_in_White
Store actual downloaded/decoded JPEG -> WebP binary + SHA256; no AI art.
Nothing is chapter-mapped or authorized for app publication.
"""
from __future__ import annotations

import argparse
import json
import re

import intake_verne_commons_period_gallery as engine

CATEGORY = "Category:The Woman in White"
MACKLIN = "Thomas Eyre Macklin (1867–1943)"
GILBERT = "Sir John Gilbert (1817–1897)"
HARPER = "Harper & Brothers, New York (publisher)"
WORK = "The Woman in White — Wilkie Collins (first serialized 1859–1860)"
DESTINATION = "docs/literature/staging/woman-white-original-1860-1903-plates"

MACKLIN_NAMES = {
    f"File:Illustration by Thomas Eyre Macklin for The Woman in White ({i}).jpg"
    for i in range(1, 9)
}
GILBERT_NAME = "File:The Woman In White - Illustration.jpg"
COVER_NAME = "File:The Woman In White - Cover.jpg"
ALL_NAMES = MACKLIN_NAMES | {GILBERT_NAME, COVER_NAME}

engine.DEST = engine.ROOT / DESTINATION
engine.MANIFEST = engine.DEST / "manifest.json"
engine.IMAGES = engine.DEST / "plates"
engine.SOURCE_CATEGORY = CATEGORY
# One combined historically sourced Commons category has mixed edition dates;
# the archive's year must remain NULL and each scan has its own pinned year.
engine.ORIGINAL_YEAR = None
engine.OUTPUT_PREFIX = "woman-white-period"
engine.MIN_CATEGORY_MEMBERS = 10
engine.PERIOD_NAME = re.compile(
    r"^File:(?:Illustration by Thomas Eyre Macklin for The Woman in White "
    r"\([1-8]\)|The Woman In White - (?:Illustration|Cover))\.jpg$",
    re.IGNORECASE,
)


def edition_for(name: str) -> tuple[int, str, str, str]:
    if name in MACKLIN_NAMES:
        return (
            1903, MACKLIN,
            "Thomas Eyre Macklin 1903 Woman in White lithograph; first British "
            "serial and Standard Ebooks text are not this art edition",
            "ORIGINAL_1903_NOVEL_LITHOGRAPH__NO_VERIFIED_CHAPTER_SCENE",
        )
    if name == GILBERT_NAME:
        return (
            1861, GILBERT,
            "John Gilbert frontispiece to London Sampson Low 1861 one-volume edition",
            "ORIGINAL_1861_ONE_VOLUME_BOOK_FRONTISPIECE__UNASSIGNED",
        )
    if name == COVER_NAME:
        return (
            1860, HARPER,
            "1860 Harper & Brothers New York book cover; publisher-designed binding, not chapter art",
            "ORIGINAL_1860_BOOK_COVER__NOT_A_CHAPTER_THUMBNAIL",
        )
    raise ValueError("Not one of ten original licensed historical Woman in White source files")


def maintain_provenance() -> None:
    if not engine.MANIFEST.is_file():
        return
    document = json.loads(engine.MANIFEST.read_text("utf-8"))
    if (document.get("category") != CATEGORY
            or document.get("publicationApproved") is not False
            or document.get("chapterSceneMatchingComplete") is not False):
        raise ValueError("Unexpected mixed-edition Commons archive or approval")
    images = document.get("images", [])
    if len(images) > len(ALL_NAMES):
        raise ValueError("Too many originals: accidental extra files in selected Commons category")
    names, hashes, webps = set(), set(), set()
    document["originalEditionYear"] = None
    document["sourceWork"] = WORK
    document["sourceTextWorkId"] = "the-woman-in-white"
    document["editionScope"] = "1860 Harper cover; 1861 Gilbert frontispiece; 1903 Macklin lithographs"
    document["humanSceneReviewComplete"] = False
    document["chapterSceneMatchingComplete"] = False
    document["publicationApproved"] = False
    document["allOriginalTenSourceFilesArchived"] = False
    for image in images:
        name = image.get("wikiFile")
        if name not in ALL_NAMES or name in names:
            raise ValueError("Unexpected or duplicate historical filename")
        original = image.get("originalCommonsSHA1MetadataOnly")
        webp = image.get("webpSha256")
        if original in hashes or webp in webps:
            raise ValueError("Duplicate original source SHA1 or decoded local WebP")
        if not image.get("individualCommonsLicense") or not image.get("commonsPage"):
            raise ValueError("Missing per-file Commons copyright or source")
        year, artist, edition, classification = edition_for(name)
        image["sourceArtworkYear"] = year
        image["originalCreator"] = artist
        image["sourceEdition"] = edition
        image["artworkClassificationStatus"] = classification
        image["editoriallyApproved"] = False
        image["rightsStatus"] = "PENDING_INDIVIDUAL_TERRITORIAL_AND_EDITORIAL_REVIEW"
        image["altAr"] = None
        image["altEn"] = None
        image["publishedToApp"] = False
        names.add(name)
        hashes.add(original)
        webps.add(webp)
    document["allOriginalTenSourceFilesArchived"] = names == ALL_NAMES
    engine.persist(document)


def run(max_new: int = 10) -> int:
    if not 1 <= max_new <= 10:
        raise ValueError("max-new must be from 1 through 10")
    try:
        return engine.run(max_new)
    finally:
        # An interrupted Github Action still retains the individually pinned,
        # downloaded real files (if any); no phantom approved image count.
        maintain_provenance()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--max-new", type=int, default=10)
    args = parser.parse_args()
    if not 1 <= args.max_new <= 10:
        parser.error("max-new must be from 1 through 10")
    run(args.max_new)
