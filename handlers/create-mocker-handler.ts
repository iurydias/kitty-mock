import getJsend from '../helpers/get-jsend'
import IResponse from '../interfaces/IResponse'
import { IncomingMessage } from 'http'
import IHandler from '../interfaces/IHandler'
import Mocker from '../mocker/mocker'
import IRouteShelf from '../interfaces/IRouteShelf'
import RouteShelf from '../buffer/route-shelf'
import { DELETE, GET } from '../consts/methods-consts'

export default class CreateMockerHandler implements IHandler {
  readonly hostname: string
  private portsRange: Array<number>
  readonly buffer: IRouteShelf
  private usedPorts: Array<number> = []

  constructor (portsRange: Array<number>) {
    this.hostname = '127.0.0.1'
    this.portsRange = portsRange
    this.buffer = new RouteShelf()
  }

  public handle (req: IncomingMessage): Promise<IResponse> {
    return new Promise(async (resolve) => {
      let port = this.getPort()
      if (!port) {
        resolve({ code: 500, jsend: getJsend(500, undefined, 'internal server error') })
      }
      const mocker = new Mocker(this.hostname, port, this.buffer)
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

  private getPort (): number | undefined {
    let portsRange = this.portsRange.filter((num) => !this.usedPorts.includes(num))
    let index: number = Math.floor(Math.random() * portsRange.length)
    return portsRange[index]
  }

}


