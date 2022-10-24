// Imports
const {
  CreateTableCommand
} = require('@aws-sdk/client-dynamodb')
const { sendDynamoDBCommand } = require('./helpers')

async function execute () {
  try {
    // both tables below will use the same key schema
    await createTable('hamsters')
    const data = await createTable('races')
    console.log(data)
  } catch (err) {
    console.error('Could not create tables:', err)
  }
}

async function createTable (tableName) {
  const params = {
    TableName: tableName,
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'N',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'id', // has to match the AttributeDefinitions above
        KeyType: 'HASH',
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  }

  const command = new CreateTableCommand(params)
  return sendDynamoDBCommand(command)
}

execute()