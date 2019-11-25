import IRoute from './IRoute'

export default interface IMocker {
  loadServer ()

  runServer (): Promise<string>

  addRoute (route: IRoute)

  stopServer (): Promise<Error | null>
}