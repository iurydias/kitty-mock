import IRequest from '../interfaces/IRequest'
import IMockerHistory from '../interfaces/IMockerHistory'
import IRequestShelf from '../interfaces/IRequestShelf'
import IRouteHistoryInfo from '../interfaces/IRouteHistoryInfo'

export default class RequestShelf implements IRequestShelf {
  private mockerRequestList: IMockerHistory[] = []

  public getRequests (mockerPort: string, routeId: string): IRequest[] {
    let mocker: IMockerHistory = this.getMocker(mockerPort)
    if (mocker) {
      let routeHistoryInfo: IRouteHistoryInfo = this.findRouteInfoById(mocker.routeInfo, routeId)
      if (routeHistoryInfo) {
        return routeHistoryInfo.requestList
      }
    }
    return []
  }

  public setRequest (mockerPort: string, routeId: string, request: IRequest): void {
    let mocker: IMockerHistory = this.getMocker(mockerPort)
    if (mocker) {
      let routeHistoryInfo: IRouteHistoryInfo = this.findRouteInfoById(mocker.routeInfo, routeId)
      if (routeHistoryInfo) {
        routeHistoryInfo.requestList.push(request)
        return
      } else {
        mocker.routeInfo.push({ routeId: routeId, requestList: [request] })
      }
    }
    this.mockerRequestList.push({
      mockerPort: mockerPort,
      routeInfo: [{ routeId: routeId, requestList: [request] }]
    })
  }

  public deleteRequests (mockerPort: string, routeId: string): void {
    let mocker: IMockerHistory = this.getMocker(mockerPort)
    if (mocker) {
      let routeHistoryInfo: IRouteHistoryInfo = this.findRouteInfoById(mocker.routeInfo, routeId)
      if (routeHistoryInfo) {
        mocker.routeInfo = this.filterRouteInfoDeletingById(mocker.routeInfo, routeId)
      }
    }
  }

  private getMocker (port: string): IMockerHistory {
    return this.mockerRequestList.find((mocker) => mocker.mockerPort == port)
  }

  private filterRouteInfoDeletingById (routeInfoList: IRouteHistoryInfo[], routeId: string): IRouteHistoryInfo[] {
    return routeInfoList.filter((routeInfo) => routeInfo.routeId != routeId)
  }

  private findRouteInfoById (routeInfoList: IRouteHistoryInfo[], routeId: string): IRouteHistoryInfo {
    return routeInfoList.find((routeInfo) => routeInfo.routeId == routeId)
  }
}

