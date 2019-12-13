import IQuery from '../interfaces/IQuery'

export function checkQuery (query: IQuery): string | undefined {
  if (query.path == undefined) {
    return 'request query missing path'
  } else if (query.method == undefined) {
    return 'request query missing method'
  }
}