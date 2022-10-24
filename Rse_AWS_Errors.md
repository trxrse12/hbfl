1. Error uploading files to S3: NotImplemented: A header you provided implies functionality that is not implemented:

    async function uploadS3Object (bucketName, file) {
    const params = {
        Bucket: bucketName,
        ACL: 'public-read',
        Body: file,
        Key: file.name,
        ContentType: helpers.getContentType(file.name)
    }
    const command = new PutObjectCommand(params)
    return helpers.sendS3Command(command)
}

    Solution: Modify: ...
                    Body: file.contents
                        .....


2.  node create-dynamo-table.js
       Could not create tables: ValidationException: 1 validation error detected: Value null at 'attributeDefinitions.1.member.attributeType' failed to satisfy constraint: Member must not be null
    Caused by a wrong key:
    AttributeDefinitions: [
     {  
        AttributeName: 'id',
        AtributeType: 'N', (misspelt)
      },
    ]  


3. Could not create tables: ValidationException: One or more parameter values were invalid: ReadCapacityUnits and WriteCapacityUnits must both be specified when BillingMode is PROVISIONED
  Caused by a wrong key in the CreateTableCommand() params:         
  Provision(ed)Throughput: { // missing the "ed" in here
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },                    