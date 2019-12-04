import IRouteShelf from './interfaces/IRouteShelf'
import RouteShelf from './routeShelf/route-shelf'
import Mocker from './mocker/mocker'
import CreateMockerHandler from './handlers/create-mocker-handler'
import { POST } from './consts/methods-consts'
import { range } from 'lodash'
import IMocker from './interfaces/IMocker'
import IConfig from './interfaces/IConfig'

let routeShelf: IRouteShelf = new RouteShelf()

export default function server (config: IConfig): Promise<IMocker> {
  return new Promise((resolve, reject) => {
    let host: string = config.host || '0.0.0.0'
    let port: string = config.serverPort || '4000'
    let rangeArray: string = config.mockersPortsRange || '5000-6000'
    let err: string = checkParamsConfig(host, port, rangeArray)
    if (err) {
      return reject(err)
    }
    let portsRange: string[] = getPortsArray(rangeArray)
    const server = new Mocker(host, port, routeShelf)
    server.loadServer()
    server.runServer().then((res) => {
      server.addRoute({
        path: '/create', method: POST, handler: new CreateMockerHandler(range(portsRange[0], portsRange[1], 1))
      })
      resolve(server)
    }).catch(reject)
  })
}

function getPortsArray (text: string): Array<string> {
  return text.split('-')
}

function checkParamsConfig (host: string, port: string, portsRange: string): string | undefined {
  let hostRegex = /^(?=.*[^\.]$)((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.?){4}$/
  if (!hostRegex.test(host)) {
    return 'host with invalid format'
  }
  let portRegex = /^[\d]*$/
  if (!portRegex.test(port)) {
    return 'port with invalid format'
  }
  let rangeRegex = /^\d+-\d+$/
  if (!rangeRegex.test(portsRange)) {
    return 'mocker ports range with invalid format'
  }
}