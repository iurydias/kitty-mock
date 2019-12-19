import { expect } from 'chai'
import getJsend from '../../helpers/get-jsend'

describe('Get jsend', () => {
  it('Get success jsend', () => {
    expect(getJsend({
      statusCode: 200,
      data: 'oi',
      message: 'teste'
    })).to.equal('{"status":"success","data":"oi","message":"teste"}')
  })
  it('Get failed jsend', () => {
    expect(getJsend({
      statusCode: 400,
      data: 'oi',
      message: 'teste'
    })).to.equal('{"status":"fail","data":"oi","message":"teste"}')
  })
  it('Get error jsend', () => {
    expect(getJsend({
      statusCode: 505,
      data: 'oi',
      message: 'teste'
    })).to.equal('{"status":"error","data":"oi","message":"teste"}')
  })
})