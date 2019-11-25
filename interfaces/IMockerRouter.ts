import IRoute from './IRoute'

export default interface IMockerRouter {
  mockerPort: string
  routesList: IRoute[]
}
