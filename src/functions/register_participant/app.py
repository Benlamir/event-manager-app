import json
import os
import boto3
import uuid
from datetime import datetime

TABLE_NAME = os.environ.get("TABLE_NAME")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    try:
        path_parameters = event.get("pathParameters", {})
        event_id = path_parameters.get("event_id")

        if not event_id:
            return {"statusCode": 400, "body": json.dumps({"message": "eventId is missing from the path"})}

        body = json.loads(event.get("body", "{}"))
        in_game_name = body.get("inGameName")

        if not in_game_name:
            return {"statusCode": 400, "body": json.dumps({"message": "Missing required field: inGameName"})}

        participant_id = str(uuid.uuid4())
        
        item_to_create = {
            "PK": f"EVENT#{event_id}",
            "SK": f"PARTICIPANT#{participant_id}",
            "InGameName": in_game_name,
            "DiscordUsername": body.get("discordUsername", ""),
            "Status": "Awaiting Confirmation",
            "RegisteredAt": datetime.utcnow().isoformat()
        }

        table.put_item(Item=item_to_create)

        return {
            "statusCode": 201,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({
                "message": "Participant registered successfully",
                "participantId": participant_id,
                "eventID": event_id
            })
        }

    except Exception as e:
        print(f"Error: {e}")
        return {"statusCode": 500, "body": json.dumps({"message": "Internal Server Error"})}