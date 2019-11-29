import getJsend from '../helpers/get-jsend'
import IResponse from '../interfaces/IResponse'
import { IncomingMessage } from 'http'
import IHandler from '../interfaces/IHandler'
import Mocker from '../mocker/mocker'
import IRouteShelf from '../interfaces/IRouteShelf'
import RouteShelf from '../routeShelf/route-shelf'
import { DELETE, GET } from '../consts/methods-consts'

export default class CreateMockerHandler implements IHandler {
  readonly hostname: string
  private portsRange: Array<string>
  readonly routeShelf: IRouteShelf
  private usedPorts: Array<string> = []

  constructor (portsRange: Array<string>) {
    this.hostname = '127.0.0.1'
    this.portsRange = portsRange
    this.routeShelf = new RouteShelf()
  }

  public handle (req: IncomingMessage): Promise<IResponse> {
    return new Promise(async (resolve) => {
      let port = this.getPort()
      if (!port) {
        resolve({ code: 500, jsend: getJsend(500, undefined, 'internal server error') })
      }
      const mocker = new Mocker(this.hostname, port, this.routeShelf)
      mocker.loadServer()
      mocker.runServer().then(() => {
        mocker.addRoute({
          path: '/=%5E.%5E=/route', method: GET, handler: {
            handle (req: IncomingMessage): Promise<IResponse> {
              return new Promise(resolve => {
                resolve({ code: 204, jsend: undefined })
              })
            }
          }
        })
        mocker.addRoute({
          path: '/=%5E.%5E=/route', method: DELETE, handler: {
            handle (req: IncomingMessage): Promise<IResponse> {
              return new Promise(resolve => {
                resolve({ code: 204, jsend: undefined })
                mocker.stopServer()
              })
            }
          }
        })
        let mockerInfoResponse = { port: port.toString() }
        resolve({ code: 200, jsend: getJsend(200, JSON.stringify(mockerInfoResponse), 'mocker successfully created') })
      }).catch((error) => {
        resolve({ code: 500, jsend: getJsend(500, undefined, 'internal server error') })
      }).finally(() => {
        this.usedPorts.push(port)
      })
    })
  }

  private getPort (): string | undefined {
    let portsRange: Array<string> = this.portsRange.filter((num) => !this.usedPorts.includes(num))
    let index: number = Math.floor(Math.random() * portsRange.length)
    return portsRange[index]
  }

}


