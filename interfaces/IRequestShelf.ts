import IRequest from "./IRequest";

export default interface IRequestShelf {
    getRequests(mockerPort: string): IRequest[]

    setRequest(mockerPort: string, request: IRequest): void

    deleteRequests(mockerPort: string): void

}
