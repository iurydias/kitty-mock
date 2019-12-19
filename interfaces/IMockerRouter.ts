import IRoute from './IRoute'

export default interface IMockerRouter {
    mockerPort: number
    routesList: IRoute[]
}
