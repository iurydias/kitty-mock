import {expect} from 'chai'
import 'mocha'
import RequestShelf from "../../requestShelf/request-shelf";
import IRequest from "../../interfaces/IRequest";
import {GET} from "../../consts/methods-consts";
import IRequestShelf from "../../interfaces/IRequestShelf";

describe('Request Shelf', () => {

    it('Inserting and getting item from request shelf', () => {
        const requestShelf = new RequestShelf()
        requestShelf.setRequest('1', getMockRequest())
        getAndCheckRequests(requestShelf, "[{\"ip\":\"127.0.0.1\",\"header\":\"teste\",\"body\":\"oi\",\"method\":\"GET\",\"url\":\"/oi\"}]")
    })
    it('Getting deleted requests from a mocker', () => {
        const requestShelf = new RequestShelf()
        requestShelf.setRequest('1', getMockRequest())
        getAndCheckRequests(requestShelf, "[{\"ip\":\"127.0.0.1\",\"header\":\"teste\",\"body\":\"oi\",\"method\":\"GET\",\"url\":\"/oi\"}]")
        requestShelf.deleteRequests('1')
        getAndCheckRequests(requestShelf, "[]")
    })
})

function getMockRequest(): IRequest {
    return {
        ip: "127.0.0.1",
        header: "teste",
        body: "oi",
        method: GET,
        url: "/oi"
    }
}

function getAndCheckRequests(requestShelf: IRequestShelf, expected: string) {
    let request: IRequest[] = requestShelf.getRequests('1')
    expect(JSON.stringify(request)).to.equal(expected)
}

