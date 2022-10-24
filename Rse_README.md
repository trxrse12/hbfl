1. Checking the aws cli is configured correctly:
    aws configservice describe-configuration-recorder-status

2. Delete a bucket:
 aws s3 rb s3://cncb-event-stream-remus-serverlessdeploymentbucke-hkqu9wf81hpv --force

3. Clean all objects in a bucket:
    aws s3 rm s3://kokoshka --recursive

4. Another method to delete all objects in a bucket, when millions of objects in there >>> put an object expiration policy for 1 day, on that S3 bucket:
    a. create a file in rse_tools/: see: called bucket_cleanup.json
    b. Run at AWS CLI:
        cd rse_tools
        aws s3api put-bucket-lifecycle-configuration \
        --bucket amplify-lambdatriggerexample-dev-131923-deployment  \
        --lifecycle-configuration file://bucket_cleanup.json


        