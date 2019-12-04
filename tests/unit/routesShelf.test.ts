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
    routeShelf.removeItem('1', '/oi', 'POST')
    await getInexistentItem(routeShelf)

  })
  it('Getting a deleted item', async () => {
    const routeShelf = new RouteShelf()
    routeShelf.setItem('1', getMockRoute())
    await getAndCheckItem(routeShelf)
    routeShelf.removeItem('1', '/oi', 'POST')
    await getInexistentItem(routeShelf)
  })
})

function getMockRoute (): IRoute {
  return {
    path: '/oi', method: 'POST', handler: {
      handle (req: IncomingMessage): Promise<IResponse> {
        return new Promise(resolve => {
          resolve({ code: 200, jsend: { status: 'success', data: 'oi', message: 'oioi' } })
        })
      }
    }
  }
}

async function getAndCheckItem (routeShelf: IRouteShelf) {
  let success: number = 0
  let fail: number = 0
  await routeShelf.getItem('1', '/oi', 'POST').then(async route => {
    let control: number = 0
    expect(route.path).to.equal('/oi')
    expect(route.method).to.equal('POST')
    await route.handler.handle(undefined).then(
      (response) => {
        expect(JSON.stringify(response)).to.equal('{"code":200,"jsend":{"status":"success","data":"oi","message":"oioi"}}')
        control++
      }
    )
    expect(control).to.equal(1)
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