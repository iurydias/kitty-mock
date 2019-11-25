import IHandler from './IHandler'

export default interface IRoute {
  path: string
  method: string
  handler: IHandler
}