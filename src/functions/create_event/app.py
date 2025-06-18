import json
import os
import boto3
import uuid
from datetime import datetime

TABLE_NAME = os.environ.get("TABLE_NAME")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)
EVENT_LIMIT = 10

def lambda_handler(event, context):
    """
    Handles creating a new event, but only if the event limit has not been reached.
    """
    print("--- CreateEventFunction starting ---")
    try:
        # --- Check current event count before proceeding ---
        scan_response = table.scan(
            FilterExpression=boto3.dynamodb.conditions.Attr('SK').eq('METADATA'),
            Select='COUNT'
        )
        event_count = scan_response.get('Count', 0)
        print(f"Current event count: {event_count}")

        if event_count >= EVENT_LIMIT:
            message = f"Event limit of {EVENT_LIMIT} reached. Please delete an old event before creating a new one."
            print(f"Validation failed: {message}")
            return {
                "statusCode": 403, # 403 Forbidden is appropriate here
                "body": json.dumps({"message": message})
            }

        # Load the request body from the event
        body = json.loads(event.get("body", "{}"))
        print(f"Received body: {body}")

        # --- Basic Validation ---
        required_fields = ["eventName", "eventDate", "capacity"]
        if not all(field in body for field in required_fields):
            print("Validation failed: Missing required fields.")
            return {"statusCode": 400, "body": json.dumps({"message": "Missing required fields"})}

        # --- Prepare the data for DynamoDB ---
        event_id = str(uuid.uuid4())
        item_to_create = {
            "PK": f"EVENT#{event_id}",
            "SK": "METADATA",
            "EventName": body["eventName"],
            "EventDate": body["eventDate"],
            "Capacity": int(body["capacity"]),
            "Description": body.get("description", ""),
            "CreatedAt": datetime.utcnow().isoformat()
        }

        print(f"Attempting to write to DynamoDB. Table: {TABLE_NAME}, Item: {item_to_create}")

        # --- Save the data to DynamoDB ---
        db_response = table.put_item(Item=item_to_create)
        
        print(f"DynamoDB put_item response: {db_response}")
        if db_response.get("ResponseMetadata", {}).get("HTTPStatusCode") != 200:
            raise Exception(f"DynamoDB put_item failed with status code: {db_response.get('ResponseMetadata', {}).get('HTTPStatusCode')}")

        print("--- CreateEventFunction finished successfully ---")

        return {
            "statusCode": 201,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({
                "message": "Event metadata created successfully",
                "eventId": event_id
            })
        }

    except Exception as e:
        print(f"!!! CREATE_EVENT_FUNCTION_ERROR: {e} !!!")
        return {"statusCode": 500, "body": json.dumps({"message": "An error occurred", "error": str(e)})}