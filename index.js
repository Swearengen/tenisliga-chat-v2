const sls = require('serverless-http')
const binaryMimeTypes = require('./binaryMimeTypes')

const server = require('./server/index')
module.exports.server = sls(server.server, {
  binary: binaryMimeTypes
})
