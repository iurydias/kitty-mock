import { expect } from 'chai'
import 'mocha'
import IResponse from '../../interfaces/IResponse'
import axios from 'axios'
import { createServer, Server } from 'http'
import IJsend from '../../interfaces/IJsend'
import RoutesGetterHandler from '../../handlers/routes-getter-handler'
import RouteShelf from '../../routeShelf/route-shelf'
import IRoute from '../../interfaces/IRoute'
import IRouteShelf from '../../interfaces/IRouteShelf'

describe('Getter routes handler', () => {

  it('Getting routes with existent route', (done) => {
    let routeShelf: IRouteShelf = new RouteShelf()
    routeShelf.setItem('7003', getMockRoute())
    let success: number = 0
    let server: Server = createServer(async (req, res) => {
      new RoutesGetterHandler(routeShelf).handle(req).then((response) => {
        checkResponse(response, 'success', `[{"path":"/oi","method":"GET"}]`, undefined, 200)
        success++
      })
      res.statusCode = 200
      res.end()
    })
    server.listen(7003)
    axios.delete('http://127.0.0.1:7003?path=/oi&method=get').finally(() => {
      expect(success).to.equal(1)
      server.close()
      done()
    })
  })
  it('Getting routes with no existent route', (done) => {
    let routeShelf: IRouteShelf = new RouteShelf()
    let success: number = 0
    let server: Server = createServer(async (req, res) => {
      new RoutesGetterHandler(routeShelf).handle(req).then((response) => {
        checkResponse(response, 'success', `[]`, undefined, 200)
        success++
      })
      res.statusCode = 200
      res.end()
    })
    server.listen(7003)
    axios.delete('http://127.0.0.1:7003?path=/oi&method=get').finally(() => {
      expect(success).to.equal(1)
      server.close()
      done()
    })
  })
})

async function checkResponse (response: IResponse, status: string, data: string, message: string, code: number) {
  let jsend: IJsend = JSON.parse(response.body)
  expect(jsend.status).to.equal(status)
  expect(jsend.data).to.equal(data)
  expect(jsend.message).to.equal(message)
  expect(response.code).to.equal(code)
}

function getMockRoute (): IRoute {
  return {
    filters: { path: '/oi', method: 'GET' },
    response: { code: 200, body: 'oioi' }
  }
}
