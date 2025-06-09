import json
import os
import boto3
import uuid
from datetime import datetime

# Get the table name from the environment variable set in template.yaml
TABLE_NAME = os.environ.get("TABLE_NAME")
# Create a DynamoDB client
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    """
    Handles creating a new event.
    Method: POST
    Path: /events
    Body: { "eventName": "Community Tournament", "eventDate": "2025-08-15T19:00:00Z", "capacity": 64, "description": "Weekly community games!" }
    """
    print("--- CreateEventFunction starting ---")
    try:
        # Load the request body from the event
        body = json.loads(event.get("body", "{}"))
        print(f"Received body: {body}")

        # --- Basic Validation ---
        required_fields = ["eventName", "eventDate", "capacity"]
        if not all(field in body for field in required_fields):
            print("Validation failed: Missing required fields.")
            return {
                "statusCode": 400,
                "body": json.dumps({"message": "Missing required fields"})
            }

        # --- Prepare the data for DynamoDB ---
        event_id = str(uuid.uuid4()) # Generate a unique ID for the event

        item_to_create = {
            "PK": f"EVENT#{event_id}",  # Partition Key: Identifies the event
            "SK": "METADATA",           # Sort Key: Differentiates item types under the same event
            "EventName": body["eventName"],
            "EventDate": body["eventDate"],
            "Capacity": int(body["capacity"]),
            "Description": body.get("description", ""), # Optional field
            "CreatedAt": datetime.utcnow().isoformat()
        }

        print(f"Attempting to write to DynamoDB. Table: {TABLE_NAME}, Item: {item_to_create}")

        # --- Save the data to DynamoDB ---
        db_response = table.put_item(Item=item_to_create)

        print(f"DynamoDB put_item response: {db_response}")

        # Check the HTTP status code from the database response
        if db_response.get("ResponseMetadata", {}).get("HTTPStatusCode") != 200:
            raise Exception(f"DynamoDB put_item failed with status code: {db_response.get('ResponseMetadata', {}).get('HTTPStatusCode')}")

        print("--- CreateEventFunction finished successfully ---")

        # --- Return a success response ---
        return {
            "statusCode": 201, # 201 Created is the standard for a successful POST
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "message": "Event metadata created successfully",
                "eventId": event_id,
                "dynamoDBResponse": db_response.get("ResponseMetadata") # Return the DB response for debugging
            })
        }

    except Exception as e:
        # Log the full error to CloudWatch
        print(f"!!! CREATE_EVENT_FUNCTION_ERROR: {e} !!!")
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "An error occurred", "error": str(e)})
        }