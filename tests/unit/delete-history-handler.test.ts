import { expect } from 'chai'
import 'mocha'
import IResponse from '../../interfaces/IResponse'
import axios from 'axios'
import { createServer, Server } from 'http'
import IJsend from '../../interfaces/IJsend'
import RequestShelf from '../../requestShelf/request-shelf'
import IRequestShelf from '../../interfaces/IRequestShelf'
import IRequest from '../../interfaces/IRequest'
import DeleteHistoryHandler from '../../handlers/delete-history-handler'

describe('Create delete history getter handler', () => {

  it('Deleting a history with request', () => {
    let requestShelf: IRequestShelf = new RequestShelf()
    requestShelf.setRequest('7003', 'GET/oi', getMockRequest())
    let success: number = 0
    let server: Server = createServer(async (req, res) => {
      new DeleteHistoryHandler(requestShelf).handle(req).then((response) => {
        checkResponse(response, 'success', undefined, undefined, 204)
        success++
      })
      res.statusCode = 200
      res.end()
    })
    server.listen(7003)
    return  axios.delete('http://127.0.0.1:7003?path=/oi&method=get').finally(() => {
      expect(success).to.equal(1)
      expect(JSON.stringify(requestShelf.getRequests('7003', 'GET/oi'))).to.equal('[]')
      return server.close()
    })
  })
  it('Deleting a history with no request', () => {
    let requestShelf: IRequestShelf = new RequestShelf()
    let success: number = 0
    let server: Server = createServer(async (req, res) => {
      new DeleteHistoryHandler(requestShelf).handle(req).then((response) => {
        checkResponse(response, 'success', undefined, undefined, 204)
        success++
      })
      res.statusCode = 200
      res.end()
    })
    server.listen(7003)
    return axios.delete('http://127.0.0.1:7003?path=/oi&method=get').finally(() => {
      expect(success).to.equal(1)
      expect(JSON.stringify(requestShelf.getRequests('7003', 'GET/oi'))).to.equal('[]')
      return server.close()
    })
  })
})

async function checkResponse (response: IResponse, status: string, data: string, message: string, code: number) {
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

