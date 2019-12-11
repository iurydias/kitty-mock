import IRouteShelf from '../interfaces/IRouteShelf'
import { createServer, IncomingMessage, Server, ServerResponse } from 'http'
import IRoute from '../interfaces/IRoute'
import getJsend from '../helpers/get-jsend'
import IResponse from '../interfaces/IResponse'
import IMocker from '../interfaces/IMocker'
import { performance } from 'perf_hooks'
import { KITTY } from '../consts/kitty'
import IHandler from '../interfaces/IHandler'
import IRequestShelf from '../interfaces/IRequestShelf'
import IRequest from '../interfaces/IRequest'
import getRequestBody from '../helpers/get-request-body'
import ErrnoException = NodeJS.ErrnoException

const chalk = require('chalk')

export default class Mocker implements IMocker {
    private routeShelf: IRouteShelf
    readonly requestShelf: IRequestShelf
    private port: number
    private server: Server
    private hostname: string

    constructor (hostname: string, port: number, routeShelf: IRouteShelf, requestShelf: IRequestShelf) {
        this.routeShelf = routeShelf
        this.port = port
        this.hostname = hostname
        this.requestShelf = requestShelf
    }

    public loadServer (): void {
        this.server = createServer((req, res) => {
            let initialTime: number = performance.now()
            let path: string = req.url.split('?', 1)[0]
            this.routeShelf.getItem(this.port.toString(), path, req.method).then(route => {
                if (typeof route.response != 'function') {
                    let response: IResponse = route.response as IResponse
                    this.respRequest(res, response, req, initialTime)
                } else {
                    let handle: IHandler = route.response as IHandler
                    handle(req).then((resp: IResponse) => {
                        this.respRequest(res, resp, req, initialTime)
                    })
                }
                this.hydrateRequest(req).then(request => {
                    this.requestShelf.setRequest(this.port.toString(), route.filters.method.toUpperCase() + route.filters.path, request)
                })
            }).catch((code) => {
                this.respRequest(res, {
                    code: code,
                    body: getJsend({ statusCode: code, data: undefined, message: undefined }
                    )
                }, req, initialTime)
            })
        })
    }

    private respRequest (res: ServerResponse, resp: IResponse, req: IncomingMessage, initialTime: number): void {
        res.writeHead(resp.code, { 'Content-Type': 'application/json' })
        res.end(resp.body, () => {
            this.printLog(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''), resp.code, req.method, req.url, this.getExecutionTime(performance.now(), initialTime))
        })
    }

    public runServer (): Promise<string> {
        return new Promise((resolve, reject) => {
            this.server.listen(Number(this.port), this.hostname, () => {
                resolve(`New mocker running at http://${this.hostname}:${this.port}/`)
            })
            this.server.on('error', (e: ErrnoException) => {
                if (e.code === 'EADDRINUSE') {
                    reject('Address in use, retrying...')
                }
            })
        })
    }

    public addRoute (route: IRoute): void {
        console.log('New route added to mocker on port ' + this.port + ' | ' + ' '.repeat(7 - route.filters.method.length) + route.filters.method + ' ' + route.filters.path)
        this.routeShelf.setItem(this.port.toString(), route)

    }

    public stopServer (): Promise<null> {
        console.log('Closing mocker on port ' + this.port)
        return new Promise((resolve, reject) => {
            this.server.close((error) => error ? reject(error) : resolve(null))
        })
    }

    public printLog (date: string, code: number, method: string, path: string, time: string): void {
        let repeatSpaceOnTimeExecution: number = 20 - time.length
        let repeatSpaceOnMethod: number = 7 - method.length
        switch (true) {
            case (code >= 500):
                console.log(`${KITTY} ${date} | ${chalk.bgRed.bold(`  ${code}  `)} | ${' '.repeat(repeatSpaceOnTimeExecution)}${time} ms | ${' '.repeat(repeatSpaceOnMethod)}${method}  ${path}`)
                return
            case (code >= 400 && code < 500):
                console.log(`${KITTY} ${date} | ${chalk.black.bgYellow.bold(`  ${code}  `)} | ${' '.repeat(repeatSpaceOnTimeExecution)}${time} ms | ${' '.repeat(repeatSpaceOnMethod)}${method}  ${path}`)
                return
            default:
                console.log(`${KITTY} ${date} | ${chalk.bgGreen.bold(`  ${code}  `)} | ${' '.repeat(repeatSpaceOnTimeExecution)}${time} ms | ${' '.repeat(repeatSpaceOnMethod)}${method}  ${path}`)
        }
    }

    private getExecutionTime (t1: number, t0: number): string {
        return (t1 - t0).toString()
    }

    private async hydrateRequest (req: IncomingMessage): Promise<IRequest> {
        let body: string = await getRequestBody(req)
        return {
            ip: req.socket.remoteAddress,
            header: req.headers.cookie,
            body: body,
            method: req.method,
            url: req.url,
            date: new Date().toString()
        }
    }
}