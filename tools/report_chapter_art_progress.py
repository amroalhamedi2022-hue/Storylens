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
import re
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
    mapped, approved, names, hashes = [], [], set(), set()
    for chapter in chapters:
        photo = chapter.get("primaryImage")
        if not photo:
            continue
        name = photo.get("imagePath")
        if name in names:
            raise ValueError("One image was reused as primary for several chapters: " + str(name))
        names.add(name)
        image_hash = photo.get("sha256")
        if isinstance(image_hash, str) and image_hash.lower() in hashes:
            raise ValueError("One image binary was reused as primary for several chapters: " + str(name))
        check_binary(name, image_hash)
        hashes.add(image_hash.lower())
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


def verify_recovered_illustrated_source(slug: str) -> dict:
    folder = STAGING / "user-requested-classics-20261105" / slug
    manifest = jload(folder / "manifest.json")
    if manifest["workId"] != slug:
        raise ValueError("Recovered source ID mismatch: " + slug)
    images = manifest["sourceImages"]
    if len(images) != int(manifest["historicalArtworkCandidates"]):
        raise ValueError("Historical image source counts mismatch: " + slug)
    for image in images:
        check_binary(str((folder / image["localPath"]).relative_to(ROOT)), image["sha256"])
    return {"archivedLocalHistoricArt": len(images), "sourceImageCount": len(images)}


def verify_kalila_miniatures() -> int:
    folder = STAGING / "kalila-original-colour-miniatures-20261105"
    manifest = jload(folder / "manifest.json")
    images = manifest["plates"]
    for image in images:
        if image.get("colourWasAdded") is not False or image.get("colourRemoved") is not False:
            raise ValueError("Historically authentic Kalila colour was altered")
        check_binary(str((folder / image["localPath"]).relative_to(ROOT)), image["webpSha256"])
    return len(images)


def war_of_worlds_original_chapter_coverage() -> dict:
    """Hash-pin the complete 17+10 original Wells chapters and exact headings."""
    import re

    folder = STAGING / "the-war-of-the-worlds"
    manifest = jload(folder / "manifest.json")
    map_path = folder / "chapter-image-map.json"
    book_map = jload(map_path)
    originals = manifest["originalChapters"]
    structural = manifest["structuralParts"]
    if (manifest.get("completeOriginalSource") is not True or
        len(originals) != 27 or
        book_map.get("chapterCount") != 27 or
        book_map.get("releaseApproved") is not False or
        book_map.get("bookId") != manifest.get("id") or
        book_map.get("sourceUpstreamCommit") != manifest["source"]["upstreamCommit"] or
        book_map.get("sourceStructuralUnits") != structural or
        len(book_map.get("chapters", [])) != 27):
        raise ValueError("Wells source book map or text structure inconsistent")
    for original in originals + structural:
        name = original["file"]
        if not re.fullmatch(r"(?:chapter-[12]-[0-9]+|book-[12]|dedication|epigraph)\.xhtml", name):
            raise ValueError("Unsafe/unexpected Wells narrative file: " + name)
        data = (folder / name).read_bytes()
        if (len(data) != original["bytes"] or
            hashlib.sha1(b"blob " + str(len(data)).encode("ascii") + b"\x00" + data).hexdigest() != original["upstreamGitBlobSha"]):
            raise ValueError("Wells original text SHA changed: " + name)
    for i, (source, row) in enumerate(zip(originals, book_map["chapters"]), 1):
        expected_id = f'chapter-{source["book"]}-{source["number"]}'
        raw = (folder / source["file"]).read_bytes().decode("utf-8")
        title = re.search(r"<title>([^<]+)</title>", raw)
        section = re.search(r'<section\b[^>]*\bid="(chapter-[12]-[0-9]+)"', raw)
        if (not title or not section or section.group(1) != expected_id or
            row.get("chapterOneBased") != i or
            row.get("sourceBookOneBased") != source["book"] or
            row.get("chapterWithinBookOneBased") != source["number"] or
            row.get("sourceFilePath") != str((folder / source["file"]).relative_to(ROOT)) or
            row.get("sourceGitBlobSha") != source["upstreamGitBlobSha"] or
            row.get("sourceByteCount") != source["bytes"] or
            row.get("sourceXhtmlSectionId") != expected_id or
            row.get("originalXhtmlTitle") != title.group(1) or
            row.get("titleEn") != title.group(1).split(": ", 1)[-1]):
            raise ValueError("Wells original chapter title/order not exact: " + str(i))
    return {**map_coverage(map_path, 27),
            "sourceHashAudit": "UPSTREAM_GIT_BLOB_SHA1_AND_ACTUAL_XHTML_TITLES",
            "sourceStructuralUnits": len(structural)}



def staged_original_chapter_coverage(archive: Path) -> dict:
    """Verify full staged source chapters and their non-release image-map slots.

    The manifest's original upstream Git blob SHA-1 is checked against every
    staged XHTML byte string, independently of the image SHA-256 contract.
    Prologue, epilogue and framing letters are preserved but not miscounted
    as numbered chapters.
    """
    import re

    original_manifest = jload(archive / "manifest.json")
    source_rows = original_manifest.get("originalChapters")
    if source_rows is None:
        source_rows = original_manifest.get("narrativeParts")
    if not isinstance(source_rows, list) or not source_rows:
        raise ValueError("Missing complete original narrative manifest: " + archive.name)
    if original_manifest.get("completeOriginalSource") is not True and original_manifest.get("originalSourceComplete") is not True:
        raise ValueError("Original source not marked complete: " + archive.name)

    image_map_path = archive / "chapter-image-map.json"
    image_map = jload(image_map_path)
    if image_map.get("schemaVersion") != 1 or image_map.get("bookId") != archive.name:
        raise ValueError("Incorrect original book ID or map schema: " + archive.name)
    if image_map.get("releaseApproved") is not False:
        raise ValueError("Unreviewed original book falsely marked publishable: " + archive.name)
    if image_map.get("sourceManifestPath") != str((archive / "manifest.json").relative_to(ROOT)):
        raise ValueError("Unpinned original source manifest: " + archive.name)

    expected_chapters = []
    expected_other_units = []
    for part in source_rows:
        name = part["file"]
        if not isinstance(name, str) or not re.fullmatch(
                r"(?:chapter-[0-9]+(?:-[0-9]+)?|letter-[0-9]+|preface|epilogue)\.xhtml", name):
            raise ValueError("Unexpected/unsafe original unit: " + str(name))
        data = (archive / name).read_bytes()
        expected_sha = part.get("upstreamGitBlobSha")
        if (len(data) != part.get("bytes") or
            hashlib.sha1(b"blob " + str(len(data)).encode("ascii") + b"\x00" + data).hexdigest() != expected_sha):
            raise ValueError("Staged original source changed from pinned Git blob: " + name)
        if name.startswith("chapter-"):
            expected_chapters.append(part)
        else:
            expected_other_units.append(part)

    chapters = image_map.get("chapters", [])
    if len(chapters) != len(expected_chapters) or image_map.get("chapterCount") != len(chapters):
        raise ValueError("Original chapter list not complete: " + archive.name)
    if len(image_map.get("nonChapterNarrativeUnits", [])) != len(expected_other_units):
        raise ValueError("Original framing/closing narrative was dropped: " + archive.name)
    for i, (mapped, source) in enumerate(zip(chapters, expected_chapters), 1):
        if (mapped.get("chapterOneBased") != i or
            mapped.get("sourceFilePath") != str((archive / source["file"]).relative_to(ROOT)) or
            mapped.get("sourceGitBlobSha") != source["upstreamGitBlobSha"] or
            mapped.get("sourceByteCount") != source["bytes"]):
            raise ValueError("Misordered/misattributed original source chapter: " + archive.name)
    for mapped, source in zip(image_map["nonChapterNarrativeUnits"], expected_other_units):
        if (mapped.get("sourceFilePath") != str((archive / source["file"]).relative_to(ROOT)) or
            mapped.get("sourceGitBlobSha") != source["upstreamGitBlobSha"] or
            mapped.get("sourceByteCount") != source["bytes"]):
            raise ValueError("Missing or mismatched source framing/epilogue: " + archive.name)

    coverage = map_coverage(image_map_path, len(chapters))
    return {**coverage, "nonChapterNarrativeSourceUnits": len(expected_other_units),
            "sourceManifest": str((archive / "manifest.json").relative_to(ROOT)),
            "sourceHashAudit": "UPSTREAM_GIT_BLOB_SHA1_AND_EXACT_BYTES"}



