import {expect} from 'chai'
import 'mocha'
import RouteShelf from '../../routeShelf/route-shelf'
import IRoute from '../../interfaces/IRoute'
import IRouteShelf from '../../interfaces/IRouteShelf'
import { GET, POST } from '../../consts/methods-consts'

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
        expect(routeShelf.removeItem('1', '/oi', POST)).to.true
        await getInexistentItem(routeShelf,'/oi',  POST)

    })
    it('Getting a deleted item', async () => {
        const routeShelf = new RouteShelf()
        routeShelf.setItem('1', getMockRoute())
        await getAndCheckItem(routeShelf)
        expect(routeShelf.removeItem('1', '/oi', POST)).to.true
        await getInexistentItem(routeShelf, '/oi', POST)
    })
    it('Deleting one item', async () => {
        const routeShelf = new RouteShelf()
        routeShelf.setItem('1', getMockRoute())
        routeShelf.setItem('1', getMockRoute2())
        await getAndCheckItem(routeShelf)
        expect(routeShelf.removeItem('1', '/oii', GET)).to.true
        await getInexistentItem(routeShelf, '/oii', GET)
        await getAndCheckItem(routeShelf)
    })
})

function getMockRoute(): IRoute {
    return {
        filters: {path: '/oi', method: 'POST'},
        response: {code: 200, body: 'oioi'}
    }
}
function getMockRoute2(): IRoute {
    return {
        filters: {path: '/oii', method: 'GET'},
        response: {code: 200, body: 'oioi'}
    }
}
async function getAndCheckItem(routeShelf: IRouteShelf) {
    let success: number = 0
    let fail: number = 0
    await routeShelf.getItem('1', '/oi', 'POST').then(async route => {
        expect(route.filters.path).to.equal('/oi')
        expect(route.filters.method).to.equal('POST')
        if (typeof route.response != 'function') {
            expect(route.response.code).to.equal(200)
            expect(route.response.body).to.equal('oioi')
        }
        success++
    }).catch(() => fail++)
    expect(success).to.equal(1)
    expect(fail).to.equal(0)
}

async function getInexistentItem(routeShelf: IRouteShelf, path: string, method: string) {
    let success: number = 0
    let fail: number = 0
    await routeShelf.getItem('1', path, method)
        .then(() => success++)
        .catch(code => {
                expect(code).to.equal(404)
                fail++
            }
        )
    expect(success).to.equal(0)
    expect(fail).to.equal(1)
}