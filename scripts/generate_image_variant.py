import argparse
from pathlib import Path
from PIL import Image, ImageSequence, ImageFilter
from os import stat
from dataclasses import dataclass, fields

KB = 1024.0
MB = KB * KB

PATH_MAX = 60


@dataclass
class ResizeResult:
    size: str = ""
    frame_duration: int = 0
    frame_count: int = 0
    total_duration: int = 0

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
        default="thumbnail.*",
    )

    parser.add_argument(
        "-w",
        "--width",
        help="Width of variant",
        type=int,
        default=400,
    )

    parser.add_argument(
        "-i",
        "--skip_interval",
        help="Frames to skip in animated images",
        type=int,
        default=2,
    )

    parser.add_argument(
        "-f",
        "--target_fps",
        help="Target FPS of animated images",
        type=int,
        default=12,
    )

    parser.add_argument(
        "-o", "--overwrite", help="Overwrite original image", action="store_true"
    )

    return parser.parse_args()


def parse_size(st_size: int) -> str:
    is_MB = st_size > MB
    suffix = "MB" if is_MB else "KB"
    size: float = st_size / (MB if is_MB else KB)
    return f"{size:.2f}{suffix}"


def resize_sequence(
    in_path: Path,
    out_path: Path,
    width: int,
    skip_interval: int,
    target_fps: int,
) -> ResizeResult:
    target_duration = 1000 // target_fps
    target_duration *= skip_interval

    with Image.open(in_path) as img:
        durations: list[int] = []
        frames: list[Image.Image] = []

        for frame in ImageSequence.Iterator(img):
            duration = frame.info.get("duration", 0)
            durations.append(duration)

            resized_frame = frame.copy()  # resize here
            resized_frame.thumbnail((width, 10_000), Image.Resampling.LANCZOS)

            frames.append(resized_frame)

        num_frames = len(frames)

        timestamps: list[int] = []
        time = 0
        for dur in durations:
            # convert durations to monotonically increasing timestamps
            timestamps.append(time)
            time += dur
        total_time = time

        normalized_frames: list[Image.Image] = []

        sample_time = 0
        i = 0
        while sample_time < total_time:
            while i + 1 < num_frames and timestamps[i + 1] <= sample_time:
                i += 1  # increment until next timestamp will be greater than `sample_time`

            normalized_frames.append(frames[i])
            sample_time += target_duration

    normalized_frames[0].save(
        out_path,
        format="WEBP",
        save_all=True,
        append_images=normalized_frames[1:],
        loop=0,  # loop indefinitely
        duration=target_duration,
        optimize=True,
        quality=60,
        method=6,
        minimize_size=True,
        allow_mixed=True,
        alpha_quality=75,
    )

    frame_count = len(normalized_frames)
    return ResizeResult(
        frame_duration=target_duration,
        frame_count=frame_count,
        total_duration=target_duration * frame_count,
    )


def resize(in_path: Path, out_path: Path, width: int, *args) -> ResizeResult:
    img = Image.open(in_path)

    if getattr(img, "is_animated", False):
        return resize_sequence(in_path, out_path, width, *args)
    # ensure height is not the limiting dimension
    img.thumbnail((width, 10_000), Image.Resampling.LANCZOS)

    format: str = in_path.suffix.removeprefix(".").upper()
    img.save(out_path, format, optimize=True, method=6)

    return ResizeResult()


def main(
    root_dir: Path,
    filename_pattern: str,
    width: int,
    skip_interval: int,
    target_fps: int,
    overwrite: bool,
):
    files = list(Path(root_dir).resolve().rglob(filename_pattern))

    print(f"Detected {len(files)} files.")

    for file in files:
        try:
            Image.open(file).verify()
        except Exception as e:
            print(f"File Path: {file}\nError Message: {str(e)}")
            continue

        out_path = (
            file if overwrite else Path(f"{file.with_suffix('')}_{width}w{file.suffix}")
        )

        result = resize(file, out_path, width, skip_interval, target_fps)

        if out_path.exists():
            result.size = parse_size(stat(out_path).st_size)

        print(f"...{str(out_path)[-PATH_MAX:]}: {result}")


if __name__ == "__main__":
    args = get_args()

    main(
        args.root_dir,
        args.filename_pattern,
        args.width,
        args.skip_interval,
        args.target_fps,
        args.overwrite,
    )