def verify_unpublished_gutenberg_edition(slug: str, volume: int | None = None) -> dict:
    """Integrity audit of a REAL complete Gutenberg text; not its chapter/translation readiness."""
    folder = STAGING / "user-requested-classics-20261105" / slug
    meta = jload(folder / "manifest.json")
    source = meta["source"]
    original = (folder / "original-edition.html").read_bytes()
    if (sha256(original) != source["sha256"] or
        len(original) != source["bytes"] or
        source.get("originalFullEditionPreservedVerbatim") is not True or
        source.get("completeGutenbergMarkers") is not True or
        meta["acceptance"].get("fullNaturalArabicTranslation") is not False or
        meta["acceptance"].get("appIntegrated") is not False or
        (volume is not None and
         (meta.get("seriesVolume") != volume or meta.get("seriesVolumeCount") != 10))):
        raise ValueError("Source or publication flag differs from pinned original edition: " + slug)
    if meta.get("historicalArtworkCandidates") != len(meta.get("sourceImages", [])):
        raise ValueError("Archive artwork count inaccurate: " + slug)
    return {"sourceOriginalSha256": source["sha256"],
            "originalNarrativeWordsClaimFromSource": source["narrativeWords"],
            "localCandidateChapters": 0, "readyForUICards": 0,
            "chapterCount": None, "missingImageChapters": None,
            "missingReadyChapters": None, "archivedLocalHistoricArt": 0,
            "sourceHashAudit": "BYTE_EXACT_GUTENBERG_SHA256",
            "sourceState": "complete historic English source SHA-pinned; no canonical night/chapter alignment, complete contextual bilingual edition, verified chapter art or territorial clearance"}


def verify_mclenan_1860_original_illustrations() -> dict:
    """Count only independently *visually seen* 1860 wood engravings.
    Reject prose-only scan patches and all machine-only detected regions.
    Every actual source WebP and its separate primary visual-review ledger
    must independently SHA-match; never award chapter publication rights.
    """
    folder=STAGING/"woman-white-mclenan-1860-original-scan"
    path=folder/"manifest.json"
    result={
        "originalHarper1860McLenanConfirmedArtworkFiles":0,
        "unverifiedOriginalScanRegionsNotCountedAsArt":0,
        "historicalScannedProseFalsePositivesDiscarded":0,
        "archivedLocalHistoricArt":0
    }
    if not path.is_file():
        return result
    doc=jload(path)
    expected_pdf="97c7236c8f6f02d63fa2a11043402f781467ba8c57aad48556be72080f19b854"
    if (doc.get("schemaVersion")!=1
            or doc.get("sourceFileTitle")!="File:The woman in white. A novel .. (IA womaninwhitenove00collrich).pdf"
            or doc.get("sourcePDFSHA256")!=expected_pdf
            or doc.get("sourcePDFBytes")!=31714138
            or doc.get("sourcePDFPageCount")!=278
            or doc.get("sourcePDFYear")!=1860
            or doc.get("originalIllustrator")!="John McLenan (illustrator, 1860)"
            or doc.get("publicationApproved") is not False
            or doc.get("chapterSceneMatchingComplete") is not False
            or doc.get("humanVisualReviewComplete") is not False
            or not str(doc.get("individualCommonsSourceLicense","")).lower().startswith("public domain")):
        raise ValueError("Original 1860 Harper PDF source hash/edition or release flags differ")
    verified=folder/"visually-inspected-original-drawings.json"
    if not verified.is_file():
        raise ValueError("1860 historical source archive has no separately verified drawings ledger")
    ledger=jload(verified)
    if (ledger.get("bookId")!="the-woman-in-white"
            or ledger.get("sourcePDFSHA256")!=expected_pdf
            or ledger.get("readyChapterThumbnailCount")!=0
            or ledger.get("rightsStatus")!="HUMAN_TERRITORIAL_AND_EDITORIAL_REVIEW_PENDING"
            or ledger.get("realArchiveImagesVisuallySeenCount") != len(ledger.get("visuallyVerifiedHistoricalPictureSources", []))):
        raise ValueError("Original engraving classification ledger forged approval or provenance")
    records=doc.get("images",[])
    if len({x.get("webpSha256") for x in records})!=len(records):
        raise ValueError("Duplicate true image crop SHA in original source")
    if len({x.get("localPath") for x in records})!=len(records):
        raise ValueError("Duplicate image source path in original source")
    all_images={}
    for row in records:
        name=row.get("localPath")
        claimed=row.get("webpSha256")
        if (not isinstance(name,str) or not name.startswith("scan-art-crops/harper1860-p")
                or not isinstance(claimed,str)
                or not re.fullmatch("[0-9a-f]{64}",claimed)
                or row.get("sourcePDFSHA256")!=expected_pdf
                or not (1<=row.get("sourcePageOneBased",0)<=278)
                or row.get("sourceArtist")!="John McLenan (illustrator, 1860)"
                or row.get("sourceOriginalPublisher")!="Harper & Brothers, New York, 1860"
                or row.get("editoriallyApproved") is not False
                or row.get("humanSceneReviewApproved") is not False
                or row.get("territorialRightsApproved") is not False
                or row.get("publishedToApp") is not False
                or row.get("chapterOneBased") is not None
                or row.get("altAr") is not None or row.get("altEn") is not None):
            raise ValueError("1860 original image region lacks SHA/authentic period source quarantine")
        check_binary(str((folder/name).relative_to(ROOT)),claimed)
        all_images[claimed]=row
    identified=set()
    for sighting in ledger["visuallyVerifiedHistoricalPictureSources"]:
        digest=sighting["webpSha256"]
        row=all_images.get(digest)
        if row is None or digest in identified:
            raise ValueError("Visually classified original drawing missing/duplicated SHA evidence")
        if (sighting.get("sourceOriginalPixelRectXYXY")!=row.get("sourceOriginalPixelRectXYXY")
                or sighting.get("sourcePDFPageOneBased")!=row.get("sourcePageOneBased")
                or sighting.get("sourcePDFSHA256")!=expected_pdf
                or sighting.get("localPath")!=row.get("localPath")
                or sighting.get("sourceIllustrationType")!=
                    "ORIGINAL_PERIOD_WOOD_ENGRAVING_CANDIDATE_VERIFIED_AS_DRAWING_NOT_TEXT"
                or sighting.get("evidence")!=
                    "DIRECT_VISUAL_INSPECTION_OF_ACTUAL_1860_BOOK_SCAN_CROP"
                or sighting.get("specificChapter") is not None
                or sighting.get("humanVisualSceneReviewCompleted") is not False
                or sighting.get("editorialPublicationApproved") is not False
                or sighting.get("targetTerritoryRightsApproved") is not False
                or not sighting.get("visualDescriptionEn")
                or not sighting.get("visualDescriptionAr")):
            raise ValueError("1860 art classification cannot claim invented scene/rights")
        identified.add(digest)
    text_rejects=doc.get("visuallyRejectedProseScans",[])
    for reject in text_rejects:
        if reject.get("sha256") in all_images:
            raise ValueError("Plain scanned page text wrongly counted as historical art")
        if reject.get("review")!="ONLY_TYPESET_PROSE__NOT_AN_ORIGINAL_ENGRAVING":
            raise ValueError("Source false-positive rejection lacks provenance")
    result["originalHarper1860McLenanConfirmedArtworkFiles"]=len(identified)
    result["unverifiedOriginalScanRegionsNotCountedAsArt"]=len(records)-len(identified)
    result["historicalScannedProseFalsePositivesDiscarded"]=len(text_rejects)
    result["archivedLocalHistoricArt"]=len(identified)
    return result


