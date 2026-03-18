import json
import requests
from requests.exceptions import RequestException
from pathlib import Path
import subprocess
from datetime import datetime, timezone
from typing import TypedDict, Any, Callable
import re
import markdown

REPO_ROOT: Path = Path(__file__).parents[1]
CONTENT_DIR: Path = REPO_ROOT / "src" / "content"
OUTPUT_PATH: Path = CONTENT_DIR / "models3D.json"

PRETTIER_CONFIG_PATH = REPO_ROOT / ".prettierrc.ts"

SKETCHFAB_ENDPOINT = "https://api.sketchfab.com/v3/models?user=miyalana"


class Model3DThumbnail(TypedDict):
    src: str
    width: int
    height: int
    lod: int


class Model3DEntryData(TypedDict):
    title: str
    uid: str
    embedUrl: str
    viewerUrl: str
    apiUrl: str
    publishedAt: str
    description: str
    vertexCount: int
    faceCount: int
    thumbnails: list[Model3DThumbnail]
    tags: list[str]


class Model3DEntry(TypedDict):
    id: str
    data: Model3DEntryData


def slugify(s: str) -> str:
    stripped = s.strip()
    no_special_characters = re.sub(r"[^A-Za-z0-9 _-]", "", stripped)
    spaces_to_underscores = re.sub(r"\s+", "_", no_special_characters)
    no_surrounding_separators = re.sub(r"^-+|-+$", "", spaces_to_underscores)
    return no_surrounding_separators


kebab_case_to_human_readable: Callable[[str], str] = lambda s: " ".join(
    word[:1].upper() + word[1:] for word in s.split("-")
)


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


def get_models():
    headers = {"Content-Type": "application/json"}

    try:
        response = requests.get(SKETCHFAB_ENDPOINT, headers)
    except RequestException as e:
        print(f"Sketchfab API error: '${e}'")
        raise

    data = response.json()

    return data["results"]


def convert_data(model: Any) -> tuple[str, Model3DEntryData]:
    # space will get converted to underscore
    model_id = slugify(f"{model['name']} {model['uid']}")
    model_published_at = (
        datetime.fromisoformat(model["publishedAt"])
        .replace(tzinfo=timezone.utc)  # specifies internal format is UTC
        .isoformat()
    )
    model_description = markdown.markdown(
        model["description"], extensions=["extra", "sane_lists"]
    )

    model_thumbnails: list[Model3DThumbnail] = []
    if (thumbnails := model["thumbnails"]) and (images := thumbnails["images"]):
        images: list
        sorted_images = sorted(images, key=lambda t: t["width"], reverse=True)
        model_thumbnails = [
            {
                "src": thumb["url"],
                "width": thumb["width"],
                "height": thumb["height"],
                "lod": idx,
            }
            for idx, thumb in enumerate(sorted_images)
        ]

    model_tags: list[str] = [tag["slug"] for tag in (model["tags"] or [])]
    model_tags.extend(
        [
            slugify(kebab_case_to_human_readable(category["name"]))
            for category in model["categories"] or []
        ]
    )

    data: Model3DEntryData = {
        "title": model["name"],
        "uid": model["uid"],
        "embedUrl": model["embedUrl"],
        "viewerUrl": model["viewerUrl"],
        "apiUrl": model["uri"],
        "publishedAt": model_published_at,
        "description": model_description,  # convert to html here
        "thumbnails": model_thumbnails,
        "vertexCount": model["vertexCount"],
        "faceCount": model["faceCount"],
        "tags": model_tags,
    }

    return (model_id, data)


def main():
    models = get_models()

    entries: dict[str, Model3DEntryData] = {}

    for model in models:
        id, data = convert_data(model)
        entries |= {id: data}

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(
        json.dumps(entries, sort_keys=False),
        newline="\n",
    )

    format_code(OUTPUT_PATH)


if __name__ == "__main__":
    main()
