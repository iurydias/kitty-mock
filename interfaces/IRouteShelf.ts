import IRoute from './IRoute'

export default interface IRouteShelf {
    getItems(mockerPort: string): IRoute[]

    getItem(mockerPort: string, path: string, method: string): Promise<IRoute>

    setItem(mockerPort: string, route: IRoute): boolean

    removeItem(mockerPort: string, routePath: string, routeMethod: string): boolean
}