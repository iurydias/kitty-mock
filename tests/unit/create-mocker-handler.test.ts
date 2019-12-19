import 'mocha'
import {expect} from 'chai'
import IResponse from '../../interfaces/IResponse'
import CreateMockerHandler from '../../handlers/create-mocker-handler'
import axios from 'axios'
import IJsend from '../../interfaces/IJsend'
import IRequestShelf from '../../interfaces/IRequestShelf'
import RequestShelf from '../../requestShelf/request-shelf'

describe('Testing create mocker handler', () => {

  it('Creating a mocker', async () => {
    let requestShelf: IRequestShelf = new RequestShelf()
    let response: IResponse = await new CreateMockerHandler([5006, 5010], requestShelf).handle(undefined)
    expect(response.code).to.equal(200)
    let jsend: IJsend = JSON.parse(response.body)
    expect(jsend.status).to.equal('success')
    expect(jsend.message).to.equal('mocker successfully created')
    let data = JSON.parse(jsend.data)
    expect(data.port >= 5006 && data.port < 5011).to.be.true
    await checkMockerStatus(data.port)
    await deleteMocker(data.port)
  })
  it('Deleting a mocker', async () => {
    let requestShelf: IRequestShelf = new RequestShelf()
    let response: IResponse = await new CreateMockerHandler([6010, 6014], requestShelf).handle(undefined)
    expect(response.code).to.equal(200)
    let jsend: IJsend = JSON.parse(response.body)
    expect(jsend.status).to.equal('success')
    expect(jsend.message).to.equal('mocker successfully created')
    expect(jsend.data).not.undefined
    let data = JSON.parse(jsend.data)
    await deleteMocker(data.port)
  })
})

 function deleteMocker (port: string) {
  return axios.delete('http://localhost:' + port + '/').then((response) => {
    expect(response.status).to.equal(204)
  })
}

function checkMockerStatus(port: string) {
  return axios.get('http://localhost:' + port + '/').then((response) => {
        expect(response.status).to.equal(204)
        expect(response.data).to.equal('')
    })
}