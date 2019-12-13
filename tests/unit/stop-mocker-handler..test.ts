import { expect } from 'chai'
import 'mocha'
import IResponse from '../../interfaces/IResponse'
import axios from 'axios'
import { createServer, Server } from 'http'
import IJsend from '../../interfaces/IJsend'
import IRoute from '../../interfaces/IRoute'
import StopMockerHandler from '../../handlers/stop-mocker-handler'
import Mocker from '../../mocker/mocker'
import IMocker from '../../interfaces/IMocker'

describe('Stop mocker handler', () => {

  it('Stopping a mocker', async () => {
    let mocker: IMocker = new Mocker('127.0.0.1', 8001, undefined, undefined)
    mocker.loadServer()
    mocker.runServer()
    let success: number = 0
    let fail: number = 0
    let server: Server = createServer(async (req, res) => {
      new StopMockerHandler(mocker).handle(req).then((response) => {
        checkResponse(response, 'success', undefined, undefined, 204)
        success++
      }).finally(() => {
        res.statusCode = 200
        res.end()
      })
    })
    server.listen(7003)
    await axios.get('http://127.0.0.1:7003')
    expect(success).to.equal(1)
    await axios.get('http://127.0.0.1:8001').catch(() => {
      fail++
    })
    expect(fail).to.equal(1)
    server.close()
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
