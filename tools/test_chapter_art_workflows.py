#!/usr/bin/env python3
"""Regression checks for historical image archival/report GitHub Actions races.

These static workflow invariants catch the concrete November 2026 failure:
two independent writers calculated and committed the same progress snapshot
before reconciling main, so git rebase failed despite real downloaded images.
No network, images, rights approvals, Android code or credentials required.
"""
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
WF = ROOT / ".github" / "workflows"
LOCK = "group: lingua-tales-historic-commons-serial"
WORKFLOWS = (
    "verne-commons-period-art-intake.yml",
    "war-worlds-original-1906-art.yml",
    "archived-chapter-art-maps.yml",
    "monte-cristo-chapter-art.yml",
    "chapter-art-progress.yml",
)


def read(name: str) -> str:
    return (WF / name).read_text(encoding="utf-8")


class HistoricalArtRaceRegression(unittest.TestCase):
    def test_all_current_main_art_writers_use_one_shared_lock(self) -> None:
        for name in WORKFLOWS:
            with self.subTest(name=name):
                contents = read(name)
                self.assertIn(LOCK, contents)
                self.assertIn("cancel-in-progress: false", contents)

    def test_archival_intake_checkpoints_binaries_before_rebase_report(self) -> None:
        for name in WORKFLOWS[:2]:
            with self.subTest(name=name):
                source = read(name)
                self.assertLess(source.index("git add -f docs/literature/staging/"),
                                source.index('git pull --rebase origin "$GITHUB_REF_NAME"'))
                self.assertLess(source.index('git pull --rebase origin "$GITHUB_REF_NAME"'),
                                source.index("python tools/report_chapter_art_progress.py --write"))
                self.assertIn("fetch-depth: 0", source)

    def test_archived_map_checkpoint_is_saved_before_report(self) -> None:
        content = read("archived-chapter-art-maps.yml")
        self.assertLess(content.index("git add docs/literature/staging/illustrated-five-20261105/"),
                        content.index('git pull --rebase origin "$GITHUB_REF_NAME"'))
        self.assertLess(content.index('git pull --rebase origin "$GITHUB_REF_NAME"'),
                        content.index("python tools/report_chapter_art_progress.py --write"))
        self.assertEqual(content.count("python tools/report_chapter_art_progress.py --write"), 1)
        self.assertIn("python tools/map_archived_five_chapter_art.py --verify", content)
        self.assertIn("fetch-depth: 0", content)

    def test_daily_inventory_updates_checkout_before_audit(self) -> None:
        content = read("chapter-art-progress.yml")
        self.assertLess(content.index("git pull --ff-only origin main"),
                        content.index("python tools/report_chapter_art_progress.py --write"))
        self.assertIn("fetch-depth: 0", content)
        self.assertIn("git diff --cached --quiet", content)
        self.assertIn("git push origin HEAD:main", content)

    def test_art_approval_remains_human_gated(self) -> None:
        for name in WORKFLOWS:
            with self.subTest(name=name):
                content = read(name)
                self.assertNotIn("editoriallyApproved: true", content)
                self.assertNotIn("APPROVED_FOR_TARGET_TERRITORIES", content)


if __name__ == "__main__":
    unittest.main()
