import IMockerRouter from '../interfaces/IMockerRouter'
import IRoute from '../interfaces/IRoute'
import IBuffer from '../interfaces/IBuffer'

export default class Buffer implements IBuffer {
  private mockerRoutesList: IMockerRouter[] = []

  public getItems (mockerPort: string, routePath: string): IRoute[] | undefined {
    let mocker: IMockerRouter = this.mockerRoutesList.find((mocker) => {
      return mocker.mockerPort == mockerPort
    })
    if (mocker) {
      let routes: IRoute[] = mocker.routesList.filter((route) => {
        return route.path == routePath
      })
      if (routes.length != 0) {
        return routes
      }
    }
    return undefined
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