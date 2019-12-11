import {expect} from 'chai'
import 'mocha'
import RequestShelf from "../../requestShelf/request-shelf";
import IRequest from "../../interfaces/IRequest";
import {GET} from "../../consts/methods-consts";
import IRequestShelf from "../../interfaces/IRequestShelf";

describe('Request Shelf', () => {

    it('Inserting and getting item from request shelf', () => {
        const requestShelf = new RequestShelf()
        let request: IRequest = getMockRequest()
        requestShelf.setRequest('1', "GET/oi",request)
        getAndCheckRequests(requestShelf, JSON.stringify([request]))
    })
    it('Getting deleted requests from a mocker', () => {
        const requestShelf = new RequestShelf()
        let request: IRequest = getMockRequest()
        requestShelf.setRequest('1', "GET/oi", request)
        getAndCheckRequests(requestShelf, JSON.stringify([request]))
        requestShelf.deleteRequests('1', "GET/oi")
        getAndCheckRequests(requestShelf, "[]")
    })
    it('Getting deleted requests from a mocker, setting and getting again', () => {
        const requestShelf = new RequestShelf()
        let request: IRequest = getMockRequest()
        requestShelf.setRequest('1', "GET/oi", request)
        getAndCheckRequests(requestShelf, JSON.stringify([request]))
        requestShelf.deleteRequests('1', "GET/oi")
        getAndCheckRequests(requestShelf, "[]")
        requestShelf.setRequest('1', "GET/oi", request)
        getAndCheckRequests(requestShelf, JSON.stringify([request]))
    })
    it('Getting requests from a empty mocker', () => {
        const requestShelf = new RequestShelf()
        getAndCheckRequests(requestShelf, "[]")
    })
})

function getMockRequest(): IRequest {
    return {
        ip: "127.0.0.1",
        header: "teste",
        body: "oi",
        method: GET,
        url: "/oi",
        date: new Date().toString()
    }
}

function getAndCheckRequests(requestShelf: IRequestShelf, expected: string) {
    let request: IRequest[] = requestShelf.getRequests('1', "GET/oi")
    expect(JSON.stringify(request)).to.equal(expected)
}

