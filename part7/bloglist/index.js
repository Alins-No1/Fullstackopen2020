const http = require('http')
const app = require('./app')
const logger = require('./utils/logger')
const configParams = require('./utils/config')

const server = http.createServer(app)

server.listen(configParams.PORT, () => {
  logger.info(`Server running on port ${configParams.PORT}`)
})
