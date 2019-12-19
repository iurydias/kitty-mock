import { expect } from 'chai'
import 'mocha'
import IResponse from '../../interfaces/IResponse'
import axios from 'axios'
import { createServer, Server } from 'http'
import IJsend from '../../interfaces/IJsend'
import MockerHealthCheckerHandler from '../../handlers/mocker-health-checker-handler'

describe('Health checker handler', () => {
  it('Testing heath checker', (done) => {
    let success: number = 0
    let server: Server = createServer((req, res) => {
      new MockerHealthCheckerHandler().handle(req).then((response) => {
        checkResponse(response, 'success', undefined, 204)
        success++
      })
      res.statusCode = 200
      res.end()
    })
    server.listen(7008)
    axios.delete('http://127.0.0.1:7008').finally(() => {
      expect(success).to.equal(1)
      server.close()
      done()
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

