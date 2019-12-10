import IRequest from "./IRequest";

export default interface IMockerHistory {
    mockerPort: string
    requestList: IRequest[]
}
