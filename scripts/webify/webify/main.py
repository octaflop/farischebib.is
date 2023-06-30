import os
import argparse
import asyncio
import tqdm
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from util.image_processing import process_image, DEFAULT_INPUT, DEFAULT_OUTPUT, JPEG_QUALITY, FULL_GALLERY_FOLDER, IMG_SCALE_WIDTHS
from util.s3_upload import upload_to_s3

executor = ThreadPoolExecutor(max_workers=10)

def process_directory(current_path, files, gallery_folder):
    tasks = []
    for file in tqdm(files, desc=f"Strolling through {current_path}"):
        if current_path.startswith(os.path.join(gallery_folder, DEFAULT_OUTPUT)):
            tqdm.write(f"Skipping {current_path} since it is our output ({DEFAULT_OUTPUT})")
            continue
        for width in IMG_SCALE_WIDTHS:
            tqdm.write(f"Processing {file}")
            tasks.append(process_image(file, width, current_path, gallery_folder))
    return tasks
async def webify(gallery_folder=FULL_GALLERY_FOLDER):
    tasks = []
    for current_path, directories, files in os.walk(gallery_folder):
        print(f"{current_path}: Current Path")
        tasks.extend(process_directory(current_path, directories, files, gallery_folder))
    await asyncio.gather(*tasks)

    s3_bucket = os.getenv('S3_BUCKET_NAME')
    s3_folder = os.getenv('S3_FOLDER_NAME')

    # After the files are processed, upload them to S3
    for current_path, _, files in os.walk(DEFAULT_OUTPUT):
        for file in files:
            local_file_path = os.path.join(current_path, file)
            s3_file_path = os.path.join(s3_folder, file)
            await upload_to_s3(s3_bucket, local_file_path, s3_file_path)

def parse_args():
    parser = argparse.ArgumentParser(description="Resize images.")
    parser.add_argument("--input_dir", default=DEFAULT_INPUT, help="Folder with images to be resized.")
    parser.add_argument("--output_dir", default=DEFAULT_OUTPUT, help="Folder where the resized images will be saved.")
    parser.add_argument("--quality", type=int, default=JPEG_QUALITY, help="Quality of the resized images.")
    return parser.parse_args()

if __name__ == "__main__":
    args = parse_args()
    FULL_GALLERY_FOLDER = Path(os.path.join(os.getcwd(), args.input_dir))
    DEFAULT_OUTPUT = args.output_dir
    JPEG_QUALITY = args.quality
    asyncio.run(webify(FULL_GALLERY_FOLDER, executor))
