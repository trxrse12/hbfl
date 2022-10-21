// Imports
const {
  RunInstancesCommand,
  StopInstancesCommand
} = require('@aws-sdk/client-ec2')
const { sendCommand } = require('./helpers')

// Declare local variables
const sgName = 'hamster_sg'
const keyName = 'hamster_key'
const instanceId = 'i-0dc6d9c0ff0bc6b39'

async function execute () {
  try {
    await stopInstance(instanceId)
    const data = await createInstance(sgName, keyName)
    console.log('Created instance with:', data)
  } catch (err) {
    console.error('Failed to create instance with:', err)
  }
}

async function createInstance (sgName, keyName) {
  const params = {
    ImageId: 'ami-09d3b3274b6c5d4aa',
    InstanceType: 't2.micro',
    KeyName: keyName,
    MaxCount: 1,
    MinCount: 1,
    Placement: {
      AvailabilityZone: 'us-east-1b'
    },
    SecurityGroups: [ sgName ]
  }
  const command = new RunInstancesCommand(params)
  return sendCommand(command)
}

function stopInstance (instanceId) {
  const params = {
    InstanceIds: [ instanceId ]
  }
  const command = new StopInstancesCommand(params)
  return sendCommand(command)
}

execute()
