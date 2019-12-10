import IRequest from "../interfaces/IRequest";
import IMockerHistory from "../interfaces/IMockerHistory";
import IRequestShelf from "../interfaces/IRequestShelf";

export default class RequestShelf implements IRequestShelf {
    private mockerRequestList: IMockerHistory[] = []

    public getRequests(mockerPort: string): IRequest[] {
        let mocker: IMockerHistory = this.getMocker(mockerPort)
        if (mocker) {
            return mocker.requestList
        }
        return []
    }

    public setRequest(mockerPort: string, request: IRequest): void {
        let mocker: IMockerHistory = this.getMocker(mockerPort)
        if (mocker) {
            mocker.requestList.push(request)
        }
        this.mockerRequestList.push({mockerPort: mockerPort, requestList: [request]})
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

