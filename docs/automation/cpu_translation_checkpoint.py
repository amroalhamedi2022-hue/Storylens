#!/usr/bin/env python3
"""Resumable independent CPU comparison. Never modifies app content."""
import argparse
import collections
import json
import pathlib
import re
import subprocess
import tempfile
import unicodedata
import unittest
from cpu_translation_pilot import MODEL, REVISION, ROOT, sha, validate_rows

PILOT = "REVIEW_ONLY_NOT_PUBLICATION_APPROVED"
CANDIDATE = "UNAPPROVED_MACHINE_BASELINE"
DEFERRED = "SKIPPED_LONG_INPUT_NO_TRUNCATION"
ARABIC = re.compile(r"[\u0621-\u064a\u066e-\u06d3]")
SCHEMA = 1

def number_literals(text):
    return dict(collections.Counter("".join(str(unicodedata.decimal(c)) for c in n)
        for n in re.findall(r"\d+", text)))

def signals(en, draft, candidate):
    flags = []
    if number_literals(en) != number_literals(candidate):
        flags.append({"code": "NUMBER_LITERAL_REVIEW", "source": number_literals(en),
                      "candidate": number_literals(candidate)})
    patterns = [
        (r"\bNo\.\s*\d+", r"الساعة\s*\d+", "ADDRESS_AS_TIME"),
        (r"on ['’]Change", r"التغيير", "EXCHANGE_AS_CHANGE"),
        (r"counting-rooms", r"غرف العد", "COUNTING_ROOMS_LITERAL"),
        (r"Inns of Court", r"نزل|نزلي", "LEGAL_INNS_LITERAL"),
        (r"polished man of the world", r"مصقول", "IDIOM_LITERAL"),
    ]
    for source_pattern, candidate_pattern, code in patterns:
        if re.search(source_pattern, en, re.I) and re.search(candidate_pattern, candidate):
            flags.append({"code": code})
    if re.search(r"\bnot a manufacturer\b", en, re.I) and not re.search(r"مصنع|صانع|صناع|معمل", candidate):
        flags.append({"code": "POSSIBLE_OCCUPATION_SENTENCE_OMISSION"})
    if re.search(r"\bmember of the Reform\b", en, re.I) and "نادي" not in candidate:
        flags.append({"code": "POSSIBLE_CLUB_NAME_OMISSION"})
    if len(draft.split()) >= 20 and len(candidate.split()) < 0.6 * len(draft.split()):
        flags.append({"code": "SHORT_VS_EXISTING_DRAFT_REVIEW"})
    return flags

def source_rows(source, chapter):
    rows = validate_rows(source, chapter)
    if not source.get("sourceFileShas256") or any(
        not re.fullmatch(r"[0-9a-f]{64}", h) for h in source["sourceFileShas256"]
    ):
        raise ValueError("Missing source identity")
    if any(not isinstance(r.get("existingArabicDraft"), str) or not r["existingArabicDraft"].strip() for r in rows):
        raise ValueError("Missing existing aligned draft")
    return rows

def candidate_record(row, candidate):
    return {"index": row["index"], "sourceSha256": sha(row["en"]),
            "sourceEnglish": row["en"], "existingArabicDraft": row["existingArabicDraft"],
            "cpuArabicCandidate": candidate, "candidateSha256": sha(candidate),
            "status": CANDIDATE,
            "reviewSignals": signals(row["en"], row["existingArabicDraft"], candidate)}

