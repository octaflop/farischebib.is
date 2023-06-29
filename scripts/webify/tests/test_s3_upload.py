import asyncio
import os

import pytest
import aioboto3 as boto3
import unittest.mock as mock
from moto import mock_s3
from webify.util.s3_upload import upload_to_s3


@pytest.fixture
def s3_client():
    with mock_s3():
        s3 = boto3.client('s3', region_name='us-west-1')
        yield s3


@pytest.fixture
def setup_env_vars():
    os.environ['AWS_ACCESS_KEY_ID'] = 'fake_access_key'
    os.environ['AWS_SECRET_ACCESS_KEY'] = 'fake_secret_key'
    os.environ['AWS_REGION'] = 'us-east-1'
    os.environ['S3_BUCKET_NAME'] = 'test_bucket'
    os.environ['S3_FOLDER_NAME'] = 'test_folder'


@mock.patch('aioboto3.Session.client')
def test_upload_to_s3(mock_client, setup_env_vars, s3_client):
    # setup the moto s3 mock
    s3_client.create_bucket(Bucket='test_bucket')

    # Call your function that uploads to s3
    file_path = 'path_to_your_local_file'
    s3_path = 'path_to_your_s3_folder'
    bucket = 'your_bucket_name'

    asyncio.run(upload_to_s3(bucket, file_path, s3_path))

    # Check if the upload_file method was called with the correct arguments
    mock_client.upload_file.assert_called_with(file_path, bucket, s3_path)