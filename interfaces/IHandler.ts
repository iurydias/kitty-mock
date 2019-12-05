import { IncomingMessage } from 'http'
import IJsend from './IJsend'
import IResponse from './IResponse'

export default interface IHandler {
   (req: IncomingMessage): Promise<IResponse>
}