def verify_woman_white_authentic_period_art() -> dict:
    """10 uniquely SHA-audited mixed-edition original sources: eight 1903
    Macklin novel plates, Gilbert's 1861 frontispiece, 1860 publisher cover.
    Historical cover is NOT counted as a per-chapter illustration.
    Never grant distribution/scene/editorial approval from a Commons label.
    """
    archive = STAGING / "woman-white-original-1860-1903-plates" / "manifest.json"
    result = {
        "unassigned1903MacklinIllustrations": 0,
        "unassigned1861GilbertFrontispieces": 0,
        "historical1860PublisherBookCovers": 0,
        "archivedLocalHistoricArt": 0,
    }
    if not archive.exists():
        return result
    doc = jload(archive)
    macklin = {
        f"File:Illustration by Thomas Eyre Macklin for The Woman in White ({i}).jpg"
        for i in range(1, 9)
    }
    gilbert = "File:The Woman In White - Illustration.jpg"
    cover = "File:The Woman In White - Cover.jpg"
    allowed = macklin | {gilbert, cover}
    facts = {
        "macklin": (1903, "Thomas Eyre Macklin (1867–1943)",
                    "ORIGINAL_1903_NOVEL_LITHOGRAPH__NO_VERIFIED_CHAPTER_SCENE"),
        "gilbert": (1861, "Sir John Gilbert (1817–1897)",
                    "ORIGINAL_1861_ONE_VOLUME_BOOK_FRONTISPIECE__UNASSIGNED"),
        "cover": (1860, "Harper & Brothers, New York (publisher)",
                  "ORIGINAL_1860_BOOK_COVER__NOT_A_CHAPTER_THUMBNAIL"),
    }
    if (doc.get("schemaVersion") != 1
            or doc.get("category") != "Category:The Woman in White"
            or doc.get("originalEditionYear") is not None
            or doc.get("sourceTextWorkId") != "the-woman-in-white"
            or doc.get("publicationApproved") is not False
            or doc.get("humanSceneReviewComplete") is not False
            or doc.get("chapterSceneMatchingComplete") is not False
            or len(doc.get("images", [])) > 10):
        raise ValueError("Woman in White originals mixed-edition or rights verification failed")
    seen_names, sha1s, webps = set(), set(), set()
    for image in doc["images"]:
        name = image.get("wikiFile")
        if name not in allowed or name in seen_names:
            raise ValueError("Unexpected or repeated original Woman in White artwork file")
        kind = "macklin" if name in macklin else ("gilbert" if name == gilbert else "cover")
        year, artist, classification = facts[kind]
        raw_sha = image.get("originalCommonsSHA1MetadataOnly")
        encoded_sha = image.get("webpSha256")
        source_sha = image.get("downloadedResourceSha256")
        license_name = image.get("individualCommonsLicense", "")
        if (not isinstance(raw_sha, str) or not re.fullmatch("[0-9a-f]{40}", raw_sha)
                or not isinstance(source_sha, str) or not re.fullmatch("[0-9a-f]{64}", source_sha)
                or not isinstance(encoded_sha, str) or not re.fullmatch("[0-9a-f]{64}", encoded_sha)
                or raw_sha in sha1s or encoded_sha in webps
                or image.get("sourceArtworkYear") != year
                or image.get("originalCreator") != artist
                or image.get("artworkClassificationStatus") != classification
                or not image.get("sourceEdition")
                or not isinstance(license_name, str)
                or not re.search("public.domain|^pd(?:-|$)|cc0", license_name, re.IGNORECASE)
                or not str(image.get("commonsPage", "")).startswith("https://commons.wikimedia.org/wiki/File:")
                or not str(image.get("downloadURL", "")).startswith("https://upload.wikimedia.org/")
                or image.get("sceneChapterMatchStatus") != "UNREVIEWED__NO_CHAPTER_CARD"
                or image.get("rightsStatus") != "PENDING_INDIVIDUAL_TERRITORIAL_AND_EDITORIAL_REVIEW"
                or image.get("editoriallyApproved") is not False
                or image.get("publishedToApp") is not False
                or image.get("altAr") is not None or image.get("altEn") is not None
                or image.get("cropped") is not False
                or image.get("recolouring") is not False):
            raise ValueError("Woman in White historical scan lacks source, hash or rights quarantine: " + str(name))
        relative = str((archive.parent / image["localPath"]).relative_to(ROOT))
        check_binary(relative, encoded_sha)
        seen_names.add(name)
        sha1s.add(raw_sha)
        webps.add(encoded_sha)
        if kind == "macklin":
            result["unassigned1903MacklinIllustrations"] += 1
        elif kind == "gilbert":
            result["unassigned1861GilbertFrontispieces"] += 1
        else:
            result["historical1860PublisherBookCovers"] += 1
    if doc.get("allOriginalTenSourceFilesArchived") is not (seen_names == allowed):
        raise ValueError("Woman in White exact source file completeness flag differs from actual files")
    result["archivedLocalHistoricArt"] = (
        result["unassigned1903MacklinIllustrations"]
        + result["unassigned1861GilbertFrontispieces"]
    )  # The actual title-bearing book cover is tracked separately.
    return result


def verify_arabian_wikisource_arabic_segments() -> dict:
    """Keep original four Arabic parts distinct from Burton's ten English volumes."""
    archive = STAGING / "arabian-nights-arabic-wikisource-20261105"
    total_words = 0
    for number in range(1, 5):
        folder = archive / f"part-{number:02d}"
        meta = jload(folder / "manifest.json")
        original = (folder / "wikisource-original-page.html").read_bytes()
        transcript = (folder / "arabic-transcription.txt").read_bytes()
        if (meta.get("segment") != f"part-{number:02d}" or
            meta.get("workId") != "alf-layla-wa-layla" or
            len(original) != meta["originalPageBytes"] or
            sha256(original) != meta["originalPageSha256"] or
            len(transcript) != meta["transcriptionBytes"] or
            sha256(transcript) != meta["transcriptionSha256"] or
            meta.get("verifiedAsMatchingBurtonEnglishEdition") is not False or
            meta.get("colouredHistoricalChapterArtworkIntegrated") is not False):
            raise ValueError("Arabic Nights original source or bilingual rights claim changed: " + folder.name)
        total_words += meta.get("arabicWordTokens", 0)
    return {"arabicSourceSegments": 4,
            "arabicWordTokensInSource": total_words,
            "sourceHashAudit": "FOUR_ARABIC_ORIGINAL_PAGE_AND_TRANSCRIPTION_SHA256",
            "sourceState": "four exact Arabic Wikisource transcripts staged; no accepted alignment to Burton EN ten volumes; narrative/night segmentation and share-alike compliance pending",
            "chapterCount": None, "localCandidateChapters": 0,
            "readyForUICards": 0, "missingImageChapters": None,
            "missingReadyChapters": None, "archivedLocalHistoricArt": 0}



def verify_arabian_unassigned_original_period_art() -> dict:
    """Count ONLY actual newly downloaded 1907/1838-39 period art in quarantine.

    Unlike a verified chapter thumbnail, period source art remains UNASSIGNED
    until its scene is tied to a distinct Burton/Arabic passage and individual
    territorial/editorial license review. Avoid declaring Housman's retelling
    the full Burton translation or German Nacht numbers equivalent to it.
    """
    archives = {
        "dulac": (
            STAGING / "arabian-nights-dulac-london-1907-original-colour-plates" / "manifest.json",
            "Category:Stories from The Arabian Nights (Dulac, 1907) (London)",
            "Edmund Dulac", 28,
        ),
        "gross": (
            STAGING / "arabian-nights-gross-1838-original-night-illustrations" / "manifest.json",
            "Category:Illustrations to the Arabian Nights by F. Groß",
            "Friedrich Groß", 7,
        ),
    }
    results, all_originals, all_binaries = {}, set(), set()
    for edition, (manifest_path, category, artist, max_count) in archives.items():
        if not manifest_path.is_file():
            results[edition] = 0
            continue
        doc = jload(manifest_path)
        if (doc.get("category") != category
                or doc.get("publicationApproved") is not False
                or doc.get("chapterSceneMatchingComplete") is not False
                or doc.get("originalArtworkIndividualTerritorialRightsApproved") is not False
                or doc.get("sourceBookNotExactBurtonTranslation") is not True
                or doc.get("sourceBookNotExactArabicTranscription") is not True
                or doc.get("humanChapterSceneMatchesComplete") is not False):
            raise ValueError("Original Arabian art edition/source/rights/release quarantine violated")
        images = doc.get("images", [])
        if not isinstance(images, list) or len(images) > max_count or (
                doc.get("historicalOriginalImageFileCountVerifiedByManifest") != len(images)):
            raise ValueError("Original Arabian historical print count unsupported by source")
        page_list = set(range(2, 31)) - {11}
        night_list = {9, 109, 167, 231, 236, 247, 460}
        local_names = set()
        for image in images:
            original = image.get("originalCommonsSHA1MetadataOnly")
            binary = image.get("webpSha256")
            local_path = image.get("localPath")
            if (not isinstance(original, str) or len(original) != 40 or
                    not isinstance(binary, str) or len(binary) != 64 or
                    not isinstance(local_path, str) or
                    not local_path.startswith("plates/") or
                    "/../" in local_path or
                    not local_path.endswith(".webp") or
                    image.get("originalCreator") != doc.get("originalIllustrator") or
                    artist not in image.get("originalCreator", "") or
                    image.get("sourceEdition") != doc.get("sourceEdition") or
                    image.get("artworkClassificationStatus") !=
                    "HISTORIC_PRINT_ART__NOT_MATCHED_TO_CANONICAL_ARABIC_OR_BURTON" or
                    image.get("rightsStatus") !=
                    "INDIVIDUAL_LICENSE_AND_TARGET_TERRITORY_REVIEW_PENDING" or
                    image.get("editoriallyApproved") is not False or
                    image.get("publishedToApp") is not False or
                    image.get("recolouring") is not False or
                    image.get("cropped") is not False or
                    not image.get("commonsPage", "").startswith(
                        "https://commons.wikimedia.org/wiki/File:") or
                    not image.get("individualCommonsLicense")):
                raise ValueError("Arabian historical illustration has unverified source/rights/bytes")
            if (original in all_originals or binary in all_binaries or local_path in local_names):
                raise ValueError("Same Arabian historical printed plate/binary reused or duplicated")
            if edition == "dulac":
                if (image.get("sourceEditionPlateOrdinal") not in page_list
                        or image.get("sourceArtworkYear") != 1907
                        or image.get("captionEvidenceStatus") !=
                        "EXACT_LONDON_1907_PRINTED_PLATE_ORDINAL_NOT_STORY_ALIGNED"):
                    raise ValueError("False Dulac historical original plate page claim")
            else:
                if (image.get("sourcePrintedNightNumber") not in night_list
                        or image.get("sourceArtworkYear") not in (1838, 1839)
                        or (image.get("sourcePrintedNightNumber") == 460) !=
                        (image.get("sourceArtworkYear") == 1839)
                        or image.get("captionEvidenceStatus") !=
                        "EXACT_GERMAN_EDITION_NIGHT_NUMBER_NOT_SCENE_ALIGNED"):
                    raise ValueError("False Groß original German-night art claim")
            file = (manifest_path.parent / local_path).resolve()
            if not file.is_relative_to(STAGING.resolve()):
                raise ValueError("Original historical image path escapes artwork root")
            check_binary(str(file.relative_to(ROOT)), binary)
            local_names.add(local_path)
            all_originals.add(original)
            all_binaries.add(binary)
        results[edition] = len(images)
    results["total"] = sum(results.values())
    return results


