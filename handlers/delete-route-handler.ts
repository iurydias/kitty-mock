import getJsend from '../helpers/get-jsend'
import { IncomingMessage } from 'http'
import IRouteShelf from '../interfaces/IRouteShelf'
import IResponse from '../interfaces/IResponse'
import { checkQuery } from '../helpers/check-query'
import IFilter from '../interfaces/IFilter'
import IRequestShelf from '../interfaces/IRequestShelf'

export default class DeleteRouteHandler {
  private mockerRouteShelf: IRouteShelf
  private mockerRequestShelf: IRequestShelf

  constructor (mockerRouteShelf: IRouteShelf, mockerRequestShelf: IRequestShelf) {
    this.mockerRouteShelf = mockerRouteShelf
    this.mockerRequestShelf = mockerRequestShelf
  }

  public handle (req: IncomingMessage): Promise<IResponse> {
    return new Promise(async (resolve) => {
      let url = require('url')
      let query: IFilter = url.parse(req.url, true).query
      let err: string | undefined = checkQuery(query)
      if (err) {
        return resolve({ code: 500, body: getJsend({ statusCode: 500, data: undefined, message: err }) })
      }
      this.mockerRequestShelf.deleteRequests(req.socket.localPort.toString(), query.method.toUpperCase() + query.path)
      let ok: boolean = this.mockerRouteShelf.removeItem(req.socket.localPort, query.path, query.method)
      ok ? resolve({ code: 204, body: getJsend({ statusCode: 204, data: undefined, message: undefined }) }) :
        resolve({
          code: 404,
          body: getJsend({ statusCode: 404, data: undefined, message: 'route does not exist' })
        })
    })
  }
}

