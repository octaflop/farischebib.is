
import pytest
import subprocess
import os

import pytest
from PIL import Image
from io import BytesIO
from webify.util.image import prep_image, frame_image

@pytest.mark.parametrize("input_image, expected_size", [
    ("test_image_1.jpg", (3000, 2000)),
    ("test_image_2.jpg", (1920, 1080)),
])
def test_frame_image(input_image, expected_size):
    with open(input_image, "rb") as f:
        img = Image.open(f)
        prepped_img = prep_image(img)
        _, width, height = frame_image(prepped_img, os.path.splitext(input_image)[0], width=expected_size[0])
        assert (width, height) == expected_size


def test_webify():
    # Set your arguments
    input_dir = "my_images"
    output_dir = "my_resized_images"
    quality = 80

    # Run your script with the arguments
    process = subprocess.run(['python', 'your_script.py', '--input_dir', input_dir, '--output_dir', output_dir, '--quality', str(quality)], capture_output=True, text=True)

    # Check if the script ran successfully
    assert process.returncode == 0

    # You can also check if the output directory was created
    assert os.path.exists(output_dir)

    # And if the output directory is not empty
    assert len(os.listdir(output_dir)) > 0

    # If your script prints output, you can check it too
    # assert "expected output" in process.stdout
