import json
import os
import boto3
from decimal import Decimal # Import the Decimal type

# --- START: NEW JSON ENCODER ---
# This helper class teaches the JSON library how to handle Decimal objects
class CustomJsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            if obj % 1 == 0:
                return int(obj)
            else:
                return float(obj)
        return super(CustomJsonEncoder, self).default(obj)
# --- END: NEW JSON ENCODER ---


TABLE_NAME = os.environ.get("TABLE_NAME")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    try:
        response = table.scan()
        all_items = response.get("Items", [])
        
        event_metadata_items = [item for item in all_items if item.get("SK") == "METADATA"]

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            # Use our new custom encoder to handle the Decimal type
            "body": json.dumps(event_metadata_items, cls=CustomJsonEncoder)
        }
    except Exception as e:
        print(f"Error: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal Server Error"})
        }