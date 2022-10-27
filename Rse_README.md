0. Saved the files' tabs part of the Hapi call stack in a WSL workspace: 
    explaining_hapi_call_stack
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


5. How to add a key-pair to instances raised by ASGs:
    a. From the ASG "Advanced configuration",  press Edit and under the "Suspended Processes"
        combo choose  "Launch" >>> so basically stop launching new instances from the ASG;
    b. Stop the instances from EC2;
    c. Create a new key pair in EC2 console;
    d. In the ASG's launch template, create a new version (and set it default) that has
        the key created above associated with the launch instance;
    e. Re-enable the AutoScaling (undo what you did in a)

6. Cannot delete a Role that has attached policies.
    I need first to detach the policies from the role



        