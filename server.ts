import IBuffer from './interfaces/IBuffer'
import Buffer from './buffer/buffer'
import Mocker from './mocker/mocker'
import CreateMockerHandler from './handlers/create-mocker-handler'
import { POST } from './consts/methods-consts'
import IConfig from './interfaces/IConfig'
import { readFileSync } from 'fs'
import { range } from 'lodash'
import IMocker from './interfaces/IMocker'

let buffer: IBuffer = new Buffer()

export default async function server (configFile: string): Promise<IMocker | undefined> {
  return new Promise((resolve, reject) => {
    let config: IConfig = readFile(configFile)
    let rangeArray = getPortsArray(config.mockersPortsRanges)
    const server = new Mocker(config.hostname, config.serverPort, buffer)
    server.loadServer()
    server.runServer().then((res) => {
      console.log(res)
      let createMockerHandler = new CreateMockerHandler(range(rangeArray[0], rangeArray[1], 1)
      )
      server.addRoute({
        path: '/create', method: POST, handler: createMockerHandler
      })
      resolve(server)
    }).catch((error) => {
      reject(undefined)
    })
  })
}

function readFile (filename: string): IConfig {
  return JSON.parse(readFileSync(process.cwd() + '/' + filename).toString())
}

function getPortsArray (text: string): Array<string> {
  let regex = /^\d+-\d+$/
  if (regex.test(text)) {
    return text.split("-")
  }
  return undefined
}