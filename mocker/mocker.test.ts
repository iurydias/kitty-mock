import { expect } from 'chai'
import 'mocha'
import Mocker from './mocker'
import IResponse from '../interfaces/IResponse'
import axios from 'axios'
import Buffer from '../buffer/buffer'
import { IncomingMessage } from 'http'

describe('Mocker', () => {

  it('Creating route', async () => {
    let buffer = new Buffer()
    const mocker = new Mocker('127.0.0.1', 5008, buffer)
    mocker.loadServer()
    await mocker.runServer()
    mocker.addRoute({
      path: '/oi', method: 'GET', handler: {
        handle (req: IncomingMessage): Promise<IResponse> {
          return new Promise(resolve => {
            resolve({ code: 200, jsend: { status: 'success', data: 'oi', message: 'oioi' } })
          })
        }
      }
    })
    let responseData: string = ''
    let success: number = 0
    let failed: number = 0
    await axios.get('http://127.0.0.1:5008/oi')
      .then((response) => {
        success++
        responseData = JSON.stringify(response.data)
      })
      .catch((error) => {
        failed++
      })
    expect(failed).to.equal(0)
    expect(success).to.equal(1)
    expect(responseData).to.equal('{"status":"success","data":"oi","message":"oioi"}')
  })
  it('Stopping server', async () => {
    let buffer = new Buffer()
    const mocker = new Mocker('127.0.0.1', 5009, buffer)
    mocker.loadServer()
    await mocker.runServer()
    mocker.addRoute({
      path: '/oi', method: 'GET', handler: {
        handle (req: IncomingMessage): Promise<IResponse> {
          return new Promise(resolve => {
            resolve({ code: 200, jsend: { status: 'success', data: 'oi', message: 'oioi' } })
          })
        }
      }
    })
    await mocker.stopServer()
    let success: number = 0
    let failed: number = 0
    await axios.get('http://127.0.0.1:5009/oioi')
      .then((response) => {
        success++
      })
      .catch((error) => {
        failed++
      })
    expect(failed).to.equal(1)
    expect(success).to.equal(0)
  })

})