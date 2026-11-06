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



def moonstone_source_unit_coverage() -> dict:
    """Audit the exact 53 Moonstone source narrative units, NOT 53 invented chapters."""
    folder = STAGING / "the-moonstone"
    manifest = jload(folder / "manifest.json")
    index = jload(folder / "narrative-unit-index.json")
    sources = manifest["sourceParts"]
    narratives = [x for x in sources if x["kind"] == "narrative"]
    structural = [x for x in sources if x["kind"] == "structural-heading"]
    if (manifest.get("completeOriginalSource") is not True or
        len(narratives) != manifest.get("narrativeParts") or
        len(structural) != manifest.get("structuralParts") or
        index.get("bookId") != manifest.get("id") or
        index.get("normativeChapterCount") is not None or
        index.get("releaseApproved") is not False or
        index.get("sourceManifestPath") != str((folder / "manifest.json").relative_to(ROOT)) or
        index.get("narrativeSourceUnitCount") != len(narratives) or
        index.get("sourceStructuralHeadingCount") != len(structural)):
        raise ValueError("Moonstone narrative-unit totals or release safeguards corrupted")
    if (len(index.get("narrativeUnits", [])) != len(narratives) or
        len(index.get("structuralHeadingUnits", [])) != len(structural)):
        raise ValueError("Moonstone skipped a narrative passage or source heading")
    by_kind = (("narrativeUnits", narratives), ("structuralHeadingUnits", structural))
    for key, source_units in by_kind:
        for i, (mapped, source) in enumerate(zip(index[key], source_units), 1):
            name = source["file"]
            if "/" in name or "\\" in name or name.startswith(".") or not name.endswith(".xhtml"):
                raise ValueError("Unsafe Moonstone original unit path")
            raw = (folder / name).read_bytes()
            actual_sha = hashlib.sha1(b"blob " + str(len(raw)).encode("ascii") + b"\x00" + raw).hexdigest()
            if (len(raw) != source.get("bytes") or actual_sha != source.get("upstreamGitBlobSha") or
                mapped.get("sourceFilePath") != str((folder / name).relative_to(ROOT)) or
                mapped.get("sourceGitBlobSha") != actual_sha or
                mapped.get("sourceByteCount") != len(raw)):
                raise ValueError("Moonstone original source text or order mismatch: " + name)
            if key == "narrativeUnits" and (mapped.get("narrativeUnitOneBased") != i or
                                             mapped.get("primaryImage") is not None):
                raise ValueError("Moonstone source unit falsely remapped as an approved image/chapter")
    return {"narrativeSourceUnitsNotChapterCount": len(narratives),
            "originalStructuralHeadingUnits": len(structural),
            "narrativeUnitsWithoutMappedArt": len(narratives),
            "sourceUnitIndex": str((folder / "narrative-unit-index.json").relative_to(ROOT)),
            "sourceHashAudit": "UPSTREAM_GIT_BLOB_SHA1_AND_EXACT_BYTES"}



