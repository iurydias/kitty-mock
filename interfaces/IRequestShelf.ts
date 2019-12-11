import IRequest from './IRequest'

export default interface IRequestShelf {
  getRequests (mockerPort: string, routeId: string): IRequest[]

  setRequest (mockerPort: string, routeId: string, request: IRequest): void

  deleteRequests (mockerPort: string, routeId: string): void

}
