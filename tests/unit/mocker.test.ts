import { expect } from 'chai'
import 'mocha'
import Mocker from '../../mocker/mocker'
import axios from 'axios'
import RouteShelf from '../../routeShelf/route-shelf'
import IRoute from '../../interfaces/IRoute'
import RequestShelf from '../../requestShelf/request-shelf'

describe('Mocker', () => {

  it('Creating route', async () => {
    let routeShelf = new RouteShelf()
    const requestShelf = new RequestShelf()
    const mocker = new Mocker('127.0.0.1', 5008, routeShelf, requestShelf)
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
    expect(responseData).to.equal('"oioi"')
    await mocker.stopServer()
  })
  it('Stopping server', async () => {
    let routeShelf = new RouteShelf()
    const requestShelf = new RequestShelf()
    const mocker = new Mocker('127.0.0.1', 5009, routeShelf, requestShelf)
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
    filters: { path: '/oi', method: 'GET' },
    response: { code: 200, body: 'oioi' }
  }
}