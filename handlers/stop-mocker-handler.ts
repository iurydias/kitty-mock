import { IncomingMessage } from 'http'
import IHandler from '../interfaces/IHandler'
import IMocker from '../interfaces/IMocker'
import getJsend from '../helpers/get-jsend'
import IJsend from '../interfaces/IJsend'
import IResponse from '../interfaces/IResponse'

export default class StopMockerHandler {
  private mocker: IMocker

  constructor (mocker: IMocker) {
    this.mocker = mocker
  }

  public handle (req: IncomingMessage): Promise<IResponse> {
    return new Promise((resolve)=>{
      resolve({code: 204, body: getJsend({statusCode: 204, data: undefined, message: undefined })})
      this.mocker.stopServer()
    })
  }
}




