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
         "unassignedHistoricalCommonsImageFiles": commons_candidates, **verne},
        moonstone_row,
        {"bookId": "wells-war-of-the-worlds-1898", "title": "The War of the Worlds",
         "sourceState": "27 original chapters staged; bilingual/rights pending",
         "chapterCount": 27, "localCandidateChapters": 0, "readyForUICards": 0,
         "missingImageChapters": 27, "missingReadyChapters": 27,
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
                    hound_paget_count if slug == "the-hound-of-the-baskervilles" else 0
                )
            )
            data = {"bookId": slug, "title": title,
                    "sourceState": "older staged work; chapter-card coverage audit pending",
                    "chapterCount": None, "localCandidateChapters": 0,
                    "readyForUICards": 0, "missingImageChapters": None,
                    "missingReadyChapters": None, "archivedLocalHistoricArt": art_count}
            if slug == "a-study-in-scarlet":
                data["unassignedHistorical1887FristonImageFiles"] = scarlet_originals
                data["sourceState"] = "complete original English novel staged; original 1887 Friston plates archived but not visually matched to chapters"
            if slug == "the-hound-of-the-baskervilles":
                data["unassignedHistoricalSidneyPagetFiles"] = hound_paget_count
                if hound_paget_count:
                    data["sourceState"] = (
                        "complete English original; genuine Sidney Paget 1901–02 plates "
                        "preserved but chapter scene/rights clearance pending"
                    )
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
                    if slug == "a-study-in-scarlet" and scarlet_originals:
                        data["sourceState"] += "; " + str(scarlet_originals) + " original Friston artwork files archived"
            rows.append(data)
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
