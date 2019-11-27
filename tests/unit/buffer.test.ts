import { expect } from 'chai'
import 'mocha'
import RouteShelf from '../../buffer/route-shelf'
import { IncomingMessage } from 'http'
import IResponse from '../../interfaces/IResponse'
import IRoute from '../../interfaces/IRoute'

describe('Buffer', () => {

  it('Inserting and getting item from buffer', async () => {
    const buffer = new RouteShelf()
    buffer.setItem('1', getMockRoute())
    let item: IRoute[] = buffer.getItems('1', '/oi')
    let control: number = 0
    expect(item.length).to.equal(1)
    expect(item[0].path).to.equal('/oi')
    expect(item[0].method).to.equal('POST')
    await item[0].handler.handle(undefined).then(
      (response) => {
        expect(JSON.stringify(response)).to.equal('{"code":200,"jsend":{"status":"success","data":"oi","message":"oioi"}}')
        control++
      }
    )
    expect(control).to.equal(1)
  })
  it('Inserting repeated item on buffer', async () => {
    const buffer = new RouteShelf()
    buffer.setItem('1', getMockRoute())
    buffer.setItem('1', getMockRoute())
    let item: IRoute[] = buffer.getItems('1', '/oi')
    let control: number = 0
    expect(item.length).to.equal(1)
    expect(item[0].path).to.equal('/oi')
    expect(item[0].method).to.equal('POST')
    await item[0].handler.handle(undefined).then(
      (response) => {
        expect(JSON.stringify(response)).to.equal('{"code":200,"jsend":{"status":"success","data":"oi","message":"oioi"}}')
        control++
      }
    )
    expect(control).to.equal(1)
    buffer.removeItem('1', '/oi', 'POST')
    item = buffer.getItems('1', '/oi')
    expect(item).to.equal(undefined)

  })
  it('Getting a deleted item', () => {
    const buffer = new RouteShelf()
    buffer.setItem('1', getMockRoute())
    expect(JSON.stringify(buffer.getItems('1', '/oi'))).to.not.undefined
    buffer.removeItem('1', '/oi', 'POST')
    expect(buffer.getItems('1', '/oi')).to.be.undefined
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