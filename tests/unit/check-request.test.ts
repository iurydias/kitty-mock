import {expect} from 'chai'
import checkRequest from '../../helpers/check-request'
import IRoute from '../../interfaces/IRoute'
import {POST} from '../../consts/methods-consts'
import IResponse from '../../interfaces/IResponse'

describe('Check request', () => {
    it('Check request invalid path', async () => {
        let request: IRoute = {
            filters: {path: '53345sd', method: POST},
            response: {code: 200, body: 'json'}
        }
        expect(checkRequest(request.filters, request.response as IResponse)).to.equal('request with invalid route path')
    })
    it('Check request invalid method', async () => {
        let request: IRoute = {
            filters: {path: '/oi', method: 'adasd'},
            response: {code: 200, body: 'json'}
        }
        expect(checkRequest(request.filters, request.response as IResponse)).to.equal('request with invalid route method')
    })
    it('Check request invalid response code', async () => {
        let request: IRoute = {
            filters: {path: '/oi', method: POST},
            response: {code: 50, body: 'json'}
        }
        expect(checkRequest(request.filters, request.response as IResponse)).to.equal('request with invalid route response code')
    })
    it('Check request with no path', async () => {
        let request: IRoute = {
            filters: {path: undefined, method: POST},
            response: {code: 50, body: 'json'}
        }
        expect(checkRequest(request.filters, request.response as IResponse)).to.equal('request missing route path')
    })
    it('Check request with no method', async () => {
        let request: IRoute = {
            filters: {path: '/oi', method: undefined},
            response: {code: 50, body: 'json'}
        }
        expect(checkRequest(request.filters, request.response as IResponse)).to.equal('request missing route method')
    })
    it('Check request with no response code', async () => {
        let request: IRoute = {
            filters: {path: '/oi', method: POST},
            response: {code: undefined, body: 'json'}
        }
        expect(checkRequest(request.filters, request.response as IResponse)).to.equal('request missing route response code')
    })
})