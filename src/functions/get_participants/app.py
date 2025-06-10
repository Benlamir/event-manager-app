import json
import os
import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal # Import the Decimal type

# --- START: NEW JSON ENCODER ---
# This helper class teaches the JSON library how to handle Decimal objects
class CustomJsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            # If the number has no fractional part, convert to int, otherwise float
            if obj % 1 == 0:
                return int(obj)
            else:
                return float(obj)
        # Let the base class default method raise the TypeError
        return super(CustomJsonEncoder, self).default(obj)
# --- END: NEW JSON ENCODER ---


TABLE_NAME = os.environ.get("TABLE_NAME")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    try:
        path_parameters = event.get("pathParameters", {})
        event_id = path_parameters.get("event_id") # Corrected to use underscore

        if not event_id:
            return {"statusCode": 400, "body": json.dumps({"message": "event_id is missing from the path"})}

        # Query DynamoDB for all items with the given eventId as the Partition Key
        response = table.query(
            KeyConditionExpression=Key('PK').eq(f"EVENT#{event_id}")
        )

        # The response['Items'] will contain the event metadata AND all participants
        items = response.get("Items", [])

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            # Use our new custom encoder to handle the Decimal type
            "body": json.dumps(items, cls=CustomJsonEncoder)
        }

    except Exception as e:
        print(f"Error: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal Server Error"})
        }