import getJsend from '../helpers/get-jsend'
import IResponse from '../interfaces/IResponse'
import { IncomingMessage } from 'http'
import IRoute from '../interfaces/IRoute'
import IRouteShelf from '../interfaces/IRouteShelf'
import IFilter from '../interfaces/IFilter'

export default class RoutesGetterHandler {
  private mockerRoutesList: IRouteShelf

  constructor (mockerRoutesList: IRouteShelf) {
    this.mockerRoutesList = mockerRoutesList
  }

  public handle (req: IncomingMessage): Promise<IResponse> {
    return new Promise((resolve) => {
      let routes: IRoute[] | undefined = this.mockerRoutesList.getItems(req.socket.localPort.toString())
      resolve({code: 200, body: getJsend({ statusCode: 200, data: JSON.stringify(hydrate(routes)), message: undefined })})
    })
  }
}

function hydrate(routes: IRoute[]): IFilter[]{
  let filteredRoutes: IRoute[] = routes.filter((route) => {
    return route.filters.path != "/=%5E.%5E=/route"
  })
   return filteredRoutes.map((route)=>{
          return route.filters
  })
}