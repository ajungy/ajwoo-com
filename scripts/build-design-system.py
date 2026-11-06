"""Build complete, portable design-system downloads from the public source folder."""
from pathlib import Path
import re
import json
import zipfile

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/minimal-design-system"
ENTRY = SOURCE / "SKILL.md"
files = sorted(path for path in SOURCE.rglob("*") if path.is_file())
entry = ENTRY.read_text()
prompt = json.loads((ROOT / "content/skill-prompt.json").read_text())
entry, count = re.subn(
    r"<!-- recommended-prompt:start -->.*?<!-- recommended-prompt:end -->",
    "<!-- recommended-prompt:start -->\n\n" + prompt + "\n\n<!-- recommended-prompt:end -->",
    entry, flags=re.DOTALL,
)
if count != 1:
    raise SystemExit("The skill must have one recommended-prompt section.")
ENTRY.write_text(entry)
required = {"LICENSE-AND-ASSETS.md", "tokens/tokens.css",
            "tokens/tokens.json", "tokens/tailwind.preset.js"}
for path in [ENTRY, *SOURCE.glob("reference/*.md")]:
    required.update(re.findall(r"(?:reference|tokens|examples)/[\w./-]+\.(?:md|css|json|js|html)", path.read_text()))
missing = sorted(name for name in required if not (SOURCE / name).is_file())
if missing:
    raise SystemExit("Missing design-system files: " + ", ".join(missing))

# Validate token names used by the runnable example.
token_css = (SOURCE / "tokens/tokens.css").read_text()
defined = set(re.findall(r"(--[\w-]+)\s*:", token_css))
example_css = (SOURCE / "examples/components.css").read_text()
used = set(re.findall(r"var\((--[\w-]+)", example_css))
if used - defined:
    raise SystemExit("Unknown example tokens: " + ", ".join(sorted(used - defined)))

# Backward-compatible single-file URL. Each referenced file is included verbatim.
standalone = entry.replace(
    "Keep this entire folder together, including `reference/` and `tokens/`.",
    "This is the self-contained edition. All supporting files appear in the "
    "appendices below. Treat those appendices as the referenced documents. "
    "For imports, first save the token appendices at their indicated paths. "
    "The complete folder is also available at "
    "https://www.ajwoo.com/minimal-design-system.zip."
)
standalone += "\n\n---\n\n# Bundled reference and token files\n"
for path in files:
    if path == ENTRY:
        continue
    name = path.relative_to(SOURCE).as_posix()
    body = path.read_text()
    fence = "`" * max(4, max((len(match[0]) for match in re.finditer(r"`+", body)), default=0) + 1)
    language = {".md": "markdown", ".css": "css", ".js": "javascript", ".json": "json", ".html": "html"}[path.suffix]
    standalone += f"\n## Bundled file: {name}\n\n{fence}{language}\n{body.rstrip()}\n{fence}\n"
(ROOT / "public/minimal-design-system.md").write_text(standalone)

# Fixed timestamps keep the ZIP stable when its contents have not changed.
archive = ROOT / "public/minimal-design-system.zip"
with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED) as output:
    for path in files:
        name = "minimal/" + path.relative_to(SOURCE).as_posix()
        info = zipfile.ZipInfo(name, date_time=(2026, 1, 1, 0, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED
        info.external_attr = 0o100644 << 16
        output.writestr(info, path.read_bytes())
with zipfile.ZipFile(archive) as output:
    if output.testzip():
        raise SystemExit("Design-system archive failed its integrity check.")
print(f"Design-system downloads built and checked ({len(files)} files).")
