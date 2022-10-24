// Imports
const {
  PutObjectCommand
} = require('@aws-sdk/client-s3')
const helpers = require('./helpers')

// Declare local variables
const bucketName = 'hamster-bucket-rse-2022'

async function execute () {
  try {
    const files = await helpers.getPublicFiles()

    for (const file of files) {
      console.log('MMMMMMMMMMMMMMMMMMM uploading file:', file.name)
      const response = await uploadS3Object(bucketName, file)
      console.log('Uploaded file with ETag:', response.ETag)
    }

    console.log('Uploaded all files')
  } catch (err) {
    console.error('Error uploading files to S3:', err)
  }
}

async function uploadS3Object (bucketName, file) {
  const params = {
    Bucket: bucketName,
    ACL: 'public-read', // specific to the file I'm writing, not to the bucket
    Body: file.contents,
    Key: file.name,
    ContentType: helpers.getContentType(file.name)
  }
  const command = new PutObjectCommand(params)
  return helpers.sendS3Command(command)
}

execute()
