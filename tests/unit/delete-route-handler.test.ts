import {expect} from 'chai'
import 'mocha'
import IResponse from '../../interfaces/IResponse'
import axios from 'axios'
import {createServer, Server} from 'http'
import IRoute from '../../interfaces/IRoute'
import IRouteShelf from '../../interfaces/IRouteShelf'
import RouteShelf from '../../routeShelf/route-shelf'
import DeleteRouteHandler from '../../handlers/delete-route-handler'
import IJsend from '../../interfaces/IJsend'
import { GET, POST } from '../../consts/methods-consts'

describe('Delete route handler', () => {
  it('Testing delete a existent route', () => {
    let routeShelf: IRouteShelf = new RouteShelf()
    routeShelf.setItem(5019, getMockRoute())
    let success: number = 0
    let failed: number = 0
    const handler = new DeleteRouteHandler(routeShelf)
    let server: Server = createServer((req, res) => {
      handler.handle(req).then((response) => {
        checkResponse(response, 'success', undefined, 204)
        success++
      }).catch(() => failed++)
      res.statusCode = 200
      res.end()
    })
    server.listen(5019)
    return axios.delete('http://127.0.0.1:5019?path=/oi&method=GET').finally(() => {
      expect(success).to.equal(1)
      expect(failed).to.equal(0)
      return server.close()
    })
  })
  it('Testing delete a inexistent route', () => {
    let routeShelf: IRouteShelf = new RouteShelf()
    let success: number = 0
    let failed: number = 0
    const handler = new DeleteRouteHandler(routeShelf)
    let server: Server = createServer((req, res) => {
      handler.handle(req).then((response) => {
        checkResponse(response, 'fail', 'route does not exist', 404)
        success++
      }).catch(() => failed++)
      res.statusCode = 200
      res.end()
    })
    server.listen(5020)
    return axios.delete('http://127.0.0.1:5020?path=/oi&method=GET').finally(() => {
      expect(success).to.equal(1)
      expect(failed).to.equal(0)
      return server.close()
    })
  })

})

function checkResponse (response: IResponse, status: string, message: string, code: number) {
  let jsend: IJsend = JSON.parse(response.body)
  expect(jsend.status).to.equal(status)
  expect(jsend.data).to.equal(undefined)
  expect(jsend.message).to.equal(message)
  expect(response.code).to.equal(code)
}

function getMockRoute(): IRoute {
    return {
        filters: {path: '/oi', method: 'GET'},
        response: {code: 200, body: 'oioi'}
    }
}