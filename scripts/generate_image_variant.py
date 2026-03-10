import argparse
from pathlib import Path
from PIL import Image, ImageSequence
from os import stat

KB = 1024.0
MB = KB * KB


def get_args():
    parser = argparse.ArgumentParser(
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )

    parser.add_argument(
        "-r",
        "--root_dir",
        help="Directory to walk",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "src" / "content" / "projects",
    )

    parser.add_argument(
        "-p",
        "--filename_pattern",
        help="Filename pattern",
        type=str,
        default="thumbnail.*",
    )

    parser.add_argument(
        "-w",
        "--width",
        help="Width of variant",
        type=int,
        default="384",
    )

    return parser.parse_args()


def parse_size(st_size: int) -> str:
    is_MB = st_size > MB
    suffix = "MB" if is_MB else "KB"
    size: float = st_size / (MB if is_MB else KB)
    return f"{size:.2f}{suffix}"


def resize_sequence(in_path: Path, out_path: Path, width: int) -> int:
    with Image.open(in_path) as img:
        frames: list[Image.Image] = []
        for frame in ImageSequence.Iterator(img):
            resized_frame = frame.copy()
            resized_frame.thumbnail(
                (width, 1e4)
            )  # ensure height is not the limiting dimension

            frames.append(resized_frame)

        format: str = in_path.suffix.removeprefix(".").upper()

        duration = img.info.get("duration", 0)

        frames[0].save(
            out_path,
            format=format,
            save_all=True,
            append_images=frames[1:],
            loop=0,  # loop indefinitely
            duration=duration,  # keep same frame duration
            optimize=True,
        )

    return duration


def resize(in_path: Path, out_path: Path, width: int) -> int:
    img = Image.open(in_path)

    if getattr(img, "is_animated", False):
        return resize_sequence(in_path, out_path, width)
    img.thumbnail((width, 1e4))  # ensure height is not the limiting dimension

    format: str = in_path.suffix.removeprefix(".").upper()
    img.save(out_path, format)

    return 0


def main(root_dir: Path, filename_pattern: str, width: int):
    files = list(Path(root_dir).resolve().rglob(filename_pattern))

    print(f"Detected {len(files)} files.")

    for file in files:
        try:
            Image.open(file).verify()
        except Exception as e:
            print(f"File Path: {file}\nError Message: {str(e)}")
            continue

        out_path = Path(f"{file.with_suffix('')}_{width}w{file.suffix}")

        duration = resize(file, out_path, width)

        size = parse_size(stat(out_path).st_size)

        print(f"{str(out_path)}: {size=}, {duration=}")


if __name__ == "__main__":
    args = get_args()

    main(args.root_dir, args.filename_pattern, args.width)
