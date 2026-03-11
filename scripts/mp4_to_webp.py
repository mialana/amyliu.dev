import argparse
from pathlib import Path
from PIL import Image, ImageSequence, ImageFilter
from moviepy import VideoFileClip
from os import stat
from dataclasses import dataclass, fields

KB = 1024.0
MB = KB * KB

PATH_MAX = 60


@dataclass
class ConvertResult:
    size: str = ""
    duration: int = 0
    frame_count: int = 0

    def __str__(self):
        return ", ".join(
            [
                f"{fld.name}={getattr(self, fld.name)}"
                for fld in fields(self)
                if getattr(self, fld.name)
            ]
        )


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
        default="*.mp4",
    )

    parser.add_argument(
        "-w",
        "--width",
        help="Width of new WEBP",
        type=int,
        default=800,
    )

    parser.add_argument(
        "-f",
        "--fps",
        help="FPS of new WEBP",
        type=int,
        default=12,
    )

    return parser.parse_args()


def parse_size(st_size: int) -> str:
    is_MB = st_size > MB
    suffix = "MB" if is_MB else "KB"
    size: float = st_size / (MB if is_MB else KB)
    return f"{size:.2f}{suffix}"


def convert(in_path: Path, out_path: Path, width: int, fps: int) -> ConvertResult:

    duration = 1000 // fps

    frames = []

    clip = VideoFileClip(
        in_path, target_resolution=(width, 10_000), resize_algorithm="lanczos"
    )

    for frame in clip.iter_frames(fps=fps, dtype="uint8"):
        frames.append(Image.fromarray(frame))

    frames[0].save(
        out_path,
        format="WEBP",
        save_all=True,
        append_images=frames[1:],
        loop=0,  # loop indefinitely
        duration=duration,
        optimize=True,
        quality=70,
        method=6,
        minimize_size=True,
        allow_mixed=True,
        alpha_quality=85,
    )

    return ConvertResult(duration=duration, frame_count=clip.n_frames)


def main(root_dir: Path, filename_pattern: str, width: int, fps: int):
    files = list(Path(root_dir).resolve().rglob(filename_pattern))

    print(f"Detected {len(files)} files.")

    for file in files:
        out_path = file.with_suffix(".webp")

        try:
            result = convert(file, out_path, width, fps)

        except Exception as e:
            print(f"File Path: {file}\nError Message: {str(e)}")
            continue

        result.size = parse_size(stat(out_path).st_size)
        print(f"...{str(out_path)[-PATH_MAX:]}: {result}")


if __name__ == "__main__":
    args = get_args()

    main(args.root_dir, args.filename_pattern, args.width, args.fps)