def load_records(seed, source, chapter):
    rows = source_rows(source, chapter)
    if (seed.get("status") != PILOT or seed.get("model") != MODEL
        or seed.get("revision") != REVISION or seed.get("chapter") != chapter
        or seed.get("sourceHashes") != source["sourceFileShas256"]
        or seed.get("totalParagraphs") != len(rows)):
        raise ValueError("Seed does not match pinned source/model; refuse repeat or stale reuse")
    if seed.get("schema") not in (None, SCHEMA):
        raise ValueError("Unknown checkpoint schema")
    if not isinstance(seed.get("records"), list) or not seed["records"]:
        raise ValueError("Empty or invalid checkpoint")
    records = {}
    for item in seed["records"]:
        i = item.get("index")
        if type(i) is not int or i not in range(len(rows)) or i in records:
            raise ValueError("Invalid or duplicate paragraph index")
        row = rows[i]
        if item.get("sourceSha256") != sha(row["en"]):
            raise ValueError("Paragraph source hash mismatch")
        if item.get("status") == DEFERRED:
            records[i] = {"index": i, "sourceSha256": sha(row["en"]), "status": DEFERRED}
            continue
        candidate = item.get("cpuArabicCandidate")
        if (item.get("status") != CANDIDATE or item.get("sourceEnglish") != row["en"]
            or item.get("existingArabicDraft") != row["existingArabicDraft"]
            or not isinstance(candidate, str) or not ARABIC.search(candidate)):
            raise ValueError("Invalid or stale candidate")
        if "candidateSha256" in item and item["candidateSha256"] != sha(candidate):
            raise ValueError("Candidate integrity mismatch")
        records[i] = candidate_record(row, candidate)
    if seed.get("translated") != sum(r["status"] == CANDIDATE for r in records.values()):
        raise ValueError("Seed translated count mismatch")
    return records

