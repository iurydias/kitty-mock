import IRoute from './IRoute'

export default interface IRouteShelf {
    getItems(mockerPort: number): IRoute[]

    getItem(mockerPort: number, path: string, method: string): Promise<IRoute>

    setItem(mockerPort: number, route: IRoute): boolean

    removeItem(mockerPort: number, routePath: string, routeMethod: string): boolean
}