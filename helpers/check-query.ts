import IFilter from '../interfaces/IFilter'

export function checkQuery (query: IFilter): string | undefined {
  if (query.path == undefined) {
    return 'request query missing path'
  } else if (query.method == undefined) {
    return 'request query missing method'
  }
}