def save(output, source, chapter, records, seed_run, reused):
    result = {"schema": SCHEMA, "status": PILOT, "model": MODEL, "revision": REVISION,
              "chapter": chapter, "sourceHashes": source["sourceFileShas256"],
              "totalParagraphs": len(source["paragraphs"]), "seedRun": seed_run,
              "reused": reused, "newlyProcessed": len(records)-reused,
              "translated": sum(r["status"] == CANDIDATE for r in records.values()),
              "deferred": sum(r["status"] == DEFERRED for r in records.values()),
              "unprocessed": len(source["paragraphs"])-len(records),
              "flaggedCandidates": sum(bool(r.get("reviewSignals")) for r in records.values()),
              "approved": 0, "rightsVerified": False,
              "records": [records[i] for i in sorted(records)]}
    output.parent.mkdir(parents=True, exist_ok=True)
    tmp = output.with_suffix(".tmp")
    tmp.write_text(json.dumps(result, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
    tmp.replace(output)
    return result

def extend(source, chapter, records, limit, translate, checkpoint):
    missing = [row for row in source_rows(source, chapter) if row["index"] not in records]
    for row in missing[:limit]:
        candidate = translate(row["en"])
        i = row["index"]
        if candidate is None:
            records[i] = {"index": i, "sourceSha256": sha(row["en"]), "status": DEFERRED}
        else:
            if not isinstance(candidate, str) or not ARABIC.search(candidate):
                raise ValueError("Invalid Arabic output; preserve previous checkpoint")
            records[i] = candidate_record(row, candidate)
        checkpoint()
        print("Checkpointed paragraph", i, records[i]["status"], flush=True)

def make_translator():
    import torch
    from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
    torch.set_num_threads(2)
    tokenizer = AutoTokenizer.from_pretrained(MODEL, revision=REVISION, trust_remote_code=False)
    model = AutoModelForSeq2SeqLM.from_pretrained(MODEL, revision=REVISION, trust_remote_code=False).eval()
    def translate(en):
        inputs = tokenizer(">>ara<< " + en, return_tensors="pt", truncation=False)
        if inputs["input_ids"].shape[1] > 480:
            return None
        with torch.inference_mode():
            seq = model.generate(**inputs, max_new_tokens=500, num_beams=4)[0]
        if len(seq) >= 501:
            raise ValueError("Potentially truncated output")
        return tokenizer.decode(seq, skip_special_tokens=True).strip()
    return translate

def run(args):
    source = json.loads(subprocess.check_output(
        ["node", "tools/export_verne_chapter.cjs", str(args.chapter)],
        cwd=ROOT, text=True, timeout=60))
    records = load_records(json.loads(args.seed.read_text(encoding="utf-8")), source, args.chapter)
    reused = len(records)
    def checkpoint():
        return save(args.output, source, args.chapter, records, args.seed_run, reused)
    checkpoint()
    if args.limit and reused < len(source["paragraphs"]):
        extend(source, args.chapter, records, args.limit, make_translator(), checkpoint)
    result = checkpoint()
    print(json.dumps({k: v for k, v in result.items() if k not in ("records", "sourceHashes")}, ensure_ascii=False))
    print("No automatic editorial or publication approval.")

class Tests(unittest.TestCase):
    def setUp(self):
        self.source = {"chapterOneBased": 1, "originalLanguage": "en", "sourceFileShas256": ["a"*64],
                       "paragraphs": [{"index": i, "en": "Sentence "+str(i), "existingArabicDraft": "جملة"} for i in range(3)]}
        self.seed = {"status": PILOT, "model": MODEL, "revision": REVISION, "chapter": 1,
                     "sourceHashes": ["a"*64], "totalParagraphs": 3, "translated": 1,
                     "records": [candidate_record(self.source["paragraphs"][0], "جملة ٠")]}
    def test_reuse_and_resume(self):
        records = load_records(self.seed, self.source, 1)
        calls, checkpoints = [], []
        def translate(en):
            calls.append(en)
            return "ترجمة"
        extend(self.source, 1, records, 1, translate, lambda: checkpoints.append(len(records)))
        self.assertEqual(calls, ["Sentence 1"])
        self.assertEqual(checkpoints, [2])
        extend(self.source, 1, records, 2, translate, lambda: None)
        self.assertEqual(calls, ["Sentence 1", "Sentence 2"])
        with tempfile.TemporaryDirectory() as d:
            path = pathlib.Path(d)/"checkpoint.json"
            save(path, self.source, 1, records, "1", 1)
            self.assertEqual(len(load_records(json.loads(path.read_text()), self.source, 1)), 3)
    def test_duplicate_and_stale(self):
        self.seed["records"].append(self.seed["records"][0])
        with self.assertRaises(ValueError):
            load_records(self.seed, self.source, 1)
        self.seed["records"].pop()
        self.source["paragraphs"][0]["existingArabicDraft"] = "نص آخر"
        with self.assertRaises(ValueError):
            load_records(self.seed, self.source, 1)
    def test_corruption(self):
        self.seed["records"][0]["cpuArabicCandidate"] = "نص مختلف"
        with self.assertRaises(ValueError):
            load_records(self.seed, self.source, 1)
    def test_signals(self):
        self.assertEqual(number_literals("1872 ٧ ۷"), {"1872": 1, "7": 2})
        flags = signals("No. 7, in 1872", "رقم 7", "الساعة ٧")
        self.assertEqual({f["code"] for f in flags}, {"ADDRESS_AS_TIME", "NUMBER_LITERAL_REVIEW"})
        self.assertEqual(signals("No. 7", "رقم 7", "رقم ٧"), [])
        self.assertIn({"code": "POSSIBLE_OCCUPATION_SENTENCE_OMISSION"},
                      signals("He was not a manufacturer.", "لم يكن صاحب مصنع", "كان اسمه غريباً"))
    def test_partial_failure_and_defer(self):
        records = load_records(self.seed, self.source, 1)
        calls = []
        def translate(en):
            if en.endswith("2"):
                raise RuntimeError("inference failed")
            return None
        with self.assertRaises(RuntimeError):
            extend(self.source, 1, records, 2, translate, lambda: calls.append(len(records)))
        self.assertEqual(calls, [2])
        self.assertEqual(records[1]["status"], DEFERRED)
        self.assertNotIn(2, records)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--self-test", action="store_true")
    parser.add_argument("--chapter", type=int, choices=range(1, 38), default=1)
    parser.add_argument("--seed", type=pathlib.Path)
    parser.add_argument("--seed-run", default="unknown")
    parser.add_argument("--limit", type=int, choices=range(0, 9), default=8)
    parser.add_argument("--output", type=pathlib.Path, default=pathlib.Path("cpu-translation-evidence/checkpoint.json"))
    args = parser.parse_args()
    if args.self_test:
        unittest.main(argv=["self-test"])
    else:
        if args.seed is None:
            parser.error("--seed required; never restart from scratch")
        run(args)
