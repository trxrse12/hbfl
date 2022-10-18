// Imports
const {
  EC2Client,
  CreateSecurityGroupCommand, // BP: organize the commands in here in alphabetical order
  AuthorizeSecurityGroupIngressCommandInput,
} = require('@aws-sdk/client-ec2')
const helpers = require('./helpers')

function sendCommand (command) {
  const client = new EC2Client({region: process.env.AWS_REGION})
  return client.send(command)
}

// Declare local variables
const sgName = 'hamster_sg'
const keyName = 'hamster_key'

// Do all the things together
async function execute () {
  try {
    await createSecurityGroup(sgName)
    const keyPair = await createKeyPair(keyName)
    await helpers.persistKeyPair(keyPair)
    const data = await createInstance(sgName, keyName)
    console.log('Created instance with:', data)
  } catch (err) {
    console.error('Failed to create instance with:', err)
  }
}

// Create functions
async function createSecurityGroup (sgName) {
  const sgParams = {
    Description: sgName,
    GroupName: sgName,
  }
  const createCommand = new CreateSecurityGroupCommand(sgParams)
  const data = await sendCommand(createCommand) // create the SG

  // set the rules for the Security Groups
  const rulesParams = {
    GroupId: data.GroupId,
    IpPermissions: [
      {
        IpProtocol: 'tcp',
        FromPort: 22,
        ToPort: 22,
        IpRanges: [{ CidrIp: '0.0.0.0/0'}]
      },
      {
        IpProtocol: 'tcp',
        FromPort: 3000,
        ToPort: 3000,
        IpRanges: [{ CidrIp: '0.0.0.0/0'}]
      }
    ]
  }

  const authCommand = new AuthorizeSecurityGroupIngressCommandInput(rulesParams)
  return sendCommand(authCommand)
}

async function createKeyPair (keyName) {
  // TODO: Create keypair
}

async function createInstance (sgName, keyName) {
  // TODO: create ec2 instance
}
