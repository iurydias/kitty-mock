import IMockerRouter from '../interfaces/IMockerRouter'
import IRoute from '../interfaces/IRoute'
import IRouteShelf from '../interfaces/IRouteShelf'

export default class RouteShelf implements IRouteShelf {
    private mockerRoutesList: IMockerRouter[] = []

    public getItem(mockerPort: string, path: string, method: string): Promise<IRoute> {
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

    public getItems(mockerPort: string): IRoute[] {
        let mocker: IMockerRouter = this.getMocker(mockerPort)
        if (mocker) {
            return mocker.routesList
        }
        return []
    }

    public setItem(mockerPort: string, route: IRoute): boolean {
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
        this.mockerRoutesList.push({mockerPort: mockerPort, routesList: [route]})
        return true
    }

    public removeItem(mockerPort: string, routePath: string, routeMethod: string): boolean {
        let mocker: IMockerRouter = this.getMocker(mockerPort)
        if (mocker) {
            let routeItem: IRoute = this.getRouteByPathAndMethod(mocker.routesList, {
                path: routePath,
                method: routeMethod.toUpperCase()
            })
            mocker.routesList = this.filterRoutesByPathAndMethod(mocker.routesList, {
                path: routeItem.filters.method,
                method: routeMethod.toUpperCase()
            })
            return !!routeItem
        }
    }

    private getMocker(port: string): IMockerRouter {
        return this.mockerRoutesList.find((mocker) => {
            return mocker.mockerPort == port
        })
    }

    private filterRoutesByPath(routesList: IRoute[], path: string): IRoute[] {
        return routesList.filter((route) => {
            return route.filters.path == path
        })
    }

    private filterRoutesByPathAndMethod(routesList: IRoute[], {path, method}): IRoute[] {
        return routesList.filter((route) => {
            return route.filters.path == path && route.filters.method == method
        })
    }

    private getRouteByPathAndMethod(routesList: IRoute[], {path, method}): IRoute {
        return routesList.find((routeItem) => {
            return routeItem.filters.path == path && routeItem.filters.method == method
        })
    }

    private getRouteByMethod(routesList: IRoute[], method): IRoute {
        return routesList.find((routeItem) => {
            return routeItem.filters.method == method
        })
    }
}