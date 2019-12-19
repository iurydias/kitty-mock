import { expect } from 'chai'
import 'mocha'
import IResponse from '../../interfaces/IResponse'
import axios from 'axios'
import { createServer, Server } from 'http'
import IJsend from '../../interfaces/IJsend'
import HistoryGetterHandler from '../../handlers/history-getter-handler'
import RequestShelf from '../../requestShelf/request-shelf'
import IRequestShelf from '../../interfaces/IRequestShelf'
import IRequest from '../../interfaces/IRequest'

describe('Create history getter handler', () => {

  it('Getting history with request', () => {
    let requestShelf: IRequestShelf = new RequestShelf()
    requestShelf.setRequest('7003', 'GET/oi', getMockRequest())
    let success: number = 0
    let server: Server = createServer(async (req, res) => {
      new HistoryGetterHandler(requestShelf).handle(req).then((response) => {
        checkResponse(response, 'success', '[{"ip":"127.0.0.1","header":{},"body":"oi","method":"GET","url":"/oi","date":"data"}]', undefined, 200)
        success++
      })
      res.statusCode = 200
      res.end()
    })
    server.listen(7003)
    return axios.post('http://127.0.0.1:7003?path=/oi&method=get').finally(() => {
      expect(success).to.equal(1)
      return server.close()
    })
  })
  it('Getting history no request', () => {
    let requestShelf: IRequestShelf = new RequestShelf()
    let success: number = 0
    let server: Server = createServer(async (req, res) => {
      new HistoryGetterHandler(requestShelf).handle(req).then((response) => {
        checkResponse(response, 'success', '[]', undefined, 200)
        success++
      })
      res.statusCode = 200
      res.end()
    })
    server.listen(7004)
    return axios.post('http://127.0.0.1:7004?path=/oi&method=get').finally(() => {
      expect(success).to.equal(1)
      return server.close()
    })
  })
  it('Getting history with request but not for the required', () => {
    let requestShelf: IRequestShelf = new RequestShelf()
    let success: number = 0
    requestShelf.setRequest('7005', 'GET/oi', getMockRequest())
    let server: Server = createServer(async (req, res) => {
      new HistoryGetterHandler(requestShelf).handle(req).then((response) => {
        checkResponse(response, 'success', '[]', undefined, 200)
        success++
      })
      res.statusCode = 200
      res.end()
    })
    server.listen(7005)
    return axios.post('http://127.0.0.1:7005?path=/oii&method=get').finally(() => {
      expect(success).to.equal(1)
      return server.close()
    })
  })
})

function checkResponse (response: IResponse, status: string, data: string, message: string, code: number) {
  let jsend: IJsend = JSON.parse(response.body)
  expect(jsend.status).to.equal(status)
  expect(JSON.stringify(jsend.data)).to.equal(data)
  expect(jsend.message).to.equal(message)
  expect(response.code).to.equal(code)
}

function getMockRequest (): IRequest {
  return {
    ip: '127.0.0.1',
    header: {
      cookie: undefined,
      authorization: undefined,
      connection: undefined,
      contentType: undefined,
      contentLanguage: undefined
    },
    body: 'oi',
    method: 'GET',
    url: '/oi',
    date: 'data'
  }
}

