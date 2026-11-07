#!/usr/bin/env python3
"""Offline verification of original 1860 cover, 1861 Gilbert and 1903 Macklin
images. Fixture bytes are synthetic and NEVER enter app/art source archives.
"""
from __future__ import annotations

import hashlib
from io import BytesIO
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest import mock

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
import intake_woman_white_original_art as originals
import intake_verne_commons_period_gallery as engine


def image_info(name: str, n: int, license_name: str = "Public domain") -> dict:
    return {
        "title": name,
        "imageinfo": [{
            "sha1": f"{n:016x}" + "0" * 24,
            "mime": "image/jpeg",
            "url": "https://upload.wikimedia.org/wikipedia/commons/a/a1/original.jpg",
            "descriptionurl": "https://commons.wikimedia.org/wiki/" + name.replace(" ", "_"),
            "width": 650,
            "height": 1024,
            "extmetadata": {
                "LicenseShortName": {"value": license_name},
                "Copyrighted": {"value": "False"},
            },
        }],
    }


class FakeResponse:
    def __init__(self, raw: bytes, url: str) -> None:
        self.raw, self.url = raw, url
    def __enter__(self):
        return self
    def __exit__(self, *_):
        return None
    def raise_for_status(self):
        return None
    def iter_content(self, chunk_size=65536):
        for i in range(0, len(self.raw), chunk_size):
            yield self.raw[i:i+chunk_size]


class FakeSession:
    def __init__(self, raw: bytes, final_url: str) -> None:
        self.raw, self.final_url = raw, final_url
    def get(self, *_args, **_kwargs):
        return FakeResponse(self.raw, self.final_url)


