import { expect } from 'chai'
import 'mocha'
import Mocker from '../../mocker/mocker'
import IResponse from '../../interfaces/IResponse'
import axios from 'axios'
import RouteShelf from '../../routeShelf/route-shelf'
import { IncomingMessage } from 'http'
import IRoute from '../../interfaces/IRoute'

describe('Mocker', () => {

  it('Creating route', async () => {
    let routeShelf = new RouteShelf()
    const mocker = new Mocker('127.0.0.1', "5008", routeShelf)
    mocker.loadServer()
    await mocker.runServer()
    mocker.addRoute(getMockRoute())
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
    await mocker.stopServer()
  })
  it('Stopping server', async () => {
    let routeShelf = new RouteShelf()
    const mocker = new Mocker('127.0.0.1', "5009", routeShelf)
    mocker.loadServer()
    await mocker.runServer()
    mocker.addRoute(getMockRoute())
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

function getMockRoute (): IRoute {
  return {
    path: '/oi', method: 'GET', handler: {
      handle (req: IncomingMessage): Promise<IResponse> {
        return new Promise(resolve => {
          resolve({ code: 200, jsend: { status: 'success', data: 'oi', message: 'oioi' } })
        })
      }
    }
  }
}
