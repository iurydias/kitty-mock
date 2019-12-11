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
            this.mockerRequestShelf.deleteRequests(req.socket.localPort.toString())
            resolve({
                code: 200,
                body: getJsend({statusCode: 204, data: undefined, message: undefined})
            })
        })
    }
}
