async def upload_to_s3(bucket, file_path, s3_path):
    session = aioboto3.Session()
    async with session.client('s3') as s3_client:
        await s3_client.upload_file(file_path, bucket, s3_path)

