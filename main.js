require('ts-node').register()
let server = require('./server').default
require('dotenv').config()
let {KITTY} = require('./consts/kitty')

let config = {
    host: process.env.HOST,
    serverPort: process.env.SERVER_PORT,
    mockersPortsRange: process.env.MOCKER_PORTS_RANGE
}

server(config)
    .then(() => console.log(KITTY + ' Kitty Mocker main server started.'))
    .catch(console.error)