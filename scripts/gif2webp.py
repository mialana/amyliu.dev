import os
from PIL import Image
import argparse
from pathlib import Path

def convert_gif_to_webp(gif_path, max_bytes=1 * 1024 * 1024):
    webp_path = os.path.splitext(gif_path)[0] + ".webp"

    try:
        with Image.open(gif_path) as im:
            # Animated vs static
            save_kwargs = {
                "format": "WEBP",
                "save_all": getattr(im, "is_animated", False),
                "method": 6,  # compression effort (0=fast, 6=best)
            }

            quality = 100
            while quality >= 30:
                print(f"trying quality of {quality} for {gif_path}...")
                # Save temp file with current quality
                im.save(webp_path, quality=quality, **save_kwargs)
                size = os.path.getsize(webp_path)

                if size <= max_bytes:
                    print(
                        f"Converted: {gif_path} -> {webp_path} ({size/1024:.1f} KiB, q={quality})"
                    )
                    return
                else:
                    quality -= 10  # step down compression

            print(f"WARNING: {gif_path} still > {max_bytes/1024:.0f} KiB at q=30")

    except Exception as e:
        print(f"Failed to convert {gif_path}: {e}")


finished = []


def walk_and_convert(root=".", max_bytes=5 * 1024 * 1024):
    print(root)
    for dirpath, _, filenames in os.walk(root):
        for filename in filenames:
            if filename.lower().endswith(".gif"):

                convert = True
                for f in finished:
                    if f in filename:
                        convert = False

                if convert:
                    gif_path = os.path.join(dirpath, filename)
                    convert_gif_to_webp(gif_path, max_bytes)
                    os.remove(os.path.join(dirpath, filename))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('dir', type=Path, help='Path to directory to convert')

    args = parser.parse_args()

    walk_and_convert(args.dir)
