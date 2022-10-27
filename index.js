const Hapi = require('@hapi/hapi')
require('dotenv').config()

const plugins = require('./plugins')
const routes = require('./routes')
const { logger } = require('./util/logger')
const { init: usersInit } = require('./lib/data/users')
const { init: queueInit } = require('./lib/data/lib/sqs.listener')

const options = {
  port: 3000,
  // Commented out until Elasticache is configured
  cache: [{
    name: 'redis',
    provider: {
      constructor: require('@hapi/catbox-redis'),
      options: {
        partition: 'cache',
        host: 'hamster.yhevcu.0001.use1.cache.amazonaws.com', // do not include the port in here
      }
    }
  }]
}

const init = async () => {
  const server = Hapi.Server(options)

  await server.register(plugins)

  // hapi-auth-cookie stuff
  const cache = server.cache({
    cache: 'redis',
    segment: 'sessions',
    expiresIn: 3 * 24 * 60 * 60 * 1000
  })
  server.app.cache = cache

  server.ext('onPreHandler', (req, h) => {
    req.info.acceptEncoding = null
    return h.continue
  })

  server.auth.strategy('session', 'cookie', {
    cookie: {
      isSecure: false,
      name: 'hbfl-sid',
      password: 'password-should-be-32-characters'
    },
    validateFunc: async (request, session) => {
      const cached = await cache.get(session.sid)
      if (!cached) {
        return { valid: false }
      }
      return {
        credentials: cached.account,
        valid: true
      }
    }
  })

  server.auth.default('session')

  // register routes
  server.route(routes)

  // logging
  server.events.on('log', (_, event) => {
    if (event.error) {
      logger.error(`Server error: ${event.error.message || 'unknown'}`);
    } else {
      logger.info(`Server event: ${event}`)
    }
  })

  server.events.on('request', (_, event) => {
    if (event.tags.includes('unauthenticated')) return
    if (event.tags.includes('error')) {
      logger.error(`Request error: ${event.data || event.error.message || 'unknown'}`);
    } else {
      logger.info(`Request event: ${event}`)
    }
  })

  // initialize database and start server
  usersInit()
  // Commented out until SQS is configured
  // .then(() => queueInit())
  .then(async () => {
    try {
      await server.start()
      console.log(`Server started at http://localhost:${server.info.port}`)
    } catch (err) {
      console.error(`Server could not start. Error: ${err}`)
      logger.error(`Server could not start. Error: ${err}`)
    }
  })
}

init()
