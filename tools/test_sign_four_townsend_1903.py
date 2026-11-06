#!/usr/bin/env python3
"""Offline regression tests: 1903 F. H. Townsend eight authentic-plate intake.

Synthetic in-memory test JPEGs are used only by the test process; no synthetic
pictures are committed as literary source evidence or published by the app.
"""
from __future__ import annotations

from io import BytesIO
import hashlib
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest import mock

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
import intake_sign_four_townsend_1903 as sign
import intake_verne_commons_period_gallery as engine


def entry(n: int, *, license_name: str = "Public domain") -> dict:
    name = f"File:Sign-t{n}.jpg"
    return {
        "title": name,
        "imageinfo": [{
            "sha1": f"{n:040x}",
            "mime": "image/jpeg",
            "url": f"https://upload.wikimedia.org/wikipedia/commons/0/00/Sign-t{n}.jpg",
            "descriptionurl": f"https://commons.wikimedia.org/wiki/File:Sign-t{n}.jpg",
            "width": 257,
            "height": 376,
            "extmetadata": {
                "LicenseShortName": {"value": license_name},
                "Copyrighted": {"value": "False"}
            },
        }],
    }


class FakeHTTPResponse:
    def __init__(self, raw: bytes, url: str):
        self.raw, self.url = raw, url
    def __enter__(self):
        return self
    def __exit__(self, *_):
        pass
    def raise_for_status(self):
        pass
    def iter_content(self, chunk_size=65536):
        for start in range(0, len(self.raw), chunk_size):
            yield self.raw[start:start + chunk_size]


class FakeSession:
    def __init__(self, raw: bytes, url: str):
        self.raw, self.url = raw, url
    def get(self, *_args, **_kwargs):
        return FakeHTTPResponse(self.raw, self.url)


