// Imports
const {
  CreateListenerCommand,
  CreateLoadBalancerCommand,
  CreateTargetGroupCommand
} = require('@aws-sdk/client-elastic-load-balancing-v2')

const helpers = require('./helpers')

// Declare local variables
const sgName = 'hamsterLBSG'
const tgName = 'hamsterTG'
const lbName = 'hamsterLB'
const vpcId = 'vpc-3ded4b5a' // You need to configure this one (can be default VPC???)
const subnets = [
  'subnet-59e5793c', // these need to be in the VPC above
  'subnet-94a9e5be',
]

async function execute () {
  try {
    const sgId = await helpers.createSecurityGroup(sgName, 80)
    const tgResult = await createTargetGroup(tgName)
    const lbResult = await createLoadBalancer(lbName, sgId)

    const tgArn = tgResult.TargetGroups[0].TargetGroupArn
    const lbArn = lbResult.LoadBalancers[0].LoadBalancerArn
    console.log('Target Group Name ARN:', tgArn)

    const response = await createListener(tgArn, lbArn)
    console.log('Created load balancer with:', response)
  } catch (err) {
    console.error('Failed to create load balancer with:', err)
  }
}

function createLoadBalancer (lbName, sgId) {
  const params = {
    Name: lbName,
    SecurityGroups: [sgId],
    Subnets: subnets,
    Type: 'application',
  }

  const command = new CreateLoadBalancerCommand(params)
  return helpers.sendELBCommand(command)

}

function createTargetGroup (tgName) {
  const params = {
    Name: tgName,
    Port: 3000,
    Protocol: 'HTTP',
    VpcId: vpcId
  }

  const command = new CreateTargetGroupCommand(params)
  return helpers.sendELBCommand(command)
}

function createListener (tgArn, lbArn) {
  const params = {
    DefaultActions: [
      {
        TargetGroupArn: tgArn,
        Type: 'forward'
      }
    ],
    LoadBalancerArn: lbArn,
    Port: 80,
    Protocol: 'HTTP'
  }

  const command = new CreateListenerCommand(params)
  return helpers.sendELBCommand(command)
}

execute()