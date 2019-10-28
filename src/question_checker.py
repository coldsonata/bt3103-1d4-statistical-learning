from code_runner import *
import json

def question_checker(postReq):
    if "userToken" in postReq:
        return alset_api(postReq)
    question_id = postReq["questionId"]
    if question_id == "1a":
        return question_1a(postReq)
    elif question_id == "1b":
        return question_1b(postReq)
    elif question_id == "2b":
        return question_2b(postReq)

def alset_api(postReq):
    # Retrieve the contents from the request
    editable = postReq["editable"]["0"].strip()
    hidden = postReq["hidden"]["0"]
    shown = postReq["shown"]["0"]
    userToken = postReq["userToken"]
    
    # Calculate different feedbacks
    allFeedback = {
      "isComplete": True,
      "jsonFeedback": { "code": userToken },
      "htmlFeedback": "<div>{}</div>".format(shown),
      "textFeedback": shown
    }
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        "body":  json.dumps({
            "isComplete": allFeedback["isComplete"],
            "jsonFeedback": allFeedback["jsonFeedback"],
            "htmlFeedback": allFeedback["htmlFeedback"],
            "textFeedback": allFeedback["textFeedback"]
        })
    }

def question_1a(postReq):
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        "body":  json.dumps({
            "correct": True
        })
    }

def question_1b(postReq):
    answer = json.loads(postReq["answer"])
    expected = {'response': 'mpg', 'predictors': ['Intercept', 'acceleration']}
    gotten = get_output(answer, "import scipy\nimport pandas as pd\ndf=pd.read_csv('./data/dataset.csv')", "", '{"response":ols_result.model.endog_names, "predictors":ols_result.model.exog_names}')
    gotten = json.loads(gotten)
    solved = (expected == gotten["output"])
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        "body":  json.dumps({
            "correct": solved,
            "expected": expected,
            "gotten": gotten,
            "answer": answer
        })
    } 

def question_2b(postReq):
    answer = json.loads(postReq["answer"])
    properties = [log["name"] for log in answer]
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        "body":  json.dumps({
            "result": properties
        })
    }
