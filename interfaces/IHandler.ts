import { IncomingMessage } from 'http'
import IResponse from './IResponse'

export default interface IHandler {
  handle (req: IncomingMessage): Promise<IResponse>
}