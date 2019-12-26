import getJsend from '../helpers/get-jsend'
import getRequestBody from '../helpers/get-request-body'
import { IncomingMessage } from 'http'
import IRouteShelf from '../interfaces/IRouteShelf'
import checkRequest from '../helpers/check-request'
import IRoute from '../interfaces/IRoute'
import IResponse from '../interfaces/IResponse'

export default class CreateRouteHandler {
  private mockerRoutesList: IRouteShelf

  constructor (mockerRoutesList: IRouteShelf) {
    this.mockerRoutesList = mockerRoutesList
  }

  public handle (req: IncomingMessage): Promise<IResponse> {
    return getRequestBody(req).then((body) => {
      let route: IRoute = JSON.parse(body)
      route.response = route.response as IResponse
      let err: string | undefined = checkRequest(route.filters, route.response)
      if (err) {
        return { code: 403, body: getJsend({ statusCode: 403, data: undefined, message: err }) }
      }
      let ok: boolean = this.mockerRoutesList.setItem(req.socket.localPort, route)
      if (ok) {
        return {
          code: 200,
          body: getJsend({ statusCode: 200, data: undefined, message: 'route successfully created' })
        }
      } else {
        return {
          code: 403,
          body: getJsend({ statusCode: 403, data: undefined, message: 'route already created in this mocker' })
        }
      }
    }).catch((err) => {
      return {
        code: 500,
        body: getJsend({ statusCode: 500, data: undefined, message: 'request missing body. ' + err.message })
      }
    })
  }
}




