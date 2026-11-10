#!/usr/bin/env python3
"""Conservative page-to-chapter CO-PLACEMENT, not invented scene or licensing.

Nine genuine archived printed 1912 novel images were independently located via
the original English Wikisource chapter transclusions. They belong at research
level to five original Doyle novel chapters. Four other paintings in the SAME
source chapter are kept as additional illustrations, not reused as primaries.

Source-accurate original XHTML chapter text SHA remains pinned by the separate
four-Doyle generator. Never touch original English story paragraphs, Android
reader UI, artwork hue, rights approvals or app thumbnail packaging.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / "docs/literature/staging/lost-world-original-1912-period-plates"
EVIDENCE = ROOT / "docs/literature/staging/the-lost-world/original-1912-wikisource-image-evidence.json"
EXPECTED_CHAPTERS = {4, 9, 10, 11, 15}
EXPECTED_PRINTED_PAGES = {55, 59, 142, 161, 187, 195, 222, 225, 299}
ALLOWED_LICENSE_PENDING = "PENDING_1912_ORIGINAL_PRINT_AND_TERRITORIAL_REVIEW"
STATUS = "WIKISOURCE_SOURCE_CHAPTER_POSITION_VERIFIED__IMAGE_SCENE_AND_TERRITORIAL_RIGHTS_PENDING"


def roman(number: int) -> str:
    out = []
    for n, glyph in ((10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I")):
        q, number = divmod(number, n)
        out.append(glyph * q)
    return "".join(out)


def image_record(book_row: dict, art: dict, record: dict) -> dict:
    if not art.get("individualCommonsLicense") or art.get("rightsStatus") != ALLOWED_LICENSE_PENDING:
        raise ValueError("Original 1912 individual printed art license/territorial rights not staged")
    if (art.get("sourceEdition") is None
            or art.get("originalPrintedYear") != 1912
            or art.get("artworkClassificationStatus") !=
            "GENUINE_1912_PRINTED_ILLUSTRATION_CHAPTER_UNMATCHED"
            or art.get("editoriallyApproved") is not False
            or art.get("publishedToApp") is not False
            or not art.get("commonsPage", "").startswith("https://commons.wikimedia.org/wiki/File:")):
        raise ValueError("Foreign or already approved original 1912 source art")
    path = (ART / art["localPath"]).resolve()
    if not path.is_relative_to(ART.resolve()) or not path.is_file():
        raise ValueError("Missing or escaped original source binary: " + str(path))
    raw = path.read_bytes()
    digest = hashlib.sha256(raw).hexdigest()
    if (digest != art["webpSha256"]
            or len(raw) != art["webpBytes"]
            or raw[:4] != b"RIFF" or raw[8:12] != b"WEBP"):
        raise ValueError("Altered local original 1912 source file or incorrect checksum")
    n = record["chapterOneBased"]
    if (book_row["chapterOneBased"] != n
            or book_row["sourceGitBlobSha"] is None
            or record.get("depictedSceneVerifiedByHuman") is not False
            or record.get("rightsApprovedForReader") is not False
            or record.get("editoriallyApproved") is not False):
        raise ValueError("Cross-chapter original source text or human/territorial status mismatch")
    return {
        "imagePath": path.relative_to(ROOT).as_posix(),
        "sha256": digest,
        "originalSourceSha256": art["downloadedResourceSha256"],
        "sourceUrl": art["commonsPage"],
        "sourceWikisourceChapterProofUrl": record["wikisourceProofUrl"],
        "sourceBookEditionURL": "https://archive.org/details/lostworldbeingac00doylrich",
        "sourceEdition": art["sourceEdition"],
        "sourcePrintPageOneBased": record["original1912PrintPageOneBased"],
        "sourceOriginalImageCommonsSHA1": art["originalCommonsSHA1MetadataOnly"],
        "sourceActualChapterOneBased": n,
        "sourceChapterEnglishGitBlobSha": book_row["sourceGitBlobSha"],
        "sceneAnchor": (
            "The ORIGINAL 1912 book image from printed page " +
            str(record["original1912PrintPageOneBased"]) +
            " is used on the separately transcribed English Wikisource source "
            "chapter " + roman(n) + ". Actual pictured action and exact "
            "original paragraph remain unconfirmed."
        ),
        "sceneVerificationStatus": STATUS,
        "credit": "Historical 1912 illustrated novel image; individual print artist attribution requires review",
        "license": art["individualCommonsLicense"],
        "rightsStatus": ALLOWED_LICENSE_PENDING,
        "altEn": "Original 1912 illustrated novel image associated with Chapter " +
                 roman(n) + "; exact depicted event needs editorial verification",
        "altAr": "رسم تاريخي من طبعة 1912 مرتبط بالفصل " +
                 str(n) + "؛ تفاصيل المشهد بانتظار المراجعة",
        "editoriallyApproved": False,
        "publishedToApp": False,
    }


def apply(indexed: list[dict]) -> tuple[list[dict], dict]:
    """Enhance the actual complete English source index with exact source-backed art."""
    if len(indexed) != 16 or [x["chapterOneBased"] for x in indexed] != list(range(1, 17)):
        raise ValueError("Original complete sixteen Doyle chapters changed")
    doc = json.loads(EVIDENCE.read_text("utf-8"))
    if (doc.get("schemaVersion") != 1 or doc.get("bookId") != "the-lost-world"
            or doc.get("sourceBookId") != "doyle-the-lost-world-1912"
            or doc.get("sourceArtCount") != 9 or doc.get("primaryChapterCandidates") != 5
            or doc.get("distinctChaptersWithEvidence") != 5
            or doc.get("additionalSameChapterPictureCandidates") != 4
            or doc.get("publicationApproved") is not False
            or len(doc.get("images", [])) != 9):
        raise ValueError("Original co-placement evidence doesn't cover exactly 9 genuine images")
    manifest = json.loads((ART / "manifest.json").read_text("utf-8"))
    if (manifest.get("category") != "Category:The Lost World"
            or manifest.get("publicationApproved") is not False
            or manifest.get("chapterSceneMatchingComplete") is not False):
        raise ValueError("Historical original 1912 print source gallery changed/was approved")
    sources = {x["wikiFile"]: x for x in manifest["images"]}
    if len(sources) != 9:
        raise ValueError("Original source archive changed; retain any newly found images separately")
    seen_source, seen_hash, seen_print_page, mapped = set(), set(), set(), set()
    for evidence in doc["images"]:
        name, n, page = (evidence["wikiFile"], evidence["chapterOneBased"],
                         evidence["original1912PrintPageOneBased"])
        if (n not in EXPECTED_CHAPTERS or page not in EXPECTED_PRINTED_PAGES
                or evidence.get("originalChapterRoman") != roman(n)
                or evidence.get("proofKind") !=
                "COMMONS_FILE_USAGE_IN_ORIGINAL_ENGLISH_WIKISOURCE_CHAPTER"
                or evidence.get("sourceChapterCoPlacementVerified") is not True
                or evidence.get("wikisourceProofUrl") !=
                "https://en.wikisource.org/wiki/The_Lost_World/Chapter_" + roman(n)
                or page in seen_print_page or name in seen_source
                or name not in sources):
            raise ValueError("1912 source page/image versus real Wikisource English chapter proof changed")
        art = sources[name]
        if not re.search(r"page " + str(page) + r"\b", name, re.IGNORECASE):
            raise ValueError("Actual original printed page number does not match image source filename")
        source_row = indexed[n-1]
        item = image_record(source_row, art, evidence)
        if item["sha256"] in seen_hash:
            raise ValueError("Same original actual picture used twice in five narrative chapters")
        seen_source.add(name)
        seen_hash.add(item["sha256"])
        seen_print_page.add(page)
        if evidence["primaryChapterIllustrationCandidate"] is True:
            if source_row["primaryImage"] is not None:
                raise ValueError("Two primary source chapter thumbnails proposed for same novel chapter")
            source_row["primaryImage"] = item
            source_row["imageStatus"] = STATUS
            mapped.add(n)
        elif evidence["primaryChapterIllustrationCandidate"] is False:
            source_row.setdefault("additionalIllustrations", []).append(item)
        else:
            raise ValueError("Unknown original primary/additional source image status")
    if (mapped != EXPECTED_CHAPTERS or seen_source != set(sources)
            or len(seen_hash) != 9 or len(seen_print_page) != 9
            or sum(len(r.get("additionalIllustrations", [])) for r in indexed) != 4):
        raise ValueError("Unmatched original 1912 plate, fake scene or duplicate image")
    return indexed, {
        "original1912SourceVerifiedChapterCoPlacement": 5,
        "additionalOriginal1912ChapterPicturesHeldForReview": 4,
        "historical1912PictureEvidenceFile": EVIDENCE.relative_to(ROOT).as_posix(),
        "humanSceneAndTerritorialRelease": "PENDING__NOT_PUBLISHED",
    }
