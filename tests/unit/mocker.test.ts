import { expect } from 'chai'
import 'mocha'
import Mocker from '../../mocker/mocker'
import axios from 'axios'
import RouteShelf from '../../routeShelf/route-shelf'
import IRoute from '../../interfaces/IRoute'
import IRequestShelf from '../../interfaces/IRequestShelf'
import RequestShelf from '../../requestShelf/request-shelf'

describe('Mocker', () => {

  it('Creating route', async () => {
    let routeShelf = new RouteShelf()
    let requestShelf: IRequestShelf = new RequestShelf()
    const mocker = new Mocker('127.0.0.1', 5008, routeShelf, requestShelf)
    mocker.loadServer()
    await mocker.runServer()
    mocker.addRoute(getMockRoute())
    let responseData: string = ''
    await axios.get('http://127.0.0.1:5008/oi')
      .then((response) => {
        responseData = JSON.stringify(response.data)
      })
    expect(responseData).to.equal('"oioi"')
    return mocker.stopServer()
  })
  it('Stopping server', async () => {
    let routeShelf = new RouteShelf()
    let requestShelf: IRequestShelf = new RequestShelf()
    const mocker = new Mocker('127.0.0.1', 5009, routeShelf, requestShelf)
    mocker.loadServer()
    await mocker.runServer()
    mocker.addRoute(getMockRoute())
    await mocker.stopServer()
    let success: number = 0
    let failed: number = 0
    await axios.get('http://127.0.0.1:5009/oioi')
      .then(() => success++)
      .catch(() => failed++)
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