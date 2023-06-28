# this script will take a directory of images under `imgs` (by default) and put a set of "thumbs" under the `imgs` directory
import os
from pathlib import Path
from PIL import Image, UnidentifiedImageError, ExifTags
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


def generate_placeholder(input_image: str) -> str:
    tqdm.write(
        climage.convert(
            input_image,
            is_unicode=False,
            is_truecolor=True,
            is_256color=False,
            width=120,
        )
    )
    img = Image.open(input_image)
    img = prep_image(img)
    buffered = BytesIO()
    wpercent = MIN_WIDTH / float(img.size[0])
    hsize = int((float(img.size[1]) * float(wpercent)))
    img = img.resize((MIN_WIDTH, hsize), Image.ANTIALIAS)
    img.save(buffered, format="JPEG", optimize=True, quality=0)
    img_str = base64.b64encode(buffered.getvalue())
    return img_str


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


def webify(gallery_folder=FULL_GALLERY_FOLDER, auto_fill=False, overwrite=False):
    output_folder_full = os.path.join(gallery_folder, DEFAULT_OUTPUT)
    for current_path, directories, files in tqdm(
        os.walk(gallery_folder), desc="Checking out your art 🧑‍🎨"
    ):
        tqdm.write(f"{current_path}: Current Path")
        if current_path.startswith(output_folder_full):
            continue
        for file in tqdm(files, desc="Resizing"):
            tqdm.write(f"Opening {current_path} {file} in gallery {gallery_folder}")
            try:
                image = Image.open(Path(current_path, file))
            except UnidentifiedImageError as e:
                print(f"Unable to scale {file}: {e}")
                continue
            rel_path = os.path.relpath(current_path, gallery_folder)
            output_folder = Path(gallery_folder, DEFAULT_OUTPUT, rel_path)
            for width in IMG_SCALE_WIDTHS:
                img_path, width, hsize = frame_image(
                    image,
                    basename=os.path.splitext(file)[0],
                    width=width,
                    quality=JPEG_QUALITY,
                    output_folder=output_folder,
                )
                tqdm.write(f"{img_path} written for {file} ({width}x{hsize})")


if __name__ == "__main__":
    webify()
