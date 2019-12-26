import getJsend from '../helpers/get-jsend'
import { IncomingMessage } from 'http'
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
import IRequestShelf from '../interfaces/IRequestShelf'
import HistoryGetterHandler from './history-getter-handler'
import DeleteHistoryHandler from './delete-history-handler'
import getPort from '../helpers/get_port'
import { RESERVED_PATH } from '../consts/kitty'

export default class CreateMockerHandler {
  readonly hostname: string
  private portsRange: number[]
  readonly routeShelf: IRouteShelf
  readonly requestShelf: IRequestShelf
  private usedPorts: number[] = []

  constructor (portsRange: number[], requestShelf: IRequestShelf) {
    this.hostname = '127.0.0.1'
    this.portsRange = portsRange
    this.routeShelf = new RouteShelf()
    this.requestShelf = requestShelf
  }

  public handle (req: IncomingMessage): Promise<IResponse> {
    return this.createMocker()
  }

  createMocker (): Promise<IResponse> {
    return new Promise(async (resolve) => {
      let port = getPort(this.portsRange, this.usedPorts)
      if (!port) {
        return resolve({
          code: 500,
          body: getJsend({ statusCode: 500, data: undefined, message: 'internal server error' })
        })
      }
      const mocker = new Mocker(this.hostname, port, this.routeShelf, this.requestShelf)
      mocker.loadServer()
      return mocker.runServer().then(() => {
        mocker.addRoute({
          filters: { path: `/${RESERVED_PATH}/route`, method: GET },
          response: RoutesGetterHandler.prototype.handle.bind(new RoutesGetterHandler(this.routeShelf))
        })
        mocker.addRoute({
          filters: { path: `/${RESERVED_PATH}/route`, method: POST },
          response: CreateRouteHandler.prototype.handle.bind(new CreateRouteHandler(this.routeShelf))
        })
        mocker.addRoute({
          filters: { path: `/${RESERVED_PATH}/route`, method: DELETE },
          response: DeleteRouteHandler.prototype.handle.bind(new DeleteRouteHandler(this.routeShelf))
        })
        mocker.addRoute({
          filters: { path: `/${RESERVED_PATH}/history`, method: GET },
          response: HistoryGetterHandler.prototype.handle.bind(new HistoryGetterHandler(this.routeShelf, this.requestShelf))
        })
        mocker.addRoute({
          filters: { path: `/${RESERVED_PATH}/history`, method: DELETE },
          response: DeleteHistoryHandler.prototype.handle.bind(new DeleteHistoryHandler(this.routeShelf, this.requestShelf))
        })
        mocker.addRoute({
          filters: { path: '/', method: GET },
          response: MockerHealthCheckerHandler.prototype.handle.bind(new MockerHealthCheckerHandler())
        })
        mocker.addRoute({
          filters: { path: '/', method: DELETE },
          response: StopMockerHandler.prototype.handle.bind(new StopMockerHandler(mocker))
        })
        this.usedPorts.push(port)
        let mockerInfoResponse = { port: port }
        return resolve({
          code: 200, body: getJsend({
            statusCode: 200,
            data: JSON.stringify(mockerInfoResponse),
            message: 'mocker successfully created'
          })
        })
      }).catch(() => {
        console.log(`Retrying to connect in another port, ${port} is in use.`)
        this.usedPorts.push(port)
        return resolve(this.createMocker())
      })
    })
  }
}