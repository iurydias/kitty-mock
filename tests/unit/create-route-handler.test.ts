import { expect } from 'chai'
import 'mocha'
import IResponse from '../../interfaces/IResponse'
import axios from 'axios'
import CreateRouteHandler from '../../handlers/create-route-handler'
import { createServer, IncomingMessage, Server } from 'http'
import IRoute from '../../interfaces/IRoute'
import IRouteShelf from '../../interfaces/IRouteShelf'
import RouteShelf from '../../routeShelf/route-shelf'
import IJsend from '../../interfaces/IJsend'

describe('Create route handler', () => {

  it('Testing create route handler', (done) => {
    let routeShelf: IRouteShelf = new RouteShelf()
    let success: number = 0
    let failed: number = 0
    const handler = new CreateRouteHandler(routeShelf)
    let server: Server = createServer(async (req, res) => {
      handler.handle(req).then((response) => {
        checkResponse(response, 'success', 'route successfully created', 200)
        success++
      }).catch(() => {
        failed++
      })
      res.statusCode = 200
      res.end()
    })
    server.listen(5003)
    axios.post('http://127.0.0.1:5003', '{"filters":{"path":"/oi","method":"POST"},"response":{"code":200,"body":"sddfsdf"}}').finally(() => {
      expect(success).to.equal(1)
      expect(failed).to.equal(0)
      server.close()
      done()
    })
  })
  it('Testing create existent route again on handler', (done) => {
    let routeShelf: IRouteShelf = new RouteShelf()
    routeShelf.setItem('5006', getMockRoute())
    let success: number = 0
    let failed: number = 0
    const handler = new CreateRouteHandler(routeShelf)
    let server: Server = createServer((req, res) => {
      handler.handle(req).then((response) => {
        checkResponse(response, 'fail', 'route already created in this mocker', 403)
        success++
      }).catch(() => {
        failed++
      })
      res.statusCode = 200
      res.end()
    })
    server.listen(5006)
    axios.post('http://127.0.0.1:5006', '{"filters":{"path":"/oi","method":"GET"},"response":{"code":200,"body":"sddfsdf"}}').finally(() => {
      expect(success).to.equal(1)
      expect(failed).to.equal(0)
      server.close()
      done()
    })
  })
  it('Testing create mocker route with no body', (done) => {
    let routeShelf: IRouteShelf = new RouteShelf()
    let success: number = 0
    let failed: number = 0
    const handler = new CreateRouteHandler(routeShelf)
    let server: Server = createServer((req, res) => {
      handler.handle(req).then((response) => {
        checkResponse(response, 'fail', 'request missing body. Unexpected end of JSON input', 500)
        success++
      }).catch(() => {
        failed++
      })
      res.statusCode = 200
      res.end()
    })
    server.listen(5004)
    axios.post('http://127.0.0.1:5004').finally(() => {
      expect(success).to.equal(1)
      expect(failed).to.equal(0)
      server.close()
      done()
    })
  })
  it('Testing create route with invalid path handler', (done) => {
    let routeShelf: IRouteShelf = new RouteShelf()
    routeShelf.setItem('5005', getMockRoute())
    let success: number = 0
    let failed: number = 0
    const handler = new CreateRouteHandler(routeShelf)
    let server: Server = createServer((req, res) => {
      handler.handle(req).then((response) => {
        checkResponse(response, 'fail', 'request with invalid route path', 403)
        success++
      }).catch(() => {
        failed++
      })
      res.statusCode = 200
      res.end()
    })
    server.listen(5005)
    axios.post('http://127.0.0.1:5005', '{"filters":{"path":"oi","method":"POST"},"response":{"code":200,"body":"sddfsdf"}}').finally(() => {
      expect(success).to.equal(1)
      expect(failed).to.equal(0)
      server.close()
      done()
    })
  })
})

async function checkResponse (response: IResponse, status: string, message: string, code: number) {
  let jsend: IJsend = JSON.parse(response.body)
  expect(jsend.status).to.equal(status)
  expect(jsend.data).to.equal(undefined)
  expect(jsend.message).to.equal(message)
  expect(code).to.equal(code)
}

function getMockRoute (): IRoute {
  return {
  filters: {path: '/oi', method: 'GET'},
    response: {code: 200, body: "oioi"}
  }
}