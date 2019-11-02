# bt3103-1d4-statistical-learning
*Now called Regression Analysis by Team 1d4*

Steps for deploying to Lambda:
tl;dr: Go to your AWS Educate account and click Account Details. Fork this repo and key in 
your AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN and BUCKET_NAME, where 
BUCKET_NAME is the name of the S3 bucket you want to use to store the source code. Then 
trigger our GitHub Action by making a change. 

If you understood the tl;dr, good! Else, if you need a step by step walkthrough, refer to the 
steps below.  
1. Fork this repository
<p align="center">
  <img src="./img/lambda_image1.png">
</p>
2. Login into AWS Educate, click **AWS Account**, then click the orange **AWS Starter Account** 
button. You should see this screen. Proceed to click Account Details.
<p align="center">
  <img src="./img/lambda_image2.png">
</p>
3. You should see this screen pop up. Click Show
<p align="center">
  <img src="./img/lambda_image3.png">
</p>
4. The revealed text would be in the format
```
[default]
aws_access_key_id=MYACCESSKEYID
aws_secret_access_key=thequickbrownfoxjumpsoveralazydog
aws_session_token=reallyLongText
```
Take note of your AWS_ACCESS_KEY_ID (which is MYACCESSKEYID in my case, your access key ID may differ), 
as well as the AWS_SECRET_ACCESS_KEY and AWS_SESSION_TOKEN. We will use them soon.

5. Go back to your forked repository and click on Settings. 
<p align="center">
  <img src="./img/lambda_image4.png">
</p>
6. Navigate to Secrets
<p align="center">
  <img src="./img/lambda_image5.png">
</p>
7. Click on **Add a new secret**. Set the **Name** to AWS_ACCESS_KEY_ID and set the **Value** to 
the value of your access key ID (which is MYACCESSKEYID in my case). Add in two more secrets 
AWS_SECRET_ACCESS_KEY and AWS_SESSION_TOKEN and fill in the values according to what you've recorded 
from Step 4.

8. On AWS Educate, go to AWS Console. 
<p align="center">
  <img src="./img/lambda_image6.png">
</p>
9. Type in S3 in the searchbar and navigate to S3
<p align="center">
  <img src="./img/lambda_image7.png">
</p>
10. Click on Create Bucket and enter in a valid bucket name. Amazon will tell you if your bucket name is 
invalid. Leave all other options untouched and click Next.
<p align="center">
  <img src="./img/lambda_image8.png">
</p>
11. Keep everything at their default values and click Next.
<p align="center">
  <img src="./img/lambda_image9.png">
</p>
12. Uncheck all options except for the last one. Your permissions settings should look exactly like 
the example below. Click Next
<p align="center">
  <img src="./img/lambda_image10.png">
</p>
13. You should be at the Review tab. Click Next to create your bucket, and go back to your Secrets Tab in GitHub.

14. Add your last key which is BUCKET_NAME and set it to be exactly the name of your S3 bucket that you've 
just created. With reference to step 10, the bucket name we used is example-bucket-name.

15. Make a change in your repository to trigger the Action. You can track the status of the action under the 
Actions tab. 
<p align="center">
  <img src="./img/lambda_image11.png">
</p>
16. To see your deployed serverless application, go to Lambda
<p align="center">
  <img src="./img/lambda_image12.png">
</p>
17. You should see your version of our app deployed as one of your Lambda functions. Click it
<p align="center">
  <img src="./img/lambda_image13.png">
</p>
18. Click on **API Gateway** and scroll all the way down. The API endpoint shows the URL of your version 
of the serverless application. Replace {proxy+} with index.html and you're good to go!
<p align="center">
  <img src="./img/lambda_image14.png">
</p>

### Troubleshooting
**Invalid Credentials**  
Assuming that you're using AWS Educate, repeat steps 3 to 8 and replace your AWS_SECRET_ACCESS_KEY, 
AWS_SESSION_TOKEN and AWS_ACCESS_KEY_ID with the new values. Your credentials expire every 3 hours.

**Unable to create stack / ROLLBACK COMPLETE**  
Search for CloudFormation on AWS Console and delete the stack called StatisticalLearning, if it exists. 
Then rerun the checks again. Usually deleting and recreating the stack rectifies the problem.