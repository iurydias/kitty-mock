import IBuffer from '../interfaces/IBuffer'
import { createServer, Server, ServerResponse } from 'http'
import IRoute from '../interfaces/IRoute'
import getJsend from '../helpers/get-jsend'
import IResponse from '../interfaces/IResponse'
import IMocker from '../interfaces/IMocker'
import ErrnoException = NodeJS.ErrnoException

export default class Mocker implements IMocker {
  private buffer: IBuffer
  private port: number
  private server: Server
  private hostname: string

  constructor (hostname: string, port: number, buffer: IBuffer) {
    this.buffer = buffer
    this.port = port
    this.hostname = hostname
  }

  public loadServer () {
    this.server = createServer((req, res) => {
      let route: IRoute[] = this.buffer.getItems(this.port.toString(), req.url)
      if (route) {
        let existingRouteWithMethod: IRoute = route.find((route) => {
          return route.method == req.method
        })
        console.log('route encontrado: ', existingRouteWithMethod, req.url, req.method)
        if (existingRouteWithMethod) {
          existingRouteWithMethod.handler.handle(req).then((resp: IResponse) => {
            Mocker.respRequest(res, resp)
          }).catch((resp: IResponse) => {
            Mocker.respRequest(res, resp)
          })
        } else {
          Mocker.respRequest(res, { code: 405, jsend: undefined })
        }
      } else {
        Mocker.respRequest(res, { code: 404, jsend: getJsend(404, undefined, 'Not found') })
      }
    })
  }

  private static respRequest (res: ServerResponse, resp: IResponse) {
    //res.statusCode = resp.code
    //res.setHeader('Connection', 'close')
    res.writeHead(resp.code, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(resp.jsend))
  }

  public runServer (): Promise<string> {
    return new Promise((resolve, reject) => {
      this.server.listen(this.port, this.hostname, () => {
        resolve(`New mocker running at http://${this.hostname}:${this.port}/`)
      })
      this.server.on('error', (e: ErrnoException) => {
        if (e.code === 'EADDRINUSE') {
          reject('Address in use, retrying...')
        }
      })
    })
  }

  public addRoute (route: IRoute) {
    console.log('New route added to server ' + this.port + ' - Path: ' + route.path + ', Method: ' + route.method)
    this.buffer.setItem(this.port.toString(), route)

  }

  public stopServer (): Promise<Error | null> {
    return new Promise((resolve, reject) => {
      this.server.close((error) => error ? reject(error) : resolve(null))
    })
  }

}