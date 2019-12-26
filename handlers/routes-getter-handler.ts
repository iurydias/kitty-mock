import getJsend from '../helpers/get-jsend'
import IResponse from '../interfaces/IResponse'
import { IncomingMessage } from 'http'
import IRoute from '../interfaces/IRoute'
import IRouteShelf from '../interfaces/IRouteShelf'
import IFilter from '../interfaces/IFilter'
import { RESERVED_PATH } from '../consts/kitty'

export default class RoutesGetterHandler {
  private mockerRouteShelf: IRouteShelf

  constructor (mockerRouteShelf: IRouteShelf) {
    this.mockerRouteShelf = mockerRouteShelf
  }

  public handle (req: IncomingMessage): Promise<IResponse> {
    return new Promise((resolve) => {
      let routes: IRoute[] | undefined = this.mockerRouteShelf.getItems(req.socket.localPort)
      resolve({
        code: 200,
        body: getJsend({ statusCode: 200, data: JSON.stringify(hydrate(routes)), message: undefined })
      })
    })
  }
}

function hydrate (routes: IRoute[]): IFilter[] {
  let filteredRoutes: IRoute[] = routes.filter((route) => {
    return route.filters.path != `/${RESERVED_PATH}/route` && route.filters.path != `/${RESERVED_PATH}/history` && route.filters.path != `/`
  })
  return filteredRoutes.map((route) => {
    return route.filters
  })
}