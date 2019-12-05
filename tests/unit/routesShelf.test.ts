import { expect } from 'chai'
import 'mocha'
import RouteShelf from '../../routeShelf/route-shelf'
import { IncomingMessage } from 'http'
import IResponse from '../../interfaces/IResponse'
import IRoute from '../../interfaces/IRoute'
import IRouteShelf from '../../interfaces/IRouteShelf'

describe('Route Shelf', () => {

  it('Inserting and getting item from route shelf', async () => {
    const routeShelf = new RouteShelf()
    routeShelf.setItem('1', getMockRoute())
    await getAndCheckItem(routeShelf)
  })
  it('Inserting repeated item on route shelf', async () => {
    const routeShelf = new RouteShelf()
    routeShelf.setItem('1', getMockRoute())
    routeShelf.setItem('1', getMockRoute())
    await getAndCheckItem(routeShelf)
    expect(routeShelf.removeItem('1', '/oi', 'POST')).to.true
    await getInexistentItem(routeShelf)

  })
  it('Getting a deleted item', async () => {
    const routeShelf = new RouteShelf()
    routeShelf.setItem('1', getMockRoute())
    await getAndCheckItem(routeShelf)
    expect(routeShelf.removeItem('1', '/oi', 'POST')).to.true
    await getInexistentItem(routeShelf)
  })
})

function getMockRoute (): IRoute {
  return {
    filters: { path: '/oi', method: 'POST' },
    response: { code: 200, body: 'oioi' }
  }
}

async function getAndCheckItem (routeShelf: IRouteShelf) {
  let success: number = 0
  let fail: number = 0
  await routeShelf.getItem('1', '/oi', 'POST').then(async route => {
    expect(route.filters.path).to.equal('/oi')
    expect(route.filters.method).to.equal('POST')
    if(typeof route.response != "function"){
      expect(route.response.code).to.equal(200)
      expect(route.response.body).to.equal("oioi")
    }
    success++
  }).catch(() => fail++)
  expect(success).to.equal(1)
  expect(fail).to.equal(0)
}

async function getInexistentItem (routeShelf: IRouteShelf) {
  let success: number = 0
  let fail: number = 0
  await routeShelf.getItem('1', '/oi', 'POST')
    .then(() => success++)
    .catch(code => {
        expect(code).to.equal(404)
        fail++
      }
    )
  expect(success).to.equal(0)
  expect(fail).to.equal(1)
}