import json
import boto3
from datetime import datetime
from content_parser import *
from question_checker import *
import statsmodels.formula as smf
import numpy as np
import pandas as pd


def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    method = event.get('httpMethod', {})
    if method == 'GET':
        path = event.get('path')
        return content_parser(path)
    if method == 'POST':
        
        timestamp = str(datetime.utcnow().timestamp())

        table = dynamodb.Table('loggingTable')
        
        log = {}
    
        log['itemId'] = str(timestamp) #str(uuid.uuid1()) for more granular keys
        log['createdAt'] = timestamp
    

        # write logData to dynamoDB
        table.put_item(Item=log)
        
        
        postReq = json.loads(event.get('body', {}))
        return question_checker(postReq)
        
