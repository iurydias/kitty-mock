import getJsend from '../helpers/get-jsend'
import IResponse from '../interfaces/IResponse'
import {IncomingMessage} from 'http'
import IRequestShelf from "../interfaces/IRequestShelf";
import IRequest from "../interfaces/IRequest";

export default class HistoryGetterHandler {
    private mockerRequestShelf: IRequestShelf

    constructor(mockerRequestShelf: IRequestShelf) {
        this.mockerRequestShelf = mockerRequestShelf
    }

    public handle(req: IncomingMessage): Promise<IResponse> {
        return new Promise((resolve) => {
            let requests: IRequest[] | undefined = this.mockerRequestShelf.getRequests(req.socket.localPort.toString())
            resolve({
                code: 200,
                body: getJsend({statusCode: 200, data: JSON.stringify(requests), message: undefined})
            })
        })
    }
}