class TownsendSourceContract(unittest.TestCase):
    def test_only_eight_townsend_1903_image_filenames(self):
        self.assertEqual(len(sign.NAMES), 8)
        for name in sign.NAMES:
            self.assertTrue(engine.PERIOD_NAME.fullmatch(name))
        for unsafe in (
            "File:Sign-t0.jpg", "File:Sign-t9.jpg", "File:Sign-t1.png",
            "File:Some remake Sign-t1.jpg", "File:Sign t1.jpg",
            "File:Sign-t1.jpg.exe", "File:Sign-t1.jpg/modified",
        ):
            self.assertFalse(engine.PERIOD_NAME.fullmatch(unsafe), unsafe)
        self.assertEqual(engine.SOURCE_CATEGORY,
                         "Category:The Sign of Four illustrated by F. H. Townsend")
        self.assertEqual(engine.ORIGINAL_YEAR, 1903)
        self.assertEqual(engine.MIN_CATEGORY_MEMBERS, 8)
        self.assertEqual(engine.MIN_IMAGE_WIDTH, 240)
        self.assertEqual(engine.MIN_IMAGE_HEIGHT, 330)

    def test_licensing_original_filename_and_sha1_are_mandatory(self):
        self.assertIsNotNone(engine.permit_candidate(entry(1), set()))
        self.assertIsNone(engine.permit_candidate(entry(1, license_name="All rights reserved"), set()))
        self.assertIsNone(engine.permit_candidate(entry(1), {f"{1:040x}"}))
        bad = entry(2)
        bad["imageinfo"][0]["extmetadata"]["Copyrighted"]["value"] = "true"
        self.assertIsNone(engine.permit_candidate(bad, set()))
        bad = entry(2)
        bad["imageinfo"][0]["url"] = "http://example.com/fake.jpg"
        self.assertIsNone(engine.permit_candidate(bad, set()))
        bad = entry(2)
        bad["imageinfo"][0]["mime"] = "image/svg+xml"
        self.assertIsNone(engine.permit_candidate(bad, set()))
        bad = entry(2)
        bad["title"] = "File:Sign-t9.jpg"
        self.assertIsNone(engine.permit_candidate(bad, set()))

    def test_1903_small_but_genuine_scan_decodes_and_hashes(self):
        # Noise-free original source verification: JPEG bytes are generated
        # *only* inside this test for signature/dimensions/remote-host checks.
        img = Image.new("RGB", (257, 376))
        pix = img.load()
        for y in range(img.height):
            for x in range(img.width):
                pix[x, y] = ((x * y) % 255, (x * 3 + y * 5) % 255, (y * 7) % 255)
        raw = BytesIO()
        img.save(raw, "JPEG", quality=90)
        source = raw.getvalue()
        self.assertGreater(len(source), 5000)
        url = "https://upload.wikimedia.org/wikipedia/commons/0/00/Sign-t1.jpg"
        original, packed, width, height = engine.download_image(
            FakeSession(source, url), {"downloadURL": url})
        self.assertEqual(original, source)
        self.assertEqual((width, height), (257, 376))
        self.assertEqual(packed[:4], b"RIFF")
        self.assertEqual(packed[8:12], b"WEBP")
        self.assertEqual(Image.open(BytesIO(packed)).size, (257, 376))
        self.assertEqual(len(hashlib.sha256(packed).hexdigest()), 64)
        with self.assertRaises(ValueError):
            engine.download_image(FakeSession(source, "https://evil.invalid/scan.jpg"),
                                  {"downloadURL": url})

    def test_real_archive_metadata_stays_unapproved_after_resuming(self):
        # The same runner must be idempotent: one source title is not ingested
        # more than once even if the input reports the same page twice.
        with tempfile.TemporaryDirectory() as d:
            root = Path(d)
            dest = root / "images"
            with mock.patch.object(engine, "DEST", dest), \\
                 mock.patch.object(engine, "MANIFEST", dest / "manifest.json"), \\
                 mock.patch.object(engine, "IMAGES", dest / "plates"), \\
                 mock.patch.object(engine, "category_members", return_value=[entry(n) for n in range(1, 9)]), \\
                 mock.patch.object(engine, "download_image", return_value=(b"source", b"RIFF1234WEBPbytes", 257, 376)), \\
                 mock.patch.object(engine.time, "sleep", return_value=None):
                self.assertEqual(sign.run(max_new=8), 8)
                manifest = json.loads((dest / "manifest.json").read_text(encoding="utf-8"))
                self.assertEqual(len(manifest["images"]), 8)
                self.assertEqual(manifest["sourceEdition"], sign.EDITION)
                self.assertEqual(manifest["originalCreator"], sign.CREATOR)
                self.assertIs(manifest["publicationApproved"], False)
                self.assertIs(manifest["humanChapterSceneVerificationComplete"], False)
                self.assertEqual(
                    {p["wikiFile"] for p in manifest["images"]}, sign.NAMES)
                for row in manifest["images"]:
                    self.assertIs(row["editoriallyApproved"], False)
                    self.assertEqual(row["rightsStatus"],
                                     "PENDING_INDIVIDUAL_TERRITORY_AND_SCENE_REVIEW")
                    self.assertIs(row["publishedToApp"], False)
                self.assertEqual(sign.run(max_new=8), 0)
                self.assertEqual(len(json.loads((dest / "manifest.json").read_text())["images"]), 8)

    def test_never_accepts_unlicensed_or_duplicate_saved_sources(self):
        with tempfile.TemporaryDirectory() as d:
            dest = Path(d)
            malformed = {
                "category": engine.SOURCE_CATEGORY,
                "publicationApproved": False,
                "chapterSceneMatchingComplete": False,
                "images": [{
                    "wikiFile": "File:Sign-t1.jpg",
                    "originalCommonsSHA1MetadataOnly": "a" * 40,
                    "individualCommonsLicense": "",
                    "commonsPage": "https://commons.wikimedia.org/wiki/File:Sign-t1.jpg",
                }]
            }
            (dest / "manifest.json").write_text(json.dumps(malformed))
            with mock.patch.object(engine, "MANIFEST", dest / "manifest.json"):
                with self.assertRaisesRegex(ValueError, "license"):
                    sign.maintain_evidence()


if __name__ == "__main__":
    unittest.main()
