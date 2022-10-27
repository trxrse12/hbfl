// Imports
const {
  BatchWriteCommand
} = require('@aws-sdk/lib-dynamodb') // not using the client-dynamodb, instead 
  //   I'm using this higher level Dynamo client
const {
  getHamsterData,
  getRaceData,
  sendDynamoItemCommand
} = require('./helpers')

async function execute () {
  try {
    const hamstersData = await getHamsterData()
    await populateTable('hamsters', hamstersData)

    const raceData = await getRaceData()
    const response = await populateTable('races', raceData)

    console.log(response)
  } catch (err) {
    console.error('Could not populate table:', err)
  }
}

async function populateTable (tableName, data) {
  const params = {
    RequestItems: {
      [tableName]: data.map(i => {
        return {
          PutRequest: {
            Item: i // because I use the DynamoDB Client, it will convert 
            // the item to a compatible DynamoDB object
          }
        }
      })
    }
  }
  const command = new BatchWriteCommand(params)
  return sendDynamoItemCommand(command)
}

execute()