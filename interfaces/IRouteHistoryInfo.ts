import IRequest from './IRequest'

export default interface IRouteHistoryInfo {
  routeId: string
  requestList: IRequest[]
}