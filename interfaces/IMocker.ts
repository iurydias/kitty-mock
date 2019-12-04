import IRoute from './IRoute'

export default interface IMocker {
  loadServer (): void

  runServer (): Promise<string>

  addRoute (route: IRoute): void

  stopServer (): Promise<null>
}