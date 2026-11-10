#!/usr/bin/env python3
"""Period original French 1873 Verne scene vs exact independent Towle prose.

Verify actual archived WebPs and every corresponding English source paragraph;
Commons illustrated French captions corroborate the scene, NOT a release right.
"""
from __future__ import annotations
import copy
import hashlib
import json
from pathlib import Path
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]
STAGING = ROOT / "docs/literature/staging"
MAP = STAGING / "verne-chapter-cards/chapter-image-map.json"
ARCHIVE = STAGING / "verne-commons-period-plates"
EVIDENCE = {
    4: ("07", "Une pauvre mendiante",
        "a poor beggar-woman, with a child in her arms, her naked feet smeared with mud",
        "037937644d26dbddbeb3abafcaee4962517c9412"),
    8: ("11", "« Ma montre ! une montre de famille ! »",
        "My watch? A family watch, monsieur, which has come down from my great-grandfather!",
        "1e6cdf08de07fbe9d307048877f2c5ad1b5b3baf"),
    9: ("12", "Il faisait escale à Steamer-Point",
        "the next day they put in at Steamer Point, northwest of Aden harbour, to take in coal",
        "75a612d410e6161612f9db6bce74668a4aaad836"),
    10: ("15", "Il renversa deux de ses adversaires",
         "knocking down two of his long-gowned adversaries with his fists and a vigorous application of his toes",
         "eaebb6d7abdbc9598c8cb2ad31ed53fa402e187b"),
    12: ("19", "Cette infortunée ne paraissait faire aucune résistance",
         "the wretched creature did not seem to be making any resistance",
         "c8a288bbe74b23ba60e9f0adecbc52b50c306dad"),
}


def blob_sha(raw: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(raw)).encode("ascii") + b"\0" + raw).hexdigest()


def verne_sources():
    sources = {}
    for number, (_, _, _, sha) in EVIDENCE.items():
        src = ROOT / f"app/src/main/assets/classic-verne-towle-ch{number:02d}.js"
        raw = src.read_bytes()
        if blob_sha(raw) != sha:
            raise ValueError("Original bilingual draft container unexpectedly altered")
        run = subprocess.run(
            ["node", "tools/export_verne_chapter.cjs", str(number)],
            cwd=ROOT, check=True, capture_output=True, text=True, timeout=25)
        doc = json.loads(run.stdout)
        if (doc["chapterOneBased"] != number or doc["workId"] !=
                "around-the-world-in-eighty-days-towle" or
                len(doc["paragraphs"]) < 8 or not all(isinstance(p["en"], str)
                and isinstance(p["existingArabicDraft"], str) for p in doc["paragraphs"])):
            raise ValueError("Complete source extraction is not genuine")
        sources[number] = (doc, sha)
    return sources


