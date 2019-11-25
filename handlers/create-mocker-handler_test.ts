import { expect } from 'chai'
import 'mocha'
import IResponse from '../interfaces/IResponse'
import CreateMockerHandler from './create-mocker-handler'
import axios from 'axios'

describe('Testing create mocker handler', () => {

  it('Creating a mocker', async () => {
    let response: IResponse = await new CreateMockerHandler([5006, 5010]).handle(undefined)
    expect(response.code).to.equal(200)
    expect(response.jsend.status).to.equal('success')
    expect(response.jsend.message).to.equal('mocker successfully created')
    expect(response.jsend.data).not.undefined
    let data = JSON.parse(response.jsend.data)
    let success: number = 0
    let failed: number = 0
    await axios.get('http://127.0.0.1:' + data.port + '/=%5E.%5E=/route')
      .then((response) => {
        expect(response.status).to.equal(204)
        expect(response.data).to.equal('')
        success++
      })
      .catch((error) => {
        failed++
      })
    expect(failed).to.equal(0)
    expect(success).to.equal(1)
  })
  it('Deleting a mocker', async () => {
    let response: IResponse = await new CreateMockerHandler([5010, 5014]).handle(undefined)
    expect(response.code).to.equal(200)
    expect(response.jsend.status).to.equal('success')
    expect(response.jsend.message).to.equal('mocker successfully created')
    expect(response.jsend.data).not.undefined
    let data = JSON.parse(response.jsend.data)
    let success: number = 0
    let failed: number = 0
    await axios.delete('http://127.0.0.1:' + data.port + '/=%5E.%5E=/route')
      .then((response) => {
        expect(response.status).to.equal(204)
        expect(response.data).to.equal('')
        success++
      })
      .catch((error) => {
        failed++
      })
    expect(failed).to.equal(0)
    expect(success).to.equal(1)
  })
})