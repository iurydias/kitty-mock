import getJsend from '../helpers/get-jsend'
import IResponse from '../interfaces/IResponse'
import {IncomingMessage} from 'http'
import IRequestShelf from "../interfaces/IRequestShelf";

export default class DeleteHistoryHandler {
    private mockerRequestShelf: IRequestShelf

    constructor(mockerRequestShelf: IRequestShelf) {
        this.mockerRequestShelf = mockerRequestShelf
    }

    public handle(req: IncomingMessage): Promise<IResponse> {
        return new Promise((resolve) => {
            this.mockerRequestShelf.deleteRequests(req.socket.localPort.toString())
            resolve({
                code: 200,
                body: getJsend({statusCode: 204, data: undefined, message: undefined})
            })
        })
    }
}
