import getJsend from '../helpers/get-jsend'
import IResponse from '../interfaces/IResponse'
import { IncomingMessage } from 'http'
import IRequestShelf from '../interfaces/IRequestShelf'
import IRequest from '../interfaces/IRequest'
import IQuery from '../interfaces/IQuery'
import { checkQuery } from '../helpers/check-query'
import IRouteShelf from '../interfaces/IRouteShelf'

export default class HistoryGetterHandler {
  private mockerRouteShelf: IRouteShelf
  private mockerRequestShelf: IRequestShelf

  constructor (mockerRouteShelf: IRouteShelf, mockerRequestShelf: IRequestShelf) {
    this.mockerRequestShelf = mockerRequestShelf
    this.mockerRouteShelf = mockerRouteShelf
  }

  public handle (req: IncomingMessage): Promise<IResponse> {
    return new Promise(async (resolve) => {
      let url = require('url')
      let query: IQuery = url.parse(req.url, true).query
      let err: string | undefined = checkQuery(query)
      if (err) {
        return resolve({ code: 500, body: getJsend({ statusCode: 500, data: undefined, message: err }) })
      }
      await this.mockerRouteShelf.getItem(req.socket.localPort, query.method, query.path).catch((code) =>
        resolve({
          code: code,
          body: getJsend({ statusCode: code, data: undefined, message: undefined })
        })
      )
      let requests: IRequest[] = this.mockerRequestShelf.getRequests(req.socket.localPort.toString(), query.method.toUpperCase() + query.path)
      resolve({
        code: 200,
        body: getJsend({ statusCode: 200, data: requests, message: undefined })
      })
    })
  }
}