class GenuineWomanInWhiteArtContract(unittest.TestCase):
    def test_exactly_ten_licensed_period_original_titles_and_authors(self):
        self.assertEqual(len(originals.ALL_NAMES), 10)
        self.assertEqual(len(originals.MACKLIN_NAMES), 8)
        self.assertEqual(engine.SOURCE_CATEGORY, "Category:The Woman in White")
        self.assertIsNone(engine.ORIGINAL_YEAR)
        self.assertEqual(engine.MIN_IMAGE_WIDTH, 350)  # existing source floor is intact
        self.assertEqual(engine.MIN_IMAGE_HEIGHT, 350)
        for name in originals.ALL_NAMES:
            self.assertIsNotNone(engine.PERIOD_NAME.fullmatch(name), name)
        for name in (
            "File:Illustration by Thomas Eyre Macklin for The Woman in White (9).jpg",
            "File:Illustration by Thomas Eyre Macklin for The Woman in White (1).png",
            "File:The Woman In White (1948 film).jpg",
            "File:The Woman In White - Film Cover.jpg",
            "File:The Woman In White - Cover.jpg/AI-upscale",
            "File:Illustration by Thomas Eyre Macklin for The Woman in White (1).jpg.exe",
        ):
            self.assertIsNone(engine.PERIOD_NAME.fullmatch(name), name)
        self.assertEqual(originals.edition_for(originals.COVER_NAME)[:2],
                         (1860, originals.HARPER))
        self.assertEqual(originals.edition_for(originals.GILBERT_NAME)[:2],
                         (1861, originals.GILBERT))
        self.assertTrue(all(originals.edition_for(n)[:2] == (1903, originals.MACKLIN)
                            for n in originals.MACKLIN_NAMES))

    def test_common_metadata_requires_per_image_pd_and_safe_https(self):
        example = image_info(next(iter(originals.MACKLIN_NAMES)), 12)
        self.assertIsNotNone(engine.permit_candidate(example, set()))
        self.assertIsNone(engine.permit_candidate(example, {f"{12:016x}" + "0" * 24}))
        self.assertIsNone(engine.permit_candidate(
            image_info(next(iter(originals.MACKLIN_NAMES)), 12, "All rights reserved"), set()))
        unsafe = image_info(originals.COVER_NAME, 25)
        unsafe["imageinfo"][0]["url"] = "https://evil.example/image.jpg"
        self.assertIsNone(engine.permit_candidate(unsafe, set()))
        unsafe = image_info(originals.GILBERT_NAME, 25)
        unsafe["imageinfo"][0]["extmetadata"]["Copyrighted"]["value"] = "true"
        self.assertIsNone(engine.permit_candidate(unsafe, set()))

    def test_source_bytes_require_genuine_decodable_jpeg_and_archive_webp(self):
        picture = Image.new("RGB", (650, 1024))
        pixels = picture.load()
        for y in range(1024):
            for x in range(650):
                pixels[x, y] = ((x * 7 + y) % 256, (x * 3 + y * 5) % 256,
                                (x + y * 11) % 256)
        output = BytesIO()
        picture.save(output, "JPEG", quality=86)
        actual_jpeg = output.getvalue()
        self.assertGreater(len(actual_jpeg), 5000)
        url = "https://upload.wikimedia.org/wikipedia/commons/a/a1/original.jpg"
        jpeg, webp, width, height = engine.download_image(
            FakeSession(actual_jpeg, url), {"downloadURL": url})
        self.assertEqual(jpeg, actual_jpeg)
        self.assertEqual((width, height), (650, 1024))
        self.assertEqual(webp[:4], b"RIFF")
        self.assertEqual(webp[8:12], b"WEBP")
        self.assertEqual(Image.open(BytesIO(webp)).size, (650, 1024))
        self.assertEqual(len(hashlib.sha256(webp).hexdigest()), 64)
        with self.assertRaises(ValueError):
            engine.download_image(FakeSession(actual_jpeg, "https://evil.example/not-original.jpg"),
                                  {"downloadURL": url})

    def test_ten_distinct_source_records_survive_resumption_without_fabrication(self):
        names = sorted(originals.ALL_NAMES)
        source_pages = [image_info(name, n) for n, name in enumerate(names, 1)]
        picture_bytes = [(f"source-data-{n}".encode(),
                          f"RIFF{n:04d}WEBPbytes".encode(), 650, 1024)
                         for n in range(1, 11)]
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            archive = root / "woman"
            with mock.patch.object(engine, "DEST", archive), \
                 mock.patch.object(engine, "IMAGES", archive / "plates"), \
                 mock.patch.object(engine, "MANIFEST", archive / "manifest.json"), \
                 mock.patch.object(engine, "category_members", return_value=source_pages), \
                 mock.patch.object(engine, "download_image", side_effect=picture_bytes), \
                 mock.patch.object(engine.time, "sleep", return_value=None):
                self.assertEqual(originals.run(10), 10)
                doc = json.loads((archive / "manifest.json").read_text())
                self.assertIsNone(doc["originalEditionYear"])
                self.assertTrue(doc["allOriginalTenSourceFilesArchived"])
                self.assertEqual(len(doc["images"]), 10)
                self.assertEqual({p["wikiFile"] for p in doc["images"]},
                                 originals.ALL_NAMES)
                self.assertFalse(doc["publicationApproved"])
                self.assertFalse(doc["humanSceneReviewComplete"])
                for image in doc["images"]:
                    self.assertEqual(len(image["webpSha256"]), 64)
                    self.assertEqual(image["downloadedResourceSha256"],
                                     hashlib.sha256(
                                         f"source-data-{names.index(image['wikiFile']) + 1}".encode()
                                     ).hexdigest())
                    self.assertFalse(image["editoriallyApproved"])
                    self.assertFalse(image["publishedToApp"])
                    self.assertIsNone(image["altAr"])
                    self.assertIsNone(image["altEn"])
                    self.assertEqual(image["rightsStatus"],
                                     "PENDING_INDIVIDUAL_TERRITORIAL_AND_EDITORIAL_REVIEW")
                # The same source content must not be re-acquired or counted twice.
                self.assertEqual(originals.run(10), 0)
                self.assertEqual(len(json.loads(
                    (archive / "manifest.json").read_text())["images"]), 10)

    def test_rejects_unauthorized_duplicate_and_missing_license_evidence(self):
        with tempfile.TemporaryDirectory() as temporary:
            path = Path(temporary) / "manifest.json"
            invalid = {
                "category": originals.CATEGORY,
                "publicationApproved": False,
                "chapterSceneMatchingComplete": False,
                "images": [{
                    "wikiFile": originals.COVER_NAME,
                    "originalCommonsSHA1MetadataOnly": "a" * 40,
                    "webpSha256": "b" * 64,
                    "commonsPage": "https://commons.wikimedia.org/wiki/File:The_Woman_In_White_-_Cover.jpg",
                    "individualCommonsLicense": "",
                }],
            }
            path.write_text(json.dumps(invalid))
            with mock.patch.object(engine, "MANIFEST", path):
                with self.assertRaisesRegex(ValueError, "copyright"):
                    originals.maintain_provenance()


if __name__ == "__main__":
    unittest.main()
