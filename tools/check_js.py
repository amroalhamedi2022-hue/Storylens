#!/usr/bin/env python3
"""Extract executable inline JavaScript and validate syntax with Node.js."""
import re
import subprocess
import tempfile
from pathlib import Path
html=Path("app/src/main/assets/index.html").read_text(encoding="utf-8")
scripts=re.findall(r"<script(?:\s[^>]*)?>([\s\S]*?)</script>",html)
assert len(scripts)>=2
valid=0
for script in scripts:
    if not script.strip().startswith(("'use strict'","(function()")):
        continue
    with tempfile.NamedTemporaryFile(mode="w",suffix=".js",encoding="utf-8",delete=True) as fh:
        fh.write(script)
        fh.flush()
        subprocess.run(["node","--check",fh.name],check=True)
    valid+=1
assert valid>=2, f"Expected main app code and enhancement modules: {valid}"
print(f"PASS: syntax of {valid} executable JS blocks")
