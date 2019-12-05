import getJsend from '../helpers/get-jsend'
import { IncomingMessage } from 'http'
import IHandler from '../interfaces/IHandler'
import Mocker from '../mocker/mocker'
import IRouteShelf from '../interfaces/IRouteShelf'
import RouteShelf from '../routeShelf/route-shelf'
import { DELETE, GET, POST } from '../consts/methods-consts'
import CreateRouteHandler from './create-route-handler'
import DeleteRouteHandler from './delete-route-handler'
import RoutesGetterHandler from './routes-getter-handler'
import MockerHealthCheckerHandler from './mocker-health-checker-handler'
import StopMockerHandler from './stop-mocker-handler'
import IResponse from '../interfaces/IResponse'

export default class CreateMockerHandler {
  readonly hostname: string
  private portsRange: number[]
  readonly routeShelf: IRouteShelf
  private usedPorts: number[] = []

  constructor (portsRange: number[]) {
    this.hostname = '127.0.0.1'
    this.portsRange = portsRange
    this.routeShelf = new RouteShelf()
  }

  public handle (req: IncomingMessage): Promise<IResponse> {
    return new Promise(async (resolve) => {
      let port = this.getPort()
      if (!port) {
        resolve({code: 500, body: getJsend({ statusCode: 500, data: undefined, message: 'internal server error' })})
      }
      const mocker = new Mocker(this.hostname, port, this.routeShelf)
      mocker.loadServer()
      mocker.runServer().then(() => {
        mocker.addRoute({
          filters: { path: '/=%5E.%5E=/route', method: GET },
          response: RoutesGetterHandler.prototype.handle.bind(new RoutesGetterHandler(this.routeShelf))
        })
        mocker.addRoute({
          filters: { path: '/=%5E.%5E=/route', method: POST },
          response: CreateRouteHandler.prototype.handle.bind(new CreateRouteHandler(this.routeShelf))
        })
        mocker.addRoute({
          filters: { path: '/=%5E.%5E=/route', method: DELETE },
          response: DeleteRouteHandler.prototype.handle.bind(new DeleteRouteHandler(this.routeShelf))
        })
        mocker.addRoute({
          filters: { path: '/', method: GET },
          response: MockerHealthCheckerHandler.prototype.handle.bind(new MockerHealthCheckerHandler())
        })
        mocker.addRoute({
          filters: { path: '/', method: DELETE },
          response: StopMockerHandler.prototype.handle.bind(new StopMockerHandler(mocker))
        })
        let mockerInfoResponse = { port: port }
        resolve({code: 200, body: getJsend({
          statusCode: 200,
          data: JSON.stringify(mockerInfoResponse),
          message: 'mocker successfully created'
        })})
      }).catch(() => {
        resolve({code: 500, body: getJsend({ statusCode: 500, data: undefined, message: 'internal server error' })})
      }).finally(() => {
        this.usedPorts.push(port)
      })
    })
  }

  private getPort (): number | undefined {
    let portsRange: number[] = this.portsRange.filter((num) => !this.usedPorts.includes(num))
    let index: number = Math.floor(Math.random() * portsRange.length)
    return portsRange[index]
  }

}


