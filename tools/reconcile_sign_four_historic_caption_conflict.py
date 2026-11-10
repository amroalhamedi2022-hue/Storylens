#!/usr/bin/env python3
"""Quarantine Gemini chapter matches contradicted by genuine image-caption leads.

A source-caption on Commons is NOT an independently verified 1903 PRINTED
caption and cannot identify a scene with certainty. It can, however, expose
a MATERIAL disagreement that must downgrade (not upgrade) AI confidence.
No writes to book chapter maps, original images, app or distribution rights.
"""
from __future__ import annotations

import argparse
import copy
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / "docs/literature/staging/sign-four-townsend-1903-period-plates"
REVIEWS = ROOT / "docs/literature/staging/sign-four-townsend-1903-scene-reviews"
TEXT = ROOT / "docs/literature/staging/the-sign-of-the-four"
CONFLICT = "COMMONS_CAPTION_CHAPTER_CONFLICT__AI_IMAGE_MATCH_QUARANTINED"


def load_caption_leads() -> list[dict]:
    doc = json.loads((ART / "scene-caption-source-leads.json").read_text("utf-8"))
    art = json.loads((ART / "manifest.json").read_text("utf-8"))
    chapter_map = json.loads((TEXT / "chapter-image-map.json").read_text("utf-8"))
    images = {x["wikiFile"]: x for x in art["images"]}
    if (doc.get("bookId") != "the-sign-of-the-four"
            or doc.get("releaseApproved") is not False
            or doc.get("humanSceneReviewApproved") is not False
            or doc.get("territorialRightsCleared") is not False
            or art.get("publicationApproved") is not False
            or chapter_map.get("releaseApproved") is not False):
        raise ValueError("Historic caption lead or staged original book safety flags changed")
    leads = doc.get("discoveredSourceCaptionLeads", [])
    if not isinstance(leads, list):
        raise ValueError("Historic caption lead inventory missing")
    for lead in leads:
        picture = images.get(lead.get("sourceFileName"))
        n = lead.get("candidateChapterOneBased")
        if (not picture or type(n) is not int or not 1 <= n <= 12
                or lead.get("sourceUrl") != picture.get("commonsPage")
                or lead.get("localWebpSha256") != picture.get("webpSha256")
                or lead.get("originalTextGitBlobSha") !=
                chapter_map["chapters"][n - 1]["sourceGitBlobSha"]
                or lead.get("candidateCardMapped") is not False
                or lead.get("editorialApproval") is not False
                or lead.get("rightsStatus") != "PENDING_INDIVIDUAL_TERRITORY_AND_SCENE_REVIEW"
                or lead.get("evidenceCategory") !=
                "HISTORICAL_CAPTION_MATCHES_CHAPTER_NARRATIVE__PENDING_HUMAN_VISUAL_CONFIRMATION"):
            raise ValueError("Original image-caption/source lead changed or was falsely approved")
    return leads


def downgraded_record(record: dict, lead: dict) -> dict:
    """Return independent evidence; never trust either Gemini or caption alone."""
    updated = copy.deepcopy(record)
    n = lead["candidateChapterOneBased"]
    if (updated.get("imageSha256") != lead["localWebpSha256"]
            or updated.get("originalIllustrationPage") != lead["sourceUrl"]
            or updated.get("publicationApproved") is not False
            or updated.get("sceneMatchHumanApproved") is not False
            or updated.get("rightsVerifiedForTerritories") is not False):
        raise ValueError("Gemini scene record doesn't match pinned Commons or is already published")

    proposal = updated.get("suggestedMatch")
    if not proposal:
        return updated
    proposed_chapter = proposal.get("chapterOneBased")
    if type(proposed_chapter) is not int or not 1 <= proposed_chapter <= 12:
        raise ValueError("Unbounded model-generated chapter number")
    conflict = proposed_chapter != n
    cross = updated.get("visualCrosscheck")
    if not isinstance(cross, dict):
        raise ValueError("Model image still requires second skeptical crosscheck")

    previous = updated.get("historicalCaptionConflictReview", {})
    model_supported_before_caption = previous.get(
        "modelOriginallySupportedWithoutCaption",
        cross.get("passesConservativeModelComparison") is True,
    )
    updated["historicalCaptionConflictReview"] = {
        "original1903PrintedCaptionIndependentlyVerified": False,
        "captionSource": "Wikimedia Commons caption separately matched to original novel text",
        "captionSourceURL": lead["sourceUrl"],
        "captionTextOriginalFromCommonsNotPrintVerified": lead["captionFromCommons"],
        "captionTextMatchesOriginalChapterOneBased": n,
        "geminiSuggestedChapterOneBased": proposed_chapter,
        "modelOriginallySupportedWithoutCaption": bool(model_supported_before_caption),
        "candidateChapterConflict": conflict,
        "humanEditorialReconciliationComplete": False,
        "territorialRightsCleared": False,
        "approvedForChapterCard": False,
        "interpretation": (
            "Commons caption/source novel chapter disagrees with image-only model; "
            "cannot treat model support as confirmed scene. Independent 1903 printed "
            "caption, actual painted scene and edition must be human-reviewed."
            if conflict else
            "Source chapter agrees with Commons caption lead, but printed-edition "
            "caption, image scene, and territorial rights remain unverified."
        ),
    }
    if conflict:
        cross["passesConservativeModelComparison"] = False
        cross["historicCaptionDisagreementBlocksSceneSupport"] = True
        updated["evidenceStatus"] = CONFLICT
    updated["publicationApproved"] = False
    updated["sceneMatchHumanApproved"] = False
    updated["rightsVerifiedForTerritories"] = False
    return updated


def reconcile(write: bool) -> dict:
    leads = load_caption_leads()
    changed = 0
    scanned = 0
    conflicts = 0
    for lead in leads:
        manifest = json.loads((ART / "manifest.json").read_text("utf-8"))
        fig = next(x for x in manifest["images"] if x["wikiFile"] == lead["sourceFileName"])
        source_path = REVIEWS / (fig["originalCommonsSHA1MetadataOnly"][:18] + ".json")
        if not source_path.is_file():
            continue
        before = json.loads(source_path.read_text("utf-8"))
        after = downgraded_record(before, lead)
        scanned += 1
        if after.get("historicalCaptionConflictReview", {}).get("candidateChapterConflict") is True:
            conflicts += 1
        if before != after:
            changed += 1
            if write:
                source_path.write_text(json.dumps(after, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return {"captionLeads": len(leads), "scannedAIRecords": scanned,
            "quarantinedChapterConflicts": conflicts, "newOrChangedRecords": changed,
            "wrote": write, "humanRightsOrChapterApprovalsGranted": 0}


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    group = p.add_mutually_exclusive_group(required=True)
    group.add_argument("--check", action="store_true")
    group.add_argument("--write", action="store_true")
    args = p.parse_args()
    report = reconcile(write=args.write)
    print(json.dumps(report, sort_keys=True))
    if args.check and report["newOrChangedRecords"]:
        raise SystemExit("FAIL: unquarantined historical caption/model chapter disagreement")
