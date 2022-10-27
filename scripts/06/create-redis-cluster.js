// Imports
const {
  CreateCacheClusterCommand
} = require('@aws-sdk/client-elasticache')
const {
  createSecurityGroup,
  sendElastiCacheCommand
} = require('./helpers')

async function execute () {
  try {
    const sgId = await createSecurityGroup('hamster_redis_sg', 6379)
    const response = await createRedisCluster('hamster', sgId)
    console.log(response)
  } catch (err) {
    console.error('Could not create cache cluster:', err)
  }
}

async function createRedisCluster (clusterName, sgId) {
  const params = {
    CacheClusterId: clusterName,
    CacheNodeType: 'cache.t2.micro',
    Engine: 'redis',
    NumCacheNodes: 1, // this is the accepted one for Redis
    SecurityGroupsIds: [
      sgId
    ]
  }
  const command = new CreateCacheClusterCommand(params)
  return sendElastiCacheCommand(command)
}

execute()