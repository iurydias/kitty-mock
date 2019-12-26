import getJsend from '../helpers/get-jsend'
import IResponse from '../interfaces/IResponse'
import { IncomingMessage } from 'http'
import IRequestShelf from '../interfaces/IRequestShelf'
import { checkQuery } from '../helpers/check-query'
import IRouteShelf from '../interfaces/IRouteShelf'
import IFilter from '../interfaces/IFilter'

export default class DeleteHistoryHandler {
  private mockerRouteShelf: IRouteShelf
  private mockerRequestShelf: IRequestShelf

  constructor (mockerRouteShelf: IRouteShelf, mockerRequestShelf: IRequestShelf) {
    this.mockerRequestShelf = mockerRequestShelf
    this.mockerRouteShelf = mockerRouteShelf
  }

  public handle (req: IncomingMessage): Promise<IResponse> {
    return new Promise(async (resolve) => {
      let url = require('url')
      let query: IFilter = url.parse(req.url, true).query
      let err: string | undefined = checkQuery(query)
      if (err) {
        return resolve({ code: 500, body: getJsend({ statusCode: 500, data: undefined, message: err }) })
      }
      await this.mockerRouteShelf.getItem(req.socket.localPort, query.path, query.method).catch((code) =>
        resolve({
          code: 404,
          body: getJsend({ statusCode: 404, data: undefined, message: undefined })
        })
      )
      this.mockerRequestShelf.deleteRequests(req.socket.localPort.toString(), query.method.toUpperCase() + query.path)
      resolve({
        code: 204,
        body: getJsend({ statusCode: 204, data: undefined, message: undefined })
      })
    })
  }
}
