# auto-generates a structured JSON of tag data for use in a content collection

import json
from pathlib import Path
from typing import Literal, TypedDict, Callable, Any
import frontmatter
from string import capwords
import subprocess

REPO_ROOT: Path = Path(__file__).parents[1]
CONTENT_DIR: Path = REPO_ROOT / "src" / "content"
OUTPUT_PATH: Path = CONTENT_DIR / "tags.json"
PROJECTS_ROOT: Path = CONTENT_DIR / "projects"

PRETTIER_CONFIG_PATH = REPO_ROOT / ".prettierrc.ts"

GLOB_PATTERN: str = "*/index.md"


class TagEntryData(TypedDict):
    title: str
    variant: Literal["tag", "techStack"]
    referrers: list[str]


snake_case_to_human_readable: Callable[[str], str] = lambda s: capwords(
    s.replace("_", " ")
)


def get_tags_and_tech_stack(file: Path):
    fm: dict[str, Any] = frontmatter.Frontmatter.read_file(file)["attributes"]
    return (
        str(fm.get("slug")),
        fm.get("tags", []),
        fm.get("techStack", []),
    )  # require `slug`


def update_data(
    slug: str,
    data: dict[str, TagEntryData],
    values: list[str],
    variant: Literal["tag", "techStack"],
):
    for val in values:
        curr = data.get(val, None)
        if curr is None:
            new = TagEntryData(
                title=snake_case_to_human_readable(val),
                variant=variant,
                referrers=[slug],
            )
            data |= {val: new}
        else:
            curr["referrers"].append(slug)


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


def main():
    files = list(PROJECTS_ROOT.resolve().rglob(GLOB_PATTERN))

    data: dict[str, TagEntryData] = {}

    for f in files:
        slug, tags, techStack = get_tags_and_tech_stack(f)

        update_data(slug, data, tags, "tag")
        update_data(slug, data, techStack, "techStack")

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(data, sort_keys=True), newline="\n")

    format_code(OUTPUT_PATH)


if __name__ == "__main__":
    main()
