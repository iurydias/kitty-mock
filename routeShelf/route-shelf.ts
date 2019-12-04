import IMockerRouter from '../interfaces/IMockerRouter'
import IRoute from '../interfaces/IRoute'
import IRouteShelf from '../interfaces/IRouteShelf'

export default class RouteShelf implements IRouteShelf {
  private mockerRoutesList: IMockerRouter[] = []

  public getItem (mockerPort: string, path: string, method: string): Promise<IRoute> {
    return new Promise((resolve, reject) => {
      let mocker: IMockerRouter = this.mockerRoutesList.find((mocker) => {
        return mocker.mockerPort == mockerPort
      })
      if (mocker) {
        let routes: IRoute[] = mocker.routesList.filter((route) => {
          return route.path == path
        })
        if (routes.length == 0) {
         return reject(404)
        }
        let route: IRoute = routes.find((route) => {
          return route.method == method
        })
        if (route) {
          return resolve(route)
        }
        reject(405)
      }
    })
  }

  public setItem (mockerPort: string, route: IRoute): boolean {
    let mocker: IMockerRouter = this.mockerRoutesList.find((mocker) => {
      return mocker.mockerPort == mockerPort
    })
    if (mocker) {
      let routeItem: IRoute = mocker.routesList.find((routeItem) => {
        return (routeItem.path == route.path && routeItem.method == route.method)
      })
      if (!routeItem) {
        mocker.routesList.push(route)
        return true
      }
      return false
    }
    this.mockerRoutesList.push({ mockerPort: mockerPort, routesList: [route] })
    return true
  }

  public removeItem (mockerPort: string, routePath: string, routeMethod: string): void {
    let mocker: IMockerRouter = this.mockerRoutesList.find((mocker) => {
      return mocker.mockerPort == mockerPort
    })
    if (mocker) {
      mocker.routesList = mocker.routesList.filter((routeItem) => {
        return (routeItem.path != routePath && routeItem.method != routeMethod)
      })
    }
  }

}