import boto3
import pandas as pd
from io import StringIO
from botocore.exceptions import ClientError
import os

# Get bucket name from environment variable or use default
BUCKET_NAME = os.getenv('AWS_BUCKET_NAME', 'f1-2018-data')

# Initialize S3 client with optional endpoint URL for local testing
s3 = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION', 'us-east-1')
)

def read_csv_from_s3(key: str) -> pd.DataFrame:
    """
    Read a CSV file from S3 and return it as a pandas DataFrame
    """
    try:
        obj = s3.get_object(Bucket=BUCKET_NAME, Key=key)
        data = obj['Body'].read().decode('utf-8')
        return pd.read_csv(StringIO(data))
    except ClientError as e:
        error_code = e.response.get('Error', {}).get('Code', 'Unknown')
        if error_code == 'NoSuchKey':
            raise FileNotFoundError(f"File {key} not found in bucket {BUCKET_NAME}")
        elif error_code == 'NoSuchBucket':
            raise FileNotFoundError(f"Bucket {BUCKET_NAME} not found")
        else:
            raise Exception(f"S3 error: {str(e)}")
    except Exception as e:
        raise Exception(f"Error reading file {key}: {str(e)}")

def test_s3_connection() -> bool:
    """
    Test the S3 connection by listing objects in the bucket
    """
    try:
        response = s3.list_objects_v2(Bucket=BUCKET_NAME, MaxKeys=1)
        print("Successfully connected to S3!")
        print(f"Bucket contents: {response.get('Contents', [])}")
        return True
    except Exception as e:
        print(f"Error connecting to S3: {e}")
        return False

if __name__ == "__main__":
    test_s3_connection()