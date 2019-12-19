import { expect } from 'chai'
import 'mocha'
import RouteShelf from '../../routeShelf/route-shelf'
import IRoute from '../../interfaces/IRoute'
import IRouteShelf from '../../interfaces/IRouteShelf'

describe('Route Shelf', () => {

  it('Inserting and getting item from route shelf', () => {
    const routeShelf = new RouteShelf()
    routeShelf.setItem(1, getMockRoute())
    return getAndCheckItem(routeShelf)
  })
  it('Inserting repeated item on route shelf', async () => {
    const routeShelf = new RouteShelf()
    routeShelf.setItem(1, getMockRoute())
    routeShelf.setItem(1, getMockRoute())
    await getAndCheckItem(routeShelf)
    expect(routeShelf.removeItem(1, '/oi', 'POST')).to.true
    await getInexistentItem(routeShelf)

  })
  it('Getting a deleted item', async () => {
    const routeShelf = new RouteShelf()
    routeShelf.setItem(1, getMockRoute())
    await getAndCheckItem(routeShelf)
    expect(routeShelf.removeItem(1, '/oi', 'POST')).to.true
    await getInexistentItem(routeShelf)
  })
})

function getMockRoute (): IRoute {
  return {
    filters: { path: '/oi', method: 'POST' },
    response: { code: 200, body: 'oioi' }
  }
}

function getAndCheckItem (routeShelf: IRouteShelf) {
  return routeShelf.getItem(1, '/oi', 'POST').then(async route => {
    expect(route.filters.path).to.equal('/oi')
    expect(route.filters.method).to.equal('POST')
    if (typeof route.response != 'function') {
      expect(route.response.code).to.equal(200)
      expect(route.response.body).to.equal('oioi')
    }
  })
}

async function getInexistentItem (routeShelf: IRouteShelf) {
  let fail: number = 0
  await routeShelf.getItem(1, '/oi', 'POST')
    .catch(code => {
        expect(code).to.equal(404)
        fail++
      }
    )
  expect(fail).to.equal(1)
}