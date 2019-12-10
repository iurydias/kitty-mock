import IHandler from './IHandler'
import IFilter from './IFilter'
import IResponse from './IResponse'

export default interface IRoute {
    filters: IFilter,
    response: IResponse | IHandler
}
