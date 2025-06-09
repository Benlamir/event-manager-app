import json
import os
import boto3
from boto3.dynamodb.conditions import Key

TABLE_NAME = os.environ.get("TABLE_NAME")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    try:
        path_parameters = event.get("pathParameters", {})
        event_id = path_parameters.get("event_id")

        if not event_id:
            return {"statusCode": 400, "body": json.dumps({"message": "eventId is missing from the path"})}

        # Query DynamoDB for all items with the given eventId as the Partition Key
        response = table.query(
            KeyConditionExpression=Key('PK').eq(f"EVENT#{event_id}")
        )

        # The response['Items'] will contain the event metadata AND all participants
        items = response.get("Items", [])

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(items)
        }

    except Exception as e:
        print(f"Error: {e}")
        return {"statusCode": 500, "body": json.dumps({"message": "Internal Server Error"})}