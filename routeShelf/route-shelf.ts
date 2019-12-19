import IMockerRouter from '../interfaces/IMockerRouter'
import IRoute from '../interfaces/IRoute'
import IRouteShelf from '../interfaces/IRouteShelf'

export default class RouteShelf implements IRouteShelf {
  private mockerRoutesList: IMockerRouter[] = []

  public getItem (mockerPort: number, path: string, method: string): Promise<IRoute> {
    return new Promise((resolve, reject) => {
      let mocker: IMockerRouter = this.getMocker(mockerPort)
      if (mocker) {
        let routes: IRoute[] = this.filterRoutesByPath(mocker.routesList, path)
        if (routes.length == 0) {
          return reject(404)
        }
        let route: IRoute = this.getRouteByMethod(routes, method.toUpperCase())
        if (route) {
          return resolve(route)
        }
        reject(405)
      }
    })
  }

  public getItems (mockerPort: number): IRoute[] {
    let mocker: IMockerRouter = this.getMocker(mockerPort)
    if (mocker) {
      return mocker.routesList
    }
    return []
  }

  public setItem (mockerPort: number, route: IRoute): boolean {
    route.filters.method = route.filters.method.toUpperCase()
    let mocker: IMockerRouter = this.getMocker(mockerPort)
    if (mocker) {
      let routeItem: IRoute = this.getRouteByPathAndMethod(mocker.routesList, route.filters)
      if (!routeItem) {
        mocker.routesList.push(route)
        return true
      }
      return false
    }
    this.mockerRoutesList.push({ mockerPort: mockerPort, routesList: [route] })
    return true
  }

  public removeItem (mockerPort: number, routePath: string, routeMethod: string): boolean {
    let mocker: IMockerRouter = this.getMocker(mockerPort)
    if (mocker) {
      let routeItem: IRoute = this.getRouteByPathAndMethod(mocker.routesList, {
        path: routePath,
        method: routeMethod.toUpperCase()
      })
      if (routeItem) {
        mocker.routesList = this.filterPathAndMethodDifferentsRoutes(mocker.routesList, {
          path: routeItem.filters.method,
          method: routeMethod.toUpperCase()
        })
      }
      return !!routeItem
    }
  }

  private getMocker (port: string): IMockerRouter {
    return this.mockerRoutesList.find((mocker) => mocker.mockerPort == port)
  }

  private filterRoutesByPath (routesList: IRoute[], path: string): IRoute[] {
    return routesList.filter((route) => route.filters.path == path)
  }

  private filterPathAndMethodDifferentsRoutes (routesList: IRoute[], { path, method }): IRoute[] {
    return routesList.filter((route) => route.filters.path != path && route.filters.method != method)
  }

  private getRouteByPathAndMethod (routesList: IRoute[], { path, method }): IRoute {
    return routesList.find((routeItem) => routeItem.filters.path == path && routeItem.filters.method == method)
  }

  private getRouteByMethod (routesList: IRoute[], method): IRoute {
    return routesList.find((routeItem) => routeItem.filters.method == method)
  }
}