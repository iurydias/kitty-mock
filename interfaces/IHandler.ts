import { IncomingMessage } from 'http'
import IResponse from './IResponse'

export default interface IHandler {
  (req: IncomingMessage): Promise<IResponse>
}