def generate() -> dict:
    manifest = jload(HIST)
    if not manifest or len({x["file"] for x in manifest}) != len(manifest):
        raise ValueError("Verne pinned historical sources are missing/duplicated; audit before refresh")
    for item in manifest:
        check_binary("app/src/main/assets/art/" + item["file"], item["webp_sha256"])
    additional = jload(STAGING / "verne-period-plates-20261105" / "manifest.json")["images"]
    allowed = {
        "app/src/main/assets/art/" + item["file"]: (item["webp_sha256"], item["chapter"] + 1)
        for item in manifest
    }
    for item in additional:
        original_path = "docs/literature/staging/verne-period-plates-20261105/" + item["localFile"]
        check_binary(original_path, item["sourceSha256"])
        if original_path in allowed:
            raise ValueError("Duplicate Verne historic source image path")
        allowed[original_path] = (item["sourceSha256"], item["chapterOneBased"])
    # Strict original French print-caption + exact English scene allowlist.
    # The 57 downloaded Commons images themselves are NOT mapped or approved:
    # only these independently image-inspected five actual narrative scenes are
    # checked against their complete original Towle chapter files. Never treat
    # archive membership or an AI-suggested quotation as chapter-card evidence.
    commons_plates = STAGING / "verne-commons-period-plates"
    commons_manifest = jload(commons_plates / "manifest.json")
    verified_original_scenes = {
        4: ("07", "Une pauvre mendiante",
            "a poor beggar-woman, with a child in her arms, her naked feet smeared with mud"),
        8: ("11", "« Ma montre ! une montre de famille ! »",
            "My watch? A family watch, monsieur, which has come down from my great-grandfather!"),
        9: ("12", "Il faisait escale à Steamer-Point",
            "the next day they put in at Steamer Point, northwest of Aden harbour, to take in coal"),
        10: ("15", "Il renversa deux de ses adversaires",
             "knocking down two of his long-gowned adversaries with his fists and a vigorous application of his toes"),
        12: ("19", "Cette infortunée ne paraissait faire aucune résistance",
             "the wretched creature did not seem to be making any resistance"),
    }
    verne_map_data = jload(MAP)
    for chapter_num, (ordinal, french_caption, literal_source) in verified_original_scenes.items():
        originals = [image for image in commons_manifest["images"] if
                     image["wikiFile"].endswith("Neuville and Benett " + ordinal + ".jpg")]
        if len(originals) != 1:
            raise ValueError("Missing or duplicate French original illustrated scene for chapter " + str(chapter_num))
        item = originals[0]
        photo = verne_map_data["chapters"][chapter_num - 1].get("primaryImage")
        local_path = str((commons_plates / item["localPath"]).relative_to(ROOT))
        source_path = ROOT / f"app/src/main/assets/classic-verne-towle-ch{chapter_num:02d}.js"
        source_raw = source_path.read_bytes()
        blob_hash = hashlib.sha1(b"blob " + str(len(source_raw)).encode("ascii")
                                 + bytes([0]) + source_raw).hexdigest()
        if (not isinstance(photo, dict)
                or photo.get("imagePath") != local_path
                or photo.get("sha256") != item["webpSha256"]
                or photo.get("sourceUrl") != item["commonsPage"]
                or photo.get("originalScanMetadataSha1") != item["originalCommonsSHA1MetadataOnly"]
                or photo.get("originalFrenchCaption") != french_caption
                or photo.get("sourcePassage") != literal_source
                or photo.get("sceneAnchor") != literal_source
                or photo.get("originalEnglishSourceGitBlobSha") != blob_hash
                or photo.get("originalEnglishChapterOneBased") != chapter_num
                or literal_source.encode("utf-8") not in source_raw
                or photo.get("rightsStatus") != "PENDING_INDIVIDUAL_SCAN_TERRITORIAL_AND_EDITORIAL_REVIEW"
                or photo.get("editoriallyApproved") is not False
                or photo.get("territorialRightsCleared") is not False
                or photo.get("publicationStatus") != "STAGING_ONLY_NOT_PUBLISHED"
                or photo.get("nonAIArt") is not True
                or item.get("individualCommonsLicense") != "Public domain"
                or item.get("sceneChapterMatchStatus") != "UNREVIEWED__NO_CHAPTER_CARD"):
            raise ValueError("Verne period engraving lacks actual human-reviewed source or rights hold")
        check_binary(local_path, item["webpSha256"])
        if local_path in allowed:
            raise ValueError("Repeated a period illustration already assigned elsewhere")
        allowed[local_path] = (item["webpSha256"], chapter_num)
    # Title-page artwork is a *separate* book-cover candidate, never a
    # chapter scene or an approved locally packaged cover.
    original_cover = jload(STAGING / "verne-chapter-cards/original-historical-cover-candidate.json")
    original_title_plates = [image for image in commons_manifest["images"] if
                             image["wikiFile"].endswith("Neuville and Benett 02.jpg")]
    if len(original_title_plates) != 1:
        raise ValueError("Original Verne printed title illustration absent/duplicated")
    title_plate = original_title_plates[0]
    title_image_path = str((commons_plates / title_plate["localPath"]).relative_to(ROOT))
    if (original_cover.get("schemaVersion") != 1
            or original_cover.get("bookId") != "around-the-world-in-eighty-days-towle"
            or original_cover.get("coverSourceType") !=
               "ORIGINAL_PERIOD_ILLUSTRATED_TITLE_ART_NOT_PROVEN_HARDBACK_FRONT_COVER"
            or original_cover.get("imagePath") != title_image_path
            or original_cover.get("sha256") != title_plate["webpSha256"]
            or original_cover.get("webpBytes") != title_plate["webpBytes"]
            or original_cover.get("sourceURL") != title_plate["commonsPage"]
            or original_cover.get("originalScanMetadataSha1") !=
               title_plate["originalCommonsSHA1MetadataOnly"]
            or original_cover.get("humanEditorialApproved") is not False
            or original_cover.get("territorialRightsCleared") is not False
            or original_cover.get("publicationStatus") != "STAGING_ONLY_NOT_PUBLISHED"
            or original_cover.get("sourceScanRightsStatus") !=
               "PENDING_INDIVIDUAL_SCAN_AND_TERRITORY_REVIEW"
            or original_cover.get("originalColourUnchanged") is not True
            or not original_cover.get("altAr") or not original_cover.get("altEn")):
        raise ValueError("Original Verne title/cover source or rights misrepresented")
    check_binary(title_image_path, title_plate["webpSha256"])
    if any(row.get("primaryImage", {}) and row["primaryImage"].get("sha256") ==
           original_cover["sha256"] for row in verne_map_data["chapters"]):
        raise ValueError("Historic title page falsely reused as a distinct chapter scene")
    for row in verne_map_data["chapters"]:
        art = row.get("primaryImage")
        for image in ([art] if art else []) + row.get("secondaryImageCandidates", []):
            if image["imagePath"] not in allowed or (
                image["sha256"], row["chapterOneBased"]
            ) != allowed[image["imagePath"]]:
                raise ValueError("Verne map contains an unpinned historical source image")
    verne = map_coverage(MAP, 37)
    commons_gallery = STAGING / "verne-commons-period-plates" / "manifest.json"
    commons_candidates = 0
    if commons_gallery.is_file():
        commons_archive = jload(commons_gallery)
        if commons_archive.get("chapterSceneMatchingComplete") is not False:
            raise ValueError("Staged Commons gallery status unexpectedly claims chapter clearance")
        sha1s = set()
        for image in commons_archive["images"]:
            check_binary(
                str((commons_gallery.parent / image["localPath"]).relative_to(ROOT)),
                image["webpSha256"],
            )
            original_sha1 = image["originalCommonsSHA1MetadataOnly"]
            if original_sha1 in sha1s or original_sha1 in {x.get("expected_sha1") for x in manifest}:
                raise ValueError("Commons image duplicates a staged Verne original image")
            if image.get("sceneChapterMatchStatus") != "UNREVIEWED__NO_CHAPTER_CARD":
                raise ValueError("Commons image falsely promoted to a verified chapter card")
            sha1s.add(original_sha1)
        commons_candidates = len(commons_archive["images"])
    war_gallery = STAGING / "war-of-worlds-correa-period-plates" / "manifest.json"
    war_historic_count = 0
    if war_gallery.is_file():
        war_metadata = jload(war_gallery)
        if war_metadata.get("chapterSceneMatchingComplete") is not False:
            raise ValueError("War 1906 original gallery falsely marked chapter verified")
        war_hashes = set()
        for entry in war_metadata["images"]:
            original_hash = entry["originalCommonsSHA1MetadataOnly"]
            if original_hash in war_hashes or entry["sceneChapterMatchStatus"] != "UNREVIEWED__NO_CHAPTER_CARD":
                raise ValueError("Duplicate or incorrectly approved War 1906 plate")
            check_binary(
                str((war_gallery.parent / entry["localPath"]).relative_to(ROOT)),
                entry["webpSha256"],
            )
            war_hashes.add(original_hash)
        war_historic_count = len(war_metadata["images"])
    mohicans_extra_count = 0
    mohicans_gallery = STAGING / "mohicans-andriolli-period-plates" / "manifest.json"
    if mohicans_gallery.is_file():
        mo = jload(mohicans_gallery)
        if (mo.get("category") != "Category:Illustrations from Last of Mohicans by Michał Elwiro Andriolli"
                or mo.get("chapterSceneMatchingComplete") is not False
                or mo.get("publicationApproved") is not False):
            raise ValueError("Mohicans nineteenth-century staging claims unverified approval or wrong category")
        checked_source_hashes, checked_webp_hashes = set(), set()
        for plate in mo["images"]:
            source_hash = plate["originalCommonsSHA1MetadataOnly"]
            webp_hash = plate["webpSha256"]
            if source_hash in checked_source_hashes or webp_hash in checked_webp_hashes:
                raise ValueError("Duplicate Mohicans Andriolli source scan/image")
            if (plate.get("editoriallyApproved") is not False
                    or plate.get("rightsStatus") != "PENDING_INDIVIDUAL_TERRITORY_AND_EDITORIAL_REVIEW"
                    or not plate.get("originalCreator") or not plate.get("commonsPage")):
                raise ValueError("Andriolli archive missing provenance or falsely approved")
            check_binary(str((mohicans_gallery.parent / plate["localPath"]).relative_to(ROOT)), webp_hash)
            checked_source_hashes.add(source_hash)
            checked_webp_hashes.add(webp_hash)
        mohicans_extra_count = len(mo["images"])
    moonstone_facsimile_scans = 0
    moonstone_scan_gallery = STAGING / "moonstone-1874-original-scans" / "manifest.json"
    if moonstone_scan_gallery.is_file():
        mo = jload(moonstone_scan_gallery)
        if (mo.get("category") != "Category:The Moonstone (1874)"
                or mo.get("sourceEdition") !=
                "The Moonstone, 1874 Harper & Brothers period facsimile; individual plate imagery unclassified"
                or mo.get("publicationApproved") is not False
                or mo.get("chapterSceneMatchingComplete") is not False
                or mo.get("historicalPrintScanInventoryOnly") is not True):
            raise ValueError("1874 Moonstone facsimiles have unsupported source or approval state")
        seen_moonstone_sources, seen_moonstone_local_hashes = set(), set()
        for scan in mo["images"]:
            original = scan["originalCommonsSHA1MetadataOnly"]
            local_hash = scan["webpSha256"]
            if original in seen_moonstone_sources or local_hash in seen_moonstone_local_hashes:
                raise ValueError("Duplicate Moonstone facsimile image")
            if (scan.get("artworkClassificationStatus") != "PRINT_SCAN_UNCLASSIFIED_MAY_INCLUDE_TEXT"
                    or scan.get("editoriallyApproved") is not False
                    or scan.get("rightsStatus") != "PENDING_HUMAN_TERRITORY_AND_SCENE_REVIEW"
                    or not scan.get("commonsPage") or scan.get("sourceEdition") != mo["sourceEdition"]):
                raise ValueError("1874 Moonstone print scan lacks provenance or falsifies rights")
            check_binary(str((moonstone_scan_gallery.parent / scan["localPath"]).relative_to(ROOT)), local_hash)
            seen_moonstone_sources.add(original)
            seen_moonstone_local_hashes.add(local_hash)
        moonstone_facsimile_scans = len(mo["images"])
    moonstone_map = STAGING / "the-moonstone" / "chapter-image-map.json"
    moonstone_row = {
        "bookId": "collins-the-moonstone-1868", "title": "The Moonstone",
        "sourceState": "original English source staged; 53 source-accurate narrative units including prologue and epilogue; all chapter images/editorial rights pending",
        "chapterCount": None, "narrativeSourceUnitsNotChapterCount": 53,
        "unassignedHistorical1874FacsimileScans": moonstone_facsimile_scans,
        "localCandidateChapters": 0, "readyForUICards": 0,
        "missingImageChapters": None, "missingReadyChapters": None,
        "archivedLocalHistoricArt": 0,
    }
    if moonstone_map.is_file():
        staged = jload(moonstone_map)
        if (staged.get("bookId") != "collins-the-moonstone-1868" or
                staged.get("chapterCount") != 53 or
                staged.get("countSemantics") !=
                "NARRATIVE_SECTIONS_INCLUDING_PROLOGUE_AND_EPILOGUE__NOT_53_ORDINARY_CHAPTERS" or
                staged.get("releaseApproved") is not False or
                staged.get("sourceEditionCommit") !=
                jload(STAGING / "the-moonstone" / "manifest.json")["source"]["upstreamCommit"]):
            raise ValueError("Moonstone chapter segmentation/provenance/release gate altered")
        coverage = map_coverage(moonstone_map, 53)
        if (staged.get("localCandidateChapters") != coverage["localCandidateChapters"] or
                staged.get("readyForUICards") != coverage["readyForUICards"] or
                staged.get("missingCandidateChapters") != coverage["missingImageChapters"]):
            raise ValueError("Moonstone primary images claimed without a real local valid map")
        moonstone_row.update(coverage)
        moonstone_row["chapterCount"] = 53
        moonstone_row["chapterCountUnitLabel"] = "53 narrative sections (includes Prologue and three Epilogue statements)"
    rows = [
        {"bookId": "around-the-world-in-eighty-days-towle",
         "title": "Around the World in Eighty Days", "sourceState": "37 source chapters plus Arabic draft",
         "chapterCount": 37, "archivedLocalHistoricArt": len(manifest) + len(additional) + commons_candidates,
         "unassignedHistoricalCommonsImageFiles": commons_candidates,
         "historicBookCoverCandidateFilesNotApproved": 1,
         "bookCoverReadyForPublication": False, **verne},
        moonstone_row,
        {"bookId": "wells-war-of-the-worlds-1898", "title": "The War of the Worlds",
         "sourceState": "27 original English 17+10 chapters pinned to exact source titles and SHA, five authentic 1906 Correa scene candidate plates, all release rights pending",
         "chapterCount": 27, **war_of_worlds_original_chapter_coverage(),
         "unassignedHistoricalCorreaImageFiles": war_historic_count,
         "archivedLocalHistoricArt": war_historic_count},
    ]
    for slug, title in FIVE:
        archive = STAGING / "illustrated-five-20261105" / slug
        data = archived_illustrations(archive)
        if slug == "the-last-of-the-mohicans":
            # Archive availability is not scene-matched chapter-card coverage.
            data["unassignedHistoricalAndriolliImageFiles"] = mohicans_extra_count
            data["archivedLocalHistoricArt"] += mohicans_extra_count
        mapped_path = archive / "chapter-image-map.json"
        if mapped_path.is_file():
            mapped = jload(mapped_path)
            coverage = map_coverage(mapped_path, int(mapped["chapterCount"]))
            if mapped["localCandidateChapters"] != coverage["localCandidateChapters"] or mapped["readyForUICards"] != coverage["readyForUICards"]:
                raise ValueError("Staged five chapter map summary conflicts with verified files: " + slug)
            rows.append({"bookId": slug, "title": title,
                         "sourceState": "original full English/illustrated source staged; map from exact historical chapter heading and local plate; subject/rights/editorial not yet approved",
                         "chapterCount": mapped["chapterCount"], **coverage, **data})
        else:
            rows.append({"bookId": slug, "title": title,
                         "sourceState": "full illustrated English original staged; distinct chapter map pending",
                         "chapterCount": None, "localCandidateChapters": 0,
                         "readyForUICards": 0, "missingImageChapters": None,
                         "missingReadyChapters": None, **data})
    monte_folder = STAGING / "user-requested-classics-20261105" / "the-count-of-monte-cristo"
    if monte_folder.is_dir():
        monte_art = verify_recovered_illustrated_source("the-count-of-monte-cristo")
        monte_map = monte_folder / "chapter-image-map.json"
        if monte_map.is_file():
            monte = map_coverage(monte_map, 117)
            rows.append({"bookId": "the-count-of-monte-cristo",
                         "title": "The Count of Monte Cristo",
                         "sourceState": "complete 117-chapter historical English translation staged; original French edition/visual scene and rights review pending",
                         "chapterCount": 117, **monte, **monte_art})
        else:
            rows.append({"bookId": "the-count-of-monte-cristo", "title": "The Count of Monte Cristo",
                         "sourceState": "complete original historical English edition archived; mapping pending",
                         "chapterCount": 117, "localCandidateChapters": 0,
                         "readyForUICards": 0, "missingImageChapters": 117,
                         "missingReadyChapters": 117, **monte_art})
    valley_folder = STAGING / "user-requested-classics-20261105" / "the-valley-of-fear"
    if valley_folder.is_dir():
        valley_art = verify_recovered_illustrated_source("the-valley-of-fear")
        valley_map = valley_folder / "chapter-image-map.json"
        if valley_map.is_file():
            data = jload(valley_map)
            if (data.get("bookId") != "the-valley-of-fear" or
                    data.get("novelChapterCountExcludingEpilogue") != 14 or
                    data.get("sourceTextSha256") != jload(valley_folder / "manifest.json")["source"]["sha256"] or
                    data.get("releaseApproved") is not False):
                raise ValueError("Valley of Fear canonical 14+epilogue structure/source/rights drift")
            valley_cover = map_coverage(valley_map, 15)
            if (data.get("localCandidateChapters") != valley_cover["localCandidateChapters"]
                    or data.get("readyForUICards") != valley_cover["readyForUICards"]
                    or data.get("missingCandidateChapters") != valley_cover["missingImageChapters"]):
                raise ValueError("Valley of Fear map claims more images than genuinely stored")
            rows.append({"bookId": "the-valley-of-fear", "title": "The Valley of Fear",
                         "sourceState": "14 complete original English chapters plus epilogue; 7 locally pinned edition-image positions; scene/rights/Arabic pending",
                         "chapterCount": 15, "novelChapterCountExcludingEpilogue": 14,
                         **valley_cover, **valley_art})
        else:
            rows.append({"bookId": "the-valley-of-fear", "title": "The Valley of Fear",
                         "sourceState": "full English original plus seven period illustrations staged; chapter scene mapping pending",
                         "chapterCount": None, "localCandidateChapters": 0,
                         "readyForUICards": 0, "missingImageChapters": None,
                         "missingReadyChapters": None, **valley_art})
    scarlet_originals = 0
    scarlet_manifest_path = STAGING / "study-in-scarlet-friston-1887-period-plates" / "manifest.json"
    if scarlet_manifest_path.is_file():
        scarlet_manifest = jload(scarlet_manifest_path)
        if (scarlet_manifest.get("category") != "Category:A Study in Scarlet illustrated by D. H. Friston"
                or scarlet_manifest.get("publicationApproved") is not False
                or scarlet_manifest.get("chapterSceneMatchingComplete") is not False):
            raise ValueError("1887 Sherlock Friston art archive source or rights changed unexpectedly")
        originals_seen, binaries_seen = set(), set()
        for art in scarlet_manifest["images"]:
            source_sha1, webp_hash = art["originalCommonsSHA1MetadataOnly"], art["webpSha256"]
            name = art.get("wikiFile", "")
            if (name not in {f"File:A Study in Scarlet Friston 0{n}.jpg" for n in range(1, 5)}
                    or art.get("sourceEdition") != scarlet_manifest.get("sourceEdition")
                    or art.get("editoriallyApproved") is not False
                    or art.get("rightsStatus") != "PENDING_INDIVIDUAL_TERRITORY_AND_SCENE_REVIEW"
                    or not art.get("originalCreator") or not art.get("commonsPage")
                    or not art.get("individualCommonsLicense")):
                raise ValueError("Unattributed, unlicensed, or incorrectly cleared Friston illustration")
            if source_sha1 in originals_seen or webp_hash in binaries_seen:
                raise ValueError("Duplicate Friston Sherlock illustration content")
            check_binary(str((scarlet_manifest_path.parent / art["localPath"]).relative_to(ROOT)), webp_hash)
            originals_seen.add(source_sha1)
            binaries_seen.add(webp_hash)
        scarlet_originals = len(scarlet_manifest["images"])
        if scarlet_originals > 4:
            raise ValueError("Nonoriginal Scarlet files counted as period artwork")
    townsend_originals = 0
    townsend_path = STAGING / "sign-four-townsend-1903-period-plates" / "manifest.json"
    if townsend_path.is_file():
        gallery = jload(townsend_path)
        expected_names = {f"File:Sign-t{n}.jpg" for n in range(1, 9)}
        expected_edition = (
            "The Sign of Four, G. Newnes Ltd. illustrated souvenir edition (1903); "
            "individual scan rights and edition context require review"
        )
        if (gallery.get("category") != "Category:The Sign of Four illustrated by F. H. Townsend"
                or gallery.get("sourceEdition") != expected_edition
                or gallery.get("originalCreator") != "Frederick Henry Townsend (1868–1920)"
                or gallery.get("originalEditionYear") != 1903
                or gallery.get("sourceWork") != "The Sign of Four — Arthur Conan Doyle (original publication 1890)"
                or gallery.get("publicationApproved") is not False
                or gallery.get("chapterSceneMatchingComplete") is not False
                or gallery.get("humanChapterSceneVerificationComplete") is not False):
            raise ValueError("Townsend original 1903 archive provenance or clearance gate changed")
        seen_titles, seen_originals, seen_webps = set(), set(), set()
        for plate in gallery.get("images", []):
            title = plate.get("wikiFile")
            original_sha = plate.get("originalCommonsSHA1MetadataOnly")
            webp_sha = plate.get("webpSha256")
            source_sha = plate.get("downloadedResourceSha256")
            if (title not in expected_names or title in seen_titles
                    or not isinstance(original_sha, str)
                    or not re.fullmatch("[0-9a-f]{40}", original_sha)
                    or original_sha in seen_originals or webp_sha in seen_webps
                    or not isinstance(source_sha, str)
                    or not re.fullmatch("[0-9a-f]{64}", source_sha)
                    or plate.get("originalCreator") != gallery["originalCreator"]
                    or plate.get("sourceEdition") != expected_edition
                    or not str(plate.get("commonsPage", "")).startswith(
                        "https://commons.wikimedia.org/wiki/File:Sign-t")
                    or "public domain" not in str(plate.get("individualCommonsLicense", "")).lower()
                    or plate.get("artworkClassificationStatus") != "1903_ORIGINAL_ENGRAVING__SCENE_UNREVIEWED"
                    or plate.get("sceneChapterMatchStatus") != "UNREVIEWED__NO_CHAPTER_CARD"
                    or plate.get("rightsStatus") != "PENDING_INDIVIDUAL_TERRITORY_AND_SCENE_REVIEW"
                    or plate.get("editoriallyApproved") is not False
                    or plate.get("publishedToApp") is not False
                    or plate.get("cropped") is not False
                    or plate.get("recolouring") is not False
                    or plate.get("altAr") is not None or plate.get("altEn") is not None):
                raise ValueError("Unlicensed/duplicated/already-approved original Sign of Four plate")
            check_binary(str((townsend_path.parent / plate["localPath"]).relative_to(ROOT)), webp_sha)
            seen_titles.add(title)
            seen_originals.add(original_sha)
            seen_webps.add(webp_sha)
        townsend_originals = len(seen_titles)
        if townsend_originals > 8:
            raise ValueError("Townsend 1903 plate archive contains extra non-original files")
    # Historical Sidney Paget artwork is SOURCE evidence only, never chapter approval.
    hound_paget_count = 0
    hound_gallery = STAGING / "hound-paget-original-1901-period-plates" / "manifest.json"
    if hound_gallery.is_file():
        hound_archive = jload(hound_gallery)
        if (hound_archive.get("category") !=
                "Category:The Hound of the Baskervilles illustrated by Sidney Paget"
                or hound_archive.get("chapterSceneMatchingComplete") is not False
                or hound_archive.get("publicationApproved") is not False):
            raise ValueError("Hound Paget historical period source is wrong or falsely approved")
        originals, binaries = set(), set()
        for plate in hound_archive["images"]:
            title = plate.get("wikiFile", "")
            original_sha1, webp_sha = plate["originalCommonsSHA1MetadataOnly"], plate["webpSha256"]
            if (not title.startswith("File:Houn-")
                    or plate.get("sceneChapterMatchStatus") != "UNREVIEWED__NO_CHAPTER_CARD"
                    or plate.get("editoriallyApproved") is not False
                    or plate.get("rightsStatus") != "PENDING_INDIVIDUAL_PAGET_1902_TERRITORY_AND_SCENE_REVIEW"
                    or not plate.get("originalCreator")
                    or not plate.get("commonsPage")
                    or not plate.get("individualCommonsLicense")):
                raise ValueError("Unsigned or foreign historical Sidney Paget artwork")
            if original_sha1 in originals or webp_sha in binaries:
                raise ValueError("Duplicate Sidney Paget Hound plate source or image bytes")
            check_binary(str((hound_gallery.parent / plate["localPath"]).relative_to(ROOT)), webp_sha)
            originals.add(original_sha1)
            binaries.add(webp_sha)
        hound_paget_count = len(hound_archive["images"])
    # The 1912 originals are real scene research assets, not already published images.
    lost_world_original_1912 = 0
    lost_world_gallery = STAGING / "lost-world-original-1912-period-plates" / "manifest.json"
    if lost_world_gallery.is_file():
        illustrated = jload(lost_world_gallery)
        if (illustrated.get("category") != "Category:The Lost World"
                or illustrated.get("historicalPrintYear") != 1912
                or illustrated.get("chapterSceneMatchingComplete") is not False
                or illustrated.get("publicationApproved") is not False):
            raise ValueError("Original 1912 Lost World period source or rights are invalid")
        print_pages = {55, 59, 142, 161, 187, 195, 222, 311}
        period_names = {
            *(f"File:Page {n} (The Lost World, 1912).jpg" for n in print_pages if n != 59),
            "File:Page 59 (The Lost World. 1912).jpg",
            "File:General view of plateau from top of gingho tree, page 225 (The Lost World, 1912).jpg",
            "File:The Celestial Lake, page 299 (The Lost World, 1912).jpg",
        }
        seen_lost_sources, seen_lost_webp = set(), set()
        for image in illustrated["images"]:
            original_id, local_hash = image["originalCommonsSHA1MetadataOnly"], image["webpSha256"]
            if (image.get("wikiFile") not in period_names
                    or image.get("sourceEdition") != illustrated.get("sourceEdition")
                    or image.get("artworkClassificationStatus") !=
                    "GENUINE_1912_PRINTED_ILLUSTRATION_CHAPTER_UNMATCHED"
                    or image.get("editoriallyApproved") is not False
                    or image.get("rightsStatus") != "PENDING_1912_ORIGINAL_PRINT_AND_TERRITORIAL_REVIEW"
                    or not image.get("commonsPage") or not image.get("individualCommonsLicense")
                    or image.get("originalPrintedYear") != 1912):
                raise ValueError("Unverified or incorrectly cleared 1912 original Doyle illustration")
            if original_id in seen_lost_sources or local_hash in seen_lost_webp:
                raise ValueError("Duplicate original Lost World 1912 source/image binary")
            check_binary(str((lost_world_gallery.parent / image["localPath"]).relative_to(ROOT)), local_hash)
            seen_lost_sources.add(original_id)
            seen_lost_webp.add(local_hash)
        lost_world_original_1912 = len(illustrated["images"])
        if lost_world_original_1912 > 10:
            raise ValueError("Mixed modern media or other sources falsely counted as original 1912 artwork")
    kalila_colours = (
        verify_kalila_miniatures()
        if (STAGING / "kalila-original-colour-miniatures-20261105" / "manifest.json").is_file()
        else 0
    )
    for slug, title in OLDER:
        archive = STAGING / slug
        if archive.is_dir():
            art_count = kalila_colours if slug == "kalila-arabic-wikisource" else (
                scarlet_originals if slug == "a-study-in-scarlet" else (
                    townsend_originals if slug == "the-sign-of-the-four" else (
                        hound_paget_count if slug == "the-hound-of-the-baskervilles" else (
                            lost_world_original_1912 if slug == "the-lost-world" else 0
                        )
                    )
                )
            )
            data = {"bookId": slug, "title": title,
                    "sourceState": "older staged work; chapter-card coverage audit pending",
                    "chapterCount": None, "localCandidateChapters": 0,
                    "readyForUICards": 0, "missingImageChapters": None,
                    "missingReadyChapters": None, "archivedLocalHistoricArt": art_count}
            if slug == "kalila-arabic-wikisource" and (archive / "arabic-source-section-index.json").is_file():
                from test_kalila_original_sections import verify_kalila_sections
                real_sections = verify_kalila_sections()
                data.update({
                    "sourceState": "19 byte-verified Arabic source sections (4 intro, 15 narrative); 3 actual c.1220 original-colour manuscript folios source-scene matched (geese/tortoise, crow/mouse, crow council); remaining 14 folios, full contextual English and all territorial/human release approval pending",
                    "sourceMatchedHistoricFolioCandidatesNotApproved": 3,
                    "sourceUnassignedOriginalColourFolioFiles": 14,
                    "originalColourArchiveVisualDuplicateCropGroups": 4,
                    "originalColourDistinctScenesUpperBoundFromVerifiedCrops": 13,
                    "historicBookCoverCandidateFilesNotApproved": 1,
                    "bookCoverReadyForPublication": False,
                    "originalArabicSourceSectionCountNotChapterCardCount": real_sections,
                    "sourcePrefatorySectionCount": 4,
                    "sourceNarrativeSectionCount": 15,
                    "sourceRedundantEmptyH2Headings": 1,
                    "sourceEditionIntegrity": "UPSTREAM_GIT_BLOB_SHA1_AND_EXACT_SECTION_BYTE_RANGES",
                    "chapterCount": None,
                    "localCandidateChapters": 0,
                    "readyForUICards": 0,
                    "missingImageChapters": None,
                    "missingReadyChapters": None
                })
            if slug == "a-study-in-scarlet":
                data["unassignedHistorical1887FristonImageFiles"] = scarlet_originals
                data["sourceState"] = "complete original English novel staged; original 1887 Friston plates archived but not visually matched to chapters"
            if slug == "the-sign-of-the-four":
                data["unassignedHistorical1903TownsendImageFiles"] = townsend_originals
                data["sourceState"] = (
                    "complete authentic 12-chapter English original staged; "
                    + str(townsend_originals)
                    + " genuine 1903 Townsend engravings locally archived; "
                    "chapter-scene mapping and territory/editorial rights pending"
                )
            if slug == "the-hound-of-the-baskervilles":
                data["unassignedHistoricalSidneyPagetFiles"] = hound_paget_count
                if hound_paget_count:
                    data["sourceState"] = (
                        "full English original staged; genuine original Sidney Paget 1901-02 "
                        "historical art archived; exact original chapter scenes/territorial rights pending"
                    )
            if slug == "the-lost-world":
                data["unassignedOriginal1912LostWorldImageFiles"] = lost_world_original_1912
            chaptered_doyle = {
                "a-study-in-scarlet": 14,
                "the-lost-world": 16,
                "the-hound-of-the-baskervilles": 15,
                "the-sign-of-the-four": 12,
            }
            if slug in chaptered_doyle:
                chapter_map = archive / "chapter-image-map.json"
                if chapter_map.is_file():
                    total = chaptered_doyle[slug]
                    source = jload(archive / "manifest.json")
                    mapped = jload(chapter_map)
                    if (mapped.get("bookId") != slug or mapped.get("chapterCount") != total or
                            mapped.get("countSemantics") != "AUTHENTIC_UNABRIDGED_ORIGINAL_ENGLISH_CHAPTERS" or
                            mapped.get("sourceEditionCommit") != source["source"]["upstreamCommit"] or
                            mapped.get("releaseApproved") is not False):
                        raise ValueError("Complete original Doyle chapter-map count/edition/rights drift: " + slug)
                    coverage = map_coverage(chapter_map, total)
                    if (coverage["localCandidateChapters"] != mapped.get("localCandidateChapters") or
                            coverage["readyForUICards"] != mapped.get("readyForUICards") or
                            coverage["missingImageChapters"] != mapped.get("missingCandidateChapters")):
                        raise ValueError("Source chapter images counted without real original art: " + slug)
                    data.update(coverage)
                    data["chapterCount"] = total
                    data["sourceState"] = (
                        "full unabridged English original with " + str(total) +
                        " SHA-pinned chapter source references; individual real scene-matched chapter pictures and rights pending"
                    )
                    if slug == "the-lost-world" and lost_world_original_1912:
                        data["sourceState"] += (
                            "; " + str(lost_world_original_1912) +
                            " original illustrated 1912 plate files archived, scene and rights pending"
                        )
                    if slug == "a-study-in-scarlet" and scarlet_originals:
                        data["sourceState"] += "; " + str(scarlet_originals) + " original Friston artwork files archived"
                    if slug == "the-sign-of-the-four" and townsend_originals:
                        data["sourceState"] += "; " + str(townsend_originals) + " verified original 1903 Townsend plates in quarantine"
            if slug in {"dracula", "frankenstein"}:
                index = archive / "chapter-image-map.json"
                if index.is_file():
                    audit = staged_original_chapter_coverage(archive)
                    data.update(audit)
                    data["chapterCount"] = jload(index)["chapterCount"]
                    data["sourceState"] = (
                        "full byte-verified original English narrative and framing units; all "
                        "specific historic chapter art, complete contextual Arabic, individual "
                        "image rights, and human editorial clearance remain unavailable"
                    )
            rows.append(data)
    # Full English source editions are already staged, but do NOT have mapped
    # individual Nights / story scenes or approved contextual bilingual parallels.
    woman = STAGING / "user-requested-classics-20261105" / "the-woman-in-white"
    if woman.is_dir():
        staged = verify_unpublished_gutenberg_edition("the-woman-in-white")
        original_illustrations = verify_woman_white_authentic_period_art()
        staged.update(original_illustrations)
        mclenan_verified=verify_mclenan_1860_original_illustrations()
        staged.update({k:v for k,v in mclenan_verified.items() if k!="archivedLocalHistoricArt"})
        staged["archivedLocalHistoricArt"]+=mclenan_verified["archivedLocalHistoricArt"]
        # The original is NOT a 62-chapter conventionally numbered novel.
        # The 62 actually present narratorial narrative units are separately
        # byte-SHA-indexed from unmodified 1.6MB Gutenberg original.
        from map_woman_white_original_narratives import generate as woman_narrative_index
        index_path = woman / "chapter-image-map.json"
        if index_path.is_file():
            source_narratives = woman_narrative_index()
            if jload(index_path) != source_narratives:
                raise ValueError("Woman in White original 3-epoch section map differs from actual pinned book")
            sections = map_coverage(index_path, 62)
            if (source_narratives.get("localCandidateChapters") != sections["localCandidateChapters"]
                    or source_narratives.get("missingCandidateChapters") != sections["missingImageChapters"]
                    or source_narratives.get("readyForUICards") != sections["readyForUICards"]
                    or source_narratives.get("releaseApproved") is not False):
                raise ValueError("Woman in White original narrative artwork or release counts misreported")
            staged.update(sections)
            staged["chapterCount"] = 62
            staged["chapterCountUnitLabel"] = source_narratives["chapterCountUnitLabel"]
            staged["originalNarrativeUnitsIncludingNonChapterSections"] = 62
            staged["sourceSectionClassification"] = source_narratives["countSemantics"]
        staged["sourceState"] = (
            "complete English 1860 novel source SHA-pinned; "
            + str(original_illustrations["unassigned1903MacklinIllustrations"])
            + " genuine 1903 Macklin lithographs and "
            + str(original_illustrations["unassigned1861GilbertFrontispieces"])
            + " real 1861 frontispiece(s), plus "
            + str(original_illustrations["historical1860PublisherBookCovers"])
            + " genuine 1860 book cover(s) locally archived; "
            "eight printed-caption-matched original-unit pictures remain UNAPPROVED; " 
            + str(mclenan_verified["originalHarper1860McLenanConfirmedArtworkFiles"])
            + " newly archived real 1860 McLenan original book wood engravings not yet mapped; 54 further art gaps; no full edited Arabic, territorial rights or editorial approval"
        )
        rows.append({"bookId": "the-woman-in-white", "title": "The Woman in White", **staged})
    for volume in range(1, 11):
        slug = f"arabian-nights-burton-v{volume:02d}"
        folder = STAGING / "user-requested-classics-20261105" / slug
        if folder.is_dir():
            rows.append({"bookId": slug, "title": f"Arabian Nights — Burton Volume {volume:02d}/10",
                         "sourceSeriesVolume": volume,
                         **verify_unpublished_gutenberg_edition(slug, volume)})
    if (STAGING / "arabian-nights-arabic-wikisource-20261105").is_dir():
        rows.append({"bookId": "alf-layla-wa-layla-arabic-fourparts",
                     "title": "ألف ليلة وليلة — four Arabic Wikisource transcription parts",
                     **verify_arabian_wikisource_arabic_segments()})
    arabian_originals = verify_arabian_unassigned_original_period_art()
    available = sum(r["localCandidateChapters"] for r in rows)
    ready = sum(r["readyForUICards"] for r in rows)
    return {
        "schemaVersion": 1,
        "contract": "docs/literature/CHAPTER_IMAGE_CONTRACT.md",
        "scope": "checked-in main only; recovered PR16 historical source is counted only after merged",
        "policy": "at least one distinct locally stored, sourced, chapter-matched and rights-cleared primary image per chapter",
        "counts": {"localCandidateChapterCards": available, "readyChapterCards": ready,
                   "verifiedArchivedHistoricArtFilesAmongTrackedEightBooks":
                       sum(r.get("archivedLocalHistoricArt", 0) for r in rows),
                   "verifiedHistoricalArtBinaryFilesAcrossAuditedSources":
                       sum(r.get("archivedLocalHistoricArt", 0) for r in rows) + arabian_originals["total"],
                   "unassignedOriginalArabianNightsArtworkFiles": arabian_originals["total"]},
        "unassignedOriginalArabianNightsSourceEditionCounts": arabian_originals,
        "books": rows,
        "nextWork": [
            "Scene-match new Commons original Verne engravings to the actual text for remaining chapter gaps; verify every file's artist, edition and territorial rights before promotion",
            "Review the five backfilled historic chapter maps and 117 Monte Cristo chapter slots; get original contextual plates for remaining holes and editorial/territorial clearance",
            "Scene-verify and assign real 1906 Correa historical engravings to 27 War of the Worlds chapters (all currently unassigned), then source original extras for uncovered chapters",
            "Backfill Valley of Fear, Kalila, Arabian Nights and remaining previous works with verified edition-specific chapter images",
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
          str(report["counts"]["verifiedHistoricalArtBinaryFilesAcrossAuditedSources"]) + "**; "
          "NOT necessarily chapter-aligned.",
        "- Authentic unassigned Arabian Nights original art files (Dulac 1907 and Groß 1838–39): **" +
          str(report["counts"]["unassignedOriginalArabianNightsArtworkFiles"]) + "**; "
          "original-edition pictures are NOT approved for Burton/Arabic reader pages.",
        "",
        "## Book-by-book audit",
        "",
        "| Book | Actual chapters | Local primary image candidates | Approved chapter cards | Missing candidates | Source / blocker |",
        "| --- | ---: | ---: | ---: | ---: | --- |",
    ]
    for r in report["books"]:
        total = r.get("chapterCountUnitLabel") or (str(r["chapterCount"]) if r["chapterCount"] is not None else "Needs segmentation")
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
        "- New original Commons period images in quarantine, NOT chapter-mapped: **" +
          str(report["books"][0].get("unassignedHistoricalCommonsImageFiles", 0)) + "**.",
        "- Original 1906 Correa War of the Worlds files in quarantine, NOT chapter-mapped: **" +
          str(report["books"][2].get("unassignedHistoricalCorreaImageFiles", 0)) + "**.",
        "- Original F. H. Townsend 1903 *The Sign of Four* chapter-scene-unreviewed engravings: **" +
          str(next((b.get("unassignedHistorical1903TownsendImageFiles", 0) for b in report["books"]
                    if b["bookId"] == "the-sign-of-the-four"), 0)) +
          "** local originals, NOT chapter cards.",
        "- The Woman in White original historic art (1903 Macklin + 1861 Gilbert): **" +
          str(next((b["archivedLocalHistoricArt"] for b in report["books"]
                    if b["bookId"] == "the-woman-in-white"), 0)) +
          "** individually SHA-verified scans; actual original 1860 book covers: **" +
          str(next((b.get("historical1860PublisherBookCovers", 0) for b in report["books"]
                    if b["bookId"] == "the-woman-in-white"), 0)) +
          "**; all chapter-image placement and territorial release rights pending.",
        "- Authentic 1860 Harper McLenan original book engravings separately visually identified: **" +
          str(next((b.get("originalHarper1860McLenanConfirmedArtworkFiles",0) for b in report["books"]
                    if b["bookId"]=="the-woman-in-white"),0)) +
          "** real and SHA-verified in source archives; all pending chapter scene/territory/editorial review, machine-only scans excluded.",
        "- GitHub handoff: docs/handoffs/LINGUA_TALES_HANDOFF_CURRENT.md.",
        "- Story content automation is separate from the scheduled GitHub report; inspect latest Actions SHA and output before claiming any new image.",
        "- This inventory does NOT assert that a chapter card exists for any staged book lacking a verified chapter-to-image map, even if its archive contains hundreds of figures.",
        "", "## Remaining counts",
        "",
        "- Verne: **" + str(report["books"][0]["missingImageChapters"]) + " chapters without image candidates, " + str(report["books"][0]["missingReadyChapters"]) + " without approved thumbnails**; historical art requires territory/scene approvals.",
        "- War of the Worlds: **27 chapters without candidates**.",
        "- Five archived illustrated novels now have edition-derived chapter counts and source-positioned local plate candidates; verify scene fidelity and per-image rights before use.", 
        "- Monte Cristo: **" + str(next((r["missingImageChapters"] for r in report["books"] if r["bookId"] == "the-count-of-monte-cristo"), "not indexed")) + " chapter candidates missing**; the historical English translation's original French edition and rights still need verification.",
        "- Moonstone/older works: exact chapter segmentation, contextual art acquisition, rights and editorial review still open.",
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
