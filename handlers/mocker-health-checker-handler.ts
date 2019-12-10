import IResponse from '../interfaces/IResponse'
import {IncomingMessage} from 'http'
import getJsend from '../helpers/get-jsend'

export default class MockerHealthCheckerHandler {

    public handle(req: IncomingMessage): Promise<IResponse> {
        return new Promise((resolve) => {
            resolve({code: 204, body: getJsend({statusCode: 204, data: undefined, message: undefined})})
        })
    }
}




