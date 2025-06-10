import json
import os
import boto3

TABLE_NAME = os.environ.get("TABLE_NAME")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    """
    Handles listing all events by scanning the table and filtering for metadata.
    NOTE: A scan is inefficient on very large tables. For a production app with
    many users, a more advanced query with a secondary index would be better.
    For our MVP, this is perfectly fine.
    """
    try:
        # Use the scan operation to get all items from the table
        response = table.scan()
        all_items = response.get("Items", [])

        # Filter the results to only include the event metadata items
        event_metadata_items = [item for item in all_items if item.get("SK") == "METADATA"]

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(event_metadata_items)
        }

    except Exception as e:
        print(f"Error: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal Server Error"})
        }