#!/usr/bin/env python3
"""Audit eight observed real Townsend engravings without inventing story placement."""
from __future__ import annotations
import copy
import hashlib
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / "docs/literature/staging/sign-four-townsend-1903-period-plates"
ORIGINAL = ROOT / "docs/literature/staging/the-sign-of-the-four"


def verified_observations(data: dict | None = None) -> int:
    art = json.loads((ART / "manifest.json").read_text("utf-8"))
    book = json.loads((ORIGINAL / "chapter-image-map.json").read_text("utf-8"))
    if data is None:
        data = json.loads((ART / "eight-illustration-bilingual-visual-inventory.json").read_text("utf-8"))
    originals = art["images"]
    records = data.get("records", [])
    if (data.get("schemaVersion") != 1 or data.get("workId") != "the-sign-of-the-four"
            or data.get("imageCount") != 8 or len(records) != len(originals) != 8
            or data.get("sourceArchiveManifest") !=
            "docs/literature/staging/sign-four-townsend-1903-period-plates/manifest.json"
            or data.get("visualDescriptionsAreOnlyCandidateSearchInputs") is not True
            or data.get("releaseApproved") is not False
            or data.get("territorialRightsCleared") is not False
            or data.get("humanOriginalPictureCaptionChecked") is not False
            or data.get("humanChapterSceneVerificationComplete") is not False
            or data.get("mappedPrimaryChapterCards") != 0
            or book.get("chapterCount") != 12
            or book.get("localCandidateChapters") != 0
            or book.get("releaseApproved") is not False
            or any(c["primaryImage"] is not None for c in book["chapters"])):
        raise ValueError("Original art inventory cardinality, source or release hold corrupted")
    seen_hashes, seen_images, observed_texts = set(), set(), set()
    for i, (row, original) in enumerate(zip(records, originals), start=1):
        expected_path = "docs/literature/staging/sign-four-townsend-1903-period-plates/" + original["localPath"]
        try:
            img = (ROOT / expected_path).read_bytes()
        except (OSError, ValueError) as exc:
            raise ValueError("Missing actual authentic engraved image binary") from exc
        en, ar, uncertainty = (row.get(k) for k in ("observedEn", "observedAr", "uncertaintyEn"))
        if (row.get("ordinalOneBased") != i
                or row.get("sourceFile") != original["wikiFile"]
                or row.get("imagePath") != expected_path
                or row.get("sourceCommonsPage") != original["commonsPage"]
                or row.get("webpSha256") != original["webpSha256"]
                or row.get("webpBytes") != original["webpBytes"]
                or row.get("originalArtistMetadata") != original["originalCreator"]
                or len(img) != original["webpBytes"]
                or img[:4] != b"RIFF" or img[8:12] != b"WEBP"
                or hashlib.sha256(img).hexdigest() != original["webpSha256"]
                or not all(isinstance(x, str) and len(x.strip()) >= 35 for x in (en, ar, uncertainty))
                or not any("\u0600" <= char <= "\u06ff" for char in ar)
                or row.get("chapterMatch") is not None
                or row.get("characterIdentity") is not None
                or row.get("original1903PrintCaptionVerified") is not False
                or row.get("visualObservationStatus") != "VISIBLE_OBJECTS_ONLY__SOURCE_SCENE_UNCONFIRMED"
                or row.get("editoriallyApproved") is not False
                or row.get("publishedToApp") is not False
                or row.get("individualRightsStatus") !=
                "PENDING_INDIVIDUAL_TERRITORY_AND_SCENE_REVIEW"
                or original["editoriallyApproved"] is not False
                or original["publishedToApp"] is not False):
            raise ValueError("Engraving wrongly described, duplicated, unsourced or implicitly released")
        seen_hashes.add(row["webpSha256"])
        seen_images.add(row["sourceFile"])
        observed_texts.add(en)
    if len(seen_hashes) != 8 or len(seen_images) != 8 or len(observed_texts) != 8:
        raise ValueError("Historic engraving or unique visual description reused")
    return 8


class ActualTownsendBilingualInspection(unittest.TestCase):
    def test_all_eight_genuine_engravings_are_described_and_sha_pinned(self):
        self.assertEqual(verified_observations(), 8)

    def test_no_false_chapter_scene_or_copyright_upgrade(self):
        original = json.loads((ART / "eight-illustration-bilingual-visual-inventory.json").read_text("utf-8"))
        changes = {
            "false-book-release": lambda d: d.__setitem__("releaseApproved", True),
            "false-visual-signoff": lambda d: d.__setitem__("humanChapterSceneVerificationComplete", True),
            "fictitious-chapter": lambda d: d["records"][0].__setitem__("chapterMatch", 6),
            "fictitious-character": lambda d: d["records"][4].__setitem__("characterIdentity", "Sherlock Holmes"),
            "false-human-caption": lambda d: d["records"][1].__setitem__("original1903PrintCaptionVerified", True),
            "wrong-sha": lambda d: d["records"][2].__setitem__("webpSha256", "0" * 64),
            "wrong-local-path": lambda d: d["records"][3].__setitem__("imagePath", "/tmp/no-such-plate.webp"),
            "empty-arabic-description": lambda d: d["records"][5].__setitem__("observedAr", ""),
            "fake-per-image-release": lambda d: d["records"][6].__setitem__("publishedToApp", True),
            "fake-source-rights": lambda d: d["records"][7].__setitem__(
                "individualRightsStatus", "APPROVED_FOR_TARGET_TERRITORIES"),
            "duplicate-description": lambda d: d["records"][1].__setitem__(
                "observedEn", d["records"][0]["observedEn"]),
        }
        for label, change in changes.items():
            with self.subTest(label=label):
                mutated = copy.deepcopy(original)
                change(mutated)
                with self.assertRaises(ValueError):
                    verified_observations(mutated)


if __name__ == "__main__":
    unittest.main()
