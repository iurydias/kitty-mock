import IHandler from './IHandler'
import IFilter from './IFilter'
import IResponse from './IResponse'

export default interface IRequest {
  filters: IFilter,
  response: IResponse | IHandler
}