def verify(data, archive, sources):
    if (data.get("schemaVersion") != 1
            or data.get("bookId") != "around-the-world-in-eighty-days-towle"
            or data.get("chapterCount") != 37
            or data.get("releaseApproved") is not False
            or data.get("chapterReadiness") !=
            "17_LOCAL_ORIGINAL_PERIOD_SCENE_CANDIDATES__20_CHAPTERS_NO_PRIMARY_IMAGE__0_EDITORIAL_TERRITORIAL_APPROVALS"
            or [c.get("chapterOneBased") for c in data["chapters"]] != list(range(1, 38))):
        raise ValueError("Verne primary count, original order, editorial rights or release hold changed")
    pictures = [c["primaryImage"] for c in data["chapters"] if c["primaryImage"]]
    if (len(pictures) != 17 or len({p["sha256"] for p in pictures}) != 17
            or len({p["imagePath"] for p in pictures}) != 17
            or any(p.get("editoriallyApproved") is not False for p in pictures)
            or "docs/literature/staging/verne-commons-period-plates/manifest.json"
            not in data["artProvenanceManifests"]):
        raise ValueError("Duplicated historic art, missing source provenance or false release")
    for number, (suffix, french_caption, quote, original_blob) in EVIDENCE.items():
        row = data["chapters"][number-1]
        item = next(x for x in archive["images"] if
                    x["wikiFile"].endswith(f"Neuville and Benett {suffix}.jpg"))
        photo = row["primaryImage"]
        source, sha = sources[number]
        canonical_path = "docs/literature/staging/verne-commons-period-plates/" + item["localPath"]
        raw = (ROOT / canonical_path).read_bytes()
        english = [p["en"] for p in source["paragraphs"]]
        if (not isinstance(photo, dict)
                or row.get("titleEn") != source["chapterTitle"]
                or photo.get("imagePath") != canonical_path
                or photo.get("sha256") != item["webpSha256"]
                or photo.get("webpBytes") != item["webpBytes"]
                or photo.get("sourceURL") != item["commonsPage"]
                or photo.get("sourceUrl") != item["commonsPage"]
                or photo.get("originalScanMetadataSha1") != item["originalCommonsSHA1MetadataOnly"]
                or photo.get("originalFrenchCaption") != french_caption
                or photo.get("originalFrenchEditionChapterURL") !=
                f"https://fr.wikisource.org/wiki/Le_Tour_du_monde_en_quatre-vingts_jours/Chapitre_{number}"
                or photo.get("originalEnglishSourceGitBlobSha") != sha
                or photo.get("originalEnglishSourceFile") !=
                f"app/src/main/assets/classic-verne-towle-ch{number:02d}.js"
                or photo.get("originalEnglishChapterOneBased") != number
                or photo.get("sourcePassage") != quote or photo.get("sceneAnchor") != quote
                or not any(quote in paragraph for paragraph in english)
                or len(raw) != item["webpBytes"]
                or raw[:4] != b"RIFF" or raw[8:12] != b"WEBP"
                or hashlib.sha256(raw).hexdigest() != item["webpSha256"]
                or item["individualCommonsLicense"] != "Public domain"
                or photo.get("rightsStatus") !=
                "PENDING_INDIVIDUAL_SCAN_TERRITORIAL_AND_EDITORIAL_REVIEW"
                or photo.get("publicationStatus") != "STAGING_ONLY_NOT_PUBLISHED"
                or photo.get("editoriallyApproved") is not False
                or photo.get("humanEditorApproved") is not False
                or photo.get("territorialRightsCleared") is not False
                or photo.get("nonAIArt") is not True
                or photo.get("imageOriginalColourUnchanged") is not True
                or not photo.get("editionDifferenceNotice")
                or not photo.get("altAr") or not photo.get("altEn")
                or not any("\u0600" <= c <= "\u06ff" for c in photo["altAr"])):
            raise ValueError(f"Original image, quoted story scene or rights validation failed: Ch {number}")
    return len(pictures)


class OriginalFrenchIllustrationsVsFullEnglishTowle(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads(MAP.read_text("utf-8"))
        cls.art = json.loads((ARCHIVE / "manifest.json").read_text("utf-8"))
        cls.sources = verne_sources()

    def test_actual_five_distinct_original_scenes_and_pending_rights(self):
        self.assertEqual(verify(self.data, self.art, self.sources), 17)

    def test_original_chapter_image_rejections_are_strict(self):
        changes = {
            "swap-original-art": lambda d: d["chapters"][3]["primaryImage"].__setitem__(
                "sha256", d["chapters"][7]["primaryImage"]["sha256"]),
            "fabricate-quote": lambda d: d["chapters"][7]["primaryImage"].__setitem__(
                "sourcePassage", "No original Victorian narration describes the invented scene."),
            "falsify-source-blob": lambda d: d["chapters"][8]["primaryImage"].__setitem__(
                "originalEnglishSourceGitBlobSha", "0"*40),
            "mark-cleared": lambda d: d["chapters"][3]["primaryImage"].__setitem__(
                "territorialRightsCleared", True),
            "false-published": lambda d: d["chapters"][7]["primaryImage"].__setitem__(
                "publicationStatus", "PUBLISHED"),
            "duplication": lambda d: d["chapters"][6].__setitem__(
                "primaryImage", copy.deepcopy(d["chapters"][8]["primaryImage"])),
            "incorrect-french-caption": lambda d: d["chapters"][8]["primaryImage"].__setitem__(
                "originalFrenchCaption", "Unrelated scene"),
            "wrong-chapter": lambda d: d["chapters"][3].__setitem__("chapterOneBased", 5),
            "fake-editorial-approval": lambda d: d["chapters"][7]["primaryImage"].__setitem__(
                "editoriallyApproved", True),
            "fake-archive-path": lambda d: d["chapters"][8]["primaryImage"].__setitem__(
                "imagePath", "docs/literature/staging/not-real.jpg"),
            "wrong-english-identity": lambda d: d["chapters"][3]["primaryImage"].__setitem__(
                "originalEnglishChapterOneBased", 8),
            "wrong-count": lambda d: d.__setitem__("chapterReadiness", "ALL_APPROVED"),
        }
        for name, mutate in changes.items():
            with self.subTest(case=name):
                altered = copy.deepcopy(self.data)
                mutate(altered)
                with self.assertRaises(ValueError):
                    verify(altered, self.art, self.sources)


if __name__ == "__main__":
    unittest.main()
