import getJsend from '../helpers/get-jsend'
import IResponse from '../interfaces/IResponse'
import {IncomingMessage} from 'http'
import IRequestShelf from "../interfaces/IRequestShelf";
import IQuery from '../interfaces/IQuery'
import { checkQuery } from '../helpers/check-query'

export default class DeleteHistoryHandler {
    private mockerRequestShelf: IRequestShelf

    constructor(mockerRequestShelf: IRequestShelf) {
        this.mockerRequestShelf = mockerRequestShelf
    }

    public handle(req: IncomingMessage): Promise<IResponse> {
        return new Promise((resolve) => {
            let url = require('url')
            let query: IQuery = url.parse(req.url, true).query
            let err: string | undefined = checkQuery(query)
            if (err) {
                return resolve({code: 500, body: getJsend({statusCode: 500, data: undefined, message: err})})
            }
            this.mockerRequestShelf.deleteRequests(req.socket.localPort.toString(), query.method.toUpperCase()+query.path)
            resolve({
                code: 204,
                body: getJsend({statusCode: 204, data: undefined, message: undefined})
            })
        })
    }
}
