import json
import os
import boto3 
from datetime import datetime
from content_parser import *
from question_checker import *

dynamodb = boto3.resource('dynamodb')

def save_logs(logData):
    timestamp = str(datetime.utcnow().timestamp())

    table = dynamodb.Table('lambdalogs')
    
    log = logData.copy() 
    log['logId'] = str(timestamp) 
    log['createdAt'] = timestamp

    table.put_item(Item=log)

def lambda_handler(event, context):
    method = event.get('httpMethod', {})
    if method == 'GET':
        path = event.get('path')
        return content_parser(path)
    if method == 'POST':
        postReq = json.loads(event.get('body', {})) 
        save_logs(postReq)
        return question_checker(postReq)
        