import json
import os
import boto3

TABLE_NAME = os.environ.get("TABLE_NAME")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    """
    Handles deleting an event and all its associated participants.
    Method: DELETE
    Path: /events/{event_id}
    """
    print("--- DeleteEventFunction starting ---")
    try:
        # Get the event_id from the path parameter
        event_id = event["pathParameters"]["event_id"]
        if not event_id:
            return {"statusCode": 400, "body": json.dumps({"message": "event_id is required"})}

        pk_to_delete = f"EVENT#{event_id}"
        print(f"Attempting to delete all items for PK: {pk_to_delete}")

        # 1. Find all items associated with the event (metadata + participants)
        response = table.query(KeyConditionExpression=boto3.dynamodb.conditions.Key('PK').eq(pk_to_delete))
        items_to_delete = response.get("Items", [])

        if not items_to_delete:
            print(f"No items found for event {event_id}. Nothing to delete.")
            return {"statusCode": 404, "body": json.dumps({"message": "Event not found"})}

        # 2. Use Batch Writer to delete all found items efficiently
        with table.batch_writer() as batch:
            for item in items_to_delete:
                batch.delete_item(Key={"PK": item["PK"], "SK": item["SK"]})
        
        print(f"Successfully deleted {len(items_to_delete)} items for event {event_id}.")
        print("--- DeleteEventFunction finished successfully ---")

        return {
            "statusCode": 200,
            "body": json.dumps({"message": f"Event {event_id} and all associated data deleted successfully."})
        }

    except Exception as e:
        print(f"!!! DELETE_EVENT_FUNCTION_ERROR: {e} !!!")
        return {"statusCode": 500, "body": json.dumps({"message": "An error occurred", "error": str(e)})}