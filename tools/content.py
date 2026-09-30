"""Adds devlogs and projects to the site from plain markdown files.

  python tools/content.py                       rebuild devlogs/manifest.json and projects/manifest.json
  python tools/content.py new devlog "Title"    create devlogs/title.md from a template, then rebuild
  python tools/content.py new project "Title"   create projects/title.md from a template, then rebuild

Every .md file in devlogs/ and projects/ starts with a small header between two --- lines:

  ---
  title: Making The Last Mooncake
  date: 2026-09-30
  summary: One or two sentences shown on the list page.
  tags: Game jam, Unity
  ---

Projects can also use `image:` (a thumbnail path such as images/foo.png), `link:` (a play or
source URL) and `linkLabel:` (the button text),
`source:` and `sourceLabel:` (a GitHub button next to it). Files whose name starts with _ are ignored.
err if u have any questions figure it out or smth.
"""
import datetime
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
KINDS = {"devlog": "devlogs", "project": "projects"}

TEMPLATES = {
    "devlog": """---
title: {title}
date: {date}
summary: One or two sentences shown on the devlogs page.
tags: Unity
image: images/example.png
---

Write the devlog here in markdown. Images go in images/, then use
![Describe the image](images/example.png)
""",
    "project": """---
title: {title}
date: {date}
summary: One or two sentences shown on the projects page.
tags: Unity, C#
image: images/example.png
link: https://mzee08.itch.io
linkLabel: Play on itch.io
---

Write about the project here in markdown.
""",
}


def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-") or "untitled"


def parse_header(text):
    m = re.match(r"﻿?---\r?\n(.*?)\r?\n---", text, re.S)
    meta = {}
    if not m:
        return meta
    for line in m.group(1).splitlines():
        if ":" not in line or line.lstrip().startswith("#"):
            continue
        key, _, value = line.partition(":")
        value = value.strip().strip("\"'")
        meta[key.strip()] = value
    if "tags" in meta:
        meta["tags"] = [t.strip() for t in meta["tags"].split(",") if t.strip()]
    return meta


def build():
    for folder in KINDS.values():
        d = ROOT / folder
        d.mkdir(exist_ok=True)
        entries = []
        for md in sorted(d.glob("*.md")):
            if md.name.startswith("_"):
                continue
            meta = parse_header(md.read_text(encoding="utf-8"))
            if "title" not in meta:
                print(f"skipped {md.name}: no title in the header")
                continue
            entries.append({"slug": md.stem, **meta})
        entries.sort(key=lambda e: e.get("date", ""), reverse=True)
        (d / "manifest.json").write_text(json.dumps({"posts": entries}, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"{folder}/manifest.json: {len(entries)} entries")


def new(kind, title):
    if kind not in KINDS:
        sys.exit("kind must be 'devlog' or 'project'")
    path = ROOT / KINDS[kind] / f"{slugify(title)}.md"
    if path.exists():
        sys.exit(f"{path.name} already exists")
    path.parent.mkdir(exist_ok=True)
    path.write_text(TEMPLATES[kind].format(title=title, date=datetime.date.today().isoformat()), encoding="utf-8")
    print("created", path.relative_to(ROOT))
    build()


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args:
        build()
    elif args[0] == "new" and len(args) == 3:
        new(args[1], args[2])
    else:
        sys.exit(__doc__)
