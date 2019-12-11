import getJsend from '../helpers/get-jsend'
import {IncomingMessage} from 'http'
import IRouteShelf from '../interfaces/IRouteShelf'
import IQuery from '../interfaces/IQuery'
import IResponse from '../interfaces/IResponse'
import { checkQuery } from '../helpers/check-query'

export default class DeleteRouteHandler {
    private mockerRoutesList: IRouteShelf

    constructor(mockerRoutesList: IRouteShelf) {
        this.mockerRoutesList = mockerRoutesList
    }

    public handle(req: IncomingMessage): Promise<IResponse> {
        return new Promise(async (resolve) => {
            let url = require('url')
            let query: IQuery = url.parse(req.url, true).query
            let err: string | undefined = checkQuery(query)
            if (err) {
                return resolve({code: 500, body: getJsend({statusCode: 500, data: undefined, message: err})})
            }
            let ok: boolean = this.mockerRoutesList.removeItem(req.socket.localPort.toString(), query.path, query.method)
            ok ? resolve({code: 204, body: getJsend({statusCode: 204, data: undefined, message: undefined})}) :
                resolve({
                    code: 404,
                    body: getJsend({statusCode: 404, data: undefined, message: 'route does not exist'})
                })
        })
    }
}

