import IHeaders from './IHeaders'

export default interface IRequest {
  ip: string
  body: string
  header: IHeaders
  url: string
  method: string
  date: string
}