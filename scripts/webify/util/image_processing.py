import asyncio
import os

from PIL import Image, UnidentifiedImageError
from pathlib import Path

from tqdm import tqdm

DEFAULT_INPUT = "imgs"
DEFAULT_OUTPUT = "thumbs"
FULL_GALLERY_FOLDER = Path(os.path.join(os.getcwd(), DEFAULT_INPUT))
# TODO: Make templates handle this scale
# IMG_SCALE_WIDTHS = (3000, 2560, 1920, 1280, 1024)
IMG_SCALE_WIDTHS = (3000, 1920,)
JPEG_QUALITY = 97


def prep_image(image: Image):
    exif = image.getexif()
    if exif is None:
        return image
    okey = "Orientation"

    try:
        if exif[okey] == 3:
            image = image.rotate(180, expand=True)
        elif exif[okey] == 6:
            image = image.rotate(270, expand=True)
        elif exif[okey] == 8:
            image = image.rotate(90, expand=True)
    except KeyError:
        return image
    return image



def frame_image(
    img: Image, basename: str, width=640, quality=JPEG_QUALITY, output_folder="_thumbs"
) -> tuple[str, int, int]:
    img = prep_image(img)
    wpercent = width / float(img.size[0])
    hsize = int((float(img.size[1]) * float(wpercent)))
    img = img.resize((width, hsize), Image.ANTIALIAS)
    output_image = f"{basename}_{width}.jpg"
    try:
        os.mkdir(output_folder)
    except FileExistsError:
        pass
    save_path = os.path.join(output_folder, output_image)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    img.save(save_path, "JPEG", subsampling=0, quality=quality)
    return output_image, width, hsize
async def process_image(file, width, current_path, gallery_folder):
    try:
        with Image.open(Path(current_path, file)) as image:
            rel_path = os.path.relpath(current_path, gallery_folder)
            output_folder = Path(gallery_folder, DEFAULT_OUTPUT, rel_path)
            loop = asyncio.get_event_loop()
            img_path, width, hsize = await loop.run_in_executor(executor, frame_image, image, os.path.splitext(file)[0], width, JPEG_QUALITY, output_folder)
            tqdm.write(f"{img_path} written for {file} ({width}x{hsize})")
    except UnidentifiedImageError as e:
        tqdm.write(f"Unable to scale {file}: {e}")