def valley_of_fear_original_chapter_coverage(archive: Path) -> dict:
    """Validate genuine Part I/II 7+7 chapter headings and separate epilogue."""
    import re

    manifest = jload(archive / "manifest.json")
    mapped_path = archive / "chapter-image-map.json"
    mapped = jload(mapped_path)
    source_bytes = (archive / "original-edition.html").read_bytes()
    if sha256(source_bytes) != manifest["source"]["sha256"] or len(source_bytes) != manifest["source"]["bytes"]:
        raise ValueError("Valley of Fear exact Gutenberg original changed")
    local_html = (archive / "offline-edition.html").read_bytes().decode("utf-8")
    headings = []
    epilogues = []
    for match in re.finditer(r"<h([1-6])\b[^>]*>[\s\S]*?</h\1>", local_html, re.IGNORECASE):
        markup = match.group(0)
        value = " ".join(re.sub(r"<[^>]+>", " ", markup).split())
        if re.fullmatch(r"Chapter (?:I|II|III|IV|V|VI|VII) .+", value):
            headings.append((markup, value))
        elif value == "Epilogue" and 'id="chap15"' in markup:
            epilogues.append(markup)
    if (len(headings) != 14 or len(epilogues) != 1 or
        mapped.get("chapterCount") != 14 or mapped.get("bookId") != "the-valley-of-fear" or
        mapped.get("releaseApproved") is not False or
        mapped.get("sourceExactGutenbergSHA256") != manifest["source"]["sha256"] or
        mapped.get("sourceFullTextFilePath") != str((archive / "original-edition.html").relative_to(ROOT)) or
        mapped.get("sourceOfflineReadingFilePath") != str((archive / "offline-edition.html").relative_to(ROOT))):
        raise ValueError("Valley of Fear original chapter/epilogue index mismatch")
    source_units = mapped["chapters"]
    for i, (row, (markup, heading)) in enumerate(zip(source_units, headings), 1):
        expected_id = f"chap{i:02d}"
        if (row.get("chapterOneBased") != i or row.get("sourcePartOneBased") != (1 if i <= 7 else 2) or
            row.get("chapterWithinPartOneBased") != ((i - 1) % 7) + 1 or
            row.get("sourceAnchorId") != expected_id or
            row.get("originalHeadingHTML") != markup or
            row.get("originalHeadingText") != heading or
            row.get("titleEn") != re.sub(r"^Chapter [IVXLCDM]+ ", "", heading) or
            f'id="{expected_id}"' not in markup):
            raise ValueError("Valley of Fear chapter source anchor differs from original: " + str(i))
    last = mapped.get("nonChapterNarrativeUnits", [])
    if len(last) != 1 or last[0].get("originalHeadingHTML") != epilogues[0] or last[0].get("sourceAnchorId") != "chap15":
        raise ValueError("Valley of Fear epilogue was omitted")
    return {**map_coverage(mapped_path, 14), "nonChapterNarrativeSourceUnits": 1,
            "sourceHashAudit": "GUTENBERG_SHA256_AND_EXACT_DOM_CHAPTER_ANCHORS"}



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
    for row in jload(MAP)["chapters"]:
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
    moonstone_source = moonstone_source_unit_coverage()
    rows = [
        {"bookId": "around-the-world-in-eighty-days-towle",
         "title": "Around the World in Eighty Days", "sourceState": "37 source chapters plus Arabic draft",
         "chapterCount": 37, "archivedLocalHistoricArt": len(manifest) + len(additional) + commons_candidates,
         "unassignedHistoricalCommonsImageFiles": commons_candidates, **verne},
        {"bookId": "collins-the-moonstone-1868", "title": "The Moonstone",
         "sourceState": "53 original XHTML narrative units SHA-pinned incl. prologue and epilogue; precise narrative hierarchy indexed, final chapter-card segmentation/rights pending",
         "chapterCount": None, **moonstone_source,
         "unassignedHistorical1874FacsimileScans": moonstone_facsimile_scans,
         "localCandidateChapters": 0, "readyForUICards": 0,
         "missingImageChapters": None, "missingReadyChapters": None,
         "archivedLocalHistoricArt": 0},
        {"bookId": "wells-war-of-the-worlds-1898", "title": "The War of the Worlds",
         "sourceState": "17+10 original English source chapters and true XHTML headings SHA-pinned; Correa plates remain scene/rights unassigned",
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
            indexed = valley_of_fear_original_chapter_coverage(valley_folder)
            rows.append({"bookId": "the-valley-of-fear", "title": "The Valley of Fear",
                         "sourceState": "14 original Gutenberg chapter headings (two seven-chapter parts) and epilogue source-pinned; seven historical images unassigned and rights pending",
                         "chapterCount": 14, **indexed, **valley_art})
        else:
            rows.append({"bookId": "the-valley-of-fear", "title": "The Valley of Fear",
                         "sourceState": "full English original plus seven period illustrations staged; chapter scene mapping pending",
                         "chapterCount": None, "localCandidateChapters": 0,
                         "readyForUICards": 0, "missingImageChapters": None,
                         "missingReadyChapters": None, **valley_art})
    kalila_colours = (
        verify_kalila_miniatures()
        if (STAGING / "kalila-original-colour-miniatures-20261105" / "manifest.json").is_file()
        else 0
    )
    for slug, title in OLDER:
        archive = STAGING / slug
        if archive.is_dir():
            original_map = archive / "chapter-image-map.json"
            if original_map.is_file() and slug != "kalila-arabic-wikisource":
                coverage = staged_original_chapter_coverage(archive)
                rows.append({"bookId": slug, "title": title,
                             "sourceState": "complete original chapters and non-chapter narrative byte-verified; all chapter-scene images and complete contextual Arabic/territorial clearance pending",
                             "chapterCount": jload(original_map)["chapterCount"], **coverage,
                             "archivedLocalHistoricArt": 0})
            else:
                rows.append({"bookId": slug, "title": title,
                             "sourceState": "staged source; edition-specific narrative segmentation/art mapping pending",
                             "chapterCount": None, "localCandidateChapters": 0,
                             "readyForUICards": 0, "missingImageChapters": None,
                             "missingReadyChapters": None,
                             "archivedLocalHistoricArt": kalila_colours if slug == "kalila-arabic-wikisource" else 0})
    # All previously staged full Gutenberg editions must appear in this report.
    woman = STAGING / "user-requested-classics-20261105" / "the-woman-in-white"
    if woman.is_dir():
        rows.append({"bookId": "the-woman-in-white", "title": "The Woman in White",
                     **verify_unpublished_gutenberg_edition("the-woman-in-white")})
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
                       sum(r.get("archivedLocalHistoricArt", 0) for r in rows)},
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
        "- New original Commons period images in quarantine, NOT chapter-mapped: **" +
          str(report["books"][0].get("unassignedHistoricalCommonsImageFiles", 0)) + "**.",
        "- Original 1906 Correa War of the Worlds files in quarantine, NOT chapter-mapped: **" +
          str(report["books"][2].get("unassignedHistoricalCorreaImageFiles", 0)) + "**.",
        "- GitHub handoff: docs/handoffs/LINGUA_TALES_HANDOFF_CURRENT.md.",
        "- Story content automation is separate from the scheduled GitHub report; inspect latest Actions SHA and output before claiming any new image.",
        "- This inventory does NOT assert that a chapter card exists for any staged book lacking a verified chapter-to-image map, even if its archive contains hundreds of figures.",
        "", "## Remaining counts",
        "",
        "- Verne: **" + str(report["books"][0]["missingImageChapters"]) + " chapters without image candidates, " + str(report["books"][0]["missingReadyChapters"]) + " without approved thumbnails**; historical art requires territory/scene approvals.",
        "- War of the Worlds: **27 chapters without candidates**.",
        "- Five archived illustrated novels now have edition-derived chapter counts and source-positioned local plate candidates; verify scene fidelity and per-image rights before use.", 
        "- Monte Cristo: **" + str(next((r["missingImageChapters"] for r in report["books"] if r["bookId"] == "the-count-of-monte-cristo"), "not indexed")) + " chapter candidates missing**; the historical English translation's original French edition and rights still need verification.",
        "- Six complete Standard Ebooks originals are now source- and SHA-pinned chapter-indexed (108 chapters); primary images, contextual Arabic, art/territory rights and editorial approval remain missing.",
        "- Moonstone, Kalila, Woman in White and Arabian Nights still require edition-specific chapter/night boundaries, contextual bilingual correspondence and art/territory clearance.",
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
