require('ts-node').register()
let server = require('./server')
require('dotenv').config()

let config = {
  host: process.env.HOST,
  serverPort: process.env.SERVER_PORT,
  mockersPortsRange: process.env.MOCKER_PORTS_RANGE
}

server(config).catch((err) => {
  console.log(err)
})