# auto-generates a structured JSON of tag data for use in a content collection

import json
from pathlib import Path
from typing import Literal, TypedDict, Callable, Any
import frontmatter
import subprocess

REPO_ROOT: Path = Path(__file__).parents[1]
CONTENT_DIR: Path = REPO_ROOT / "src" / "content"
OUTPUT_PATH: Path = CONTENT_DIR / "tags.json"
PROJECTS_ROOT: Path = CONTENT_DIR / "projects"

PRETTIER_CONFIG_PATH = REPO_ROOT / ".prettierrc.ts"

GLOB_PATTERN: str = "*/index.md"

MODELS3D_PATH: Path = CONTENT_DIR / "models3D.json"


class TagReferrer(TypedDict):
    id: str
    collection: str


class TagEntryData(TypedDict):
    title: str
    variant: Literal["tag", "techStack"]
    referrers: list[TagReferrer]


def format_code(file_path: Path):

    cmd_list = [
        "npx",
        "prettier",
        str(file_path),
        "--write",
        "--config",
        str(PRETTIER_CONFIG_PATH),
    ]
    cmd = " ".join(cmd_list)
    print(cmd)

    # run prettier via npx
    subprocess.check_output(cmd, shell=True)
    print(f"Successfully formatted: {file_path}")


snake_case_to_human_readable: Callable[[str], str] = lambda s: " ".join(
    word[:1].upper() + word[1:] for word in s.split("_")
)


def get_project_tags_and_tech_stack(file: Path):
    fm: dict[str, Any] = frontmatter.Frontmatter.read_file(file)["attributes"]
    return (
        str(fm.get("slug")),
        fm.get("tags", []),
        fm.get("techStack", []),
    )  # require `slug`


def get_model3D_tags():
    if not MODELS3D_PATH.exists():
        return []

    data: dict[str, dict] = json.loads(MODELS3D_PATH.read_text())

    return [
        (model_id, model_data.get("tags", [])) for model_id, model_data in data.items()
    ]


def update_data(
    slug: str,
    data: dict[str, TagEntryData],
    values: list[str],
    variant: Literal["tag", "techStack"],
    collection: str,
):
    referrer: TagReferrer = {"id": slug, "collection": collection}
    for val in values:
        curr = data.get(val, None)
        if curr is None:
            new = TagEntryData(
                title=snake_case_to_human_readable(val),
                variant=variant,
                referrers=[referrer],
            )
            data |= {val: new}
        else:
            curr["referrers"].append(referrer)


def main():
    files = list(PROJECTS_ROOT.resolve().rglob(GLOB_PATTERN))

    entries: dict[str, TagEntryData] = {}

    for f in files:
        slug, tags, techStack = get_project_tags_and_tech_stack(f)

        update_data(slug, entries, tags, "tag", "projects")
        update_data(slug, entries, techStack, "techStack", "projects")

    for model_id, tags in get_model3D_tags():
        update_data(model_id, entries, tags, "tag", "models3D")

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(entries, sort_keys=False), newline="\n")

    format_code(OUTPUT_PATH)


if __name__ == "__main__":
    main()
