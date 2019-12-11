import IRequest from "../interfaces/IRequest";
import IMockerHistory from "../interfaces/IMockerHistory";
import IRequestShelf from "../interfaces/IRequestShelf";
import IRouteHistoryInfo from '../interfaces/IRouteHistoryInfo'

export default class RequestShelf implements IRequestShelf {
    private mockerRequestList: IMockerHistory[] = []

    public getRequests(mockerPort: string): IRequest[] {
        let mocker: IMockerHistory = this.getMocker(mockerPort)
        if (mocker) {
            let routeHistoryInfo: IRouteHistoryInfo = mocker.routeInfo.find((routeInfo)=>{
                return routeInfo.routeId == routeId
            })
            if (routeHistoryInfo) {

            }
        return []
    }

    public setRequest(mockerPort: string, routeId: string, request: IRequest): void {
        let mocker: IMockerHistory = this.getMocker(mockerPort)
        if (mocker) {
            let routeHistoryInfo: IRouteHistoryInfo = mocker.routeInfo.find((routeInfo)=>{
                return routeInfo.routeId == routeId
            })
            if (routeHistoryInfo) {
                routeHistoryInfo.requestList.push(request)
            }
        }
        this.mockerRequestList.push({mockerPort: mockerPort, routeInfo: [{routeId: routeId, requestList: [request]}]})
    }

    public deleteRequests(mockerPort: string): void {
        let mocker: IMockerHistory = this.getMocker(mockerPort)
        if (mocker) {
            mocker.requestList = []
        }
    }

    private getMocker(port: string): IMockerHistory {
        return this.mockerRequestList.find((mocker) => {
            return mocker.mockerPort == port
        })
    }
}

