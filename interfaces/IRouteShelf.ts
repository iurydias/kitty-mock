import IRoute from './IRoute'

export default interface IRouteShelf {
  // getItem (mockerPort: string, routePath: string, routeMethod: string): IRoute | undefined

  getItems (mockerPort: string, routePath: string): IRoute[] | undefined

  setItem (mockerPort: string, route: IRoute): boolean

  removeItem (mockerPort: string, routePath: string, routeMethod: string): void
}