import { expect } from 'chai'
import 'mocha'
import IResponse from '../../interfaces/IResponse'
import CreateMockerHandler from '../../handlers/create-mocker-handler'
import axios from 'axios'
import { inRange } from 'lodash'
import IJsend from '../../interfaces/IJsend'

describe('Testing create mocker handler', () => {

  it('Creating a mocker', async () => {
    let response: IResponse = await new CreateMockerHandler([5006, 5010]).handle(undefined)
    expect(response.code).to.equal(200)
    let jsend: IJsend = JSON.parse(response.body)
    expect(jsend.status).to.equal('success')
    expect(jsend.message).to.equal('mocker successfully created')
    let data = JSON.parse(jsend.data)
    expect(inRange(data.port, 5006, 5011)).to.equal(true)
    await checkMockerStatus(data.port)
    await deleteMocker(data.port)
  })
  it('Deleting a mocker', async () => {
    let response: IResponse = await new CreateMockerHandler([6010, 6014]).handle(undefined)
    expect(response.code).to.equal(200)
    let jsend: IJsend = JSON.parse(response.body)
    expect(jsend.status).to.equal('success')
    expect(jsend.message).to.equal('mocker successfully created')
    expect(jsend.data).not.undefined
    let data = JSON.parse(jsend.data)
    await deleteMocker(data.port)
  })
})

async function deleteMocker (port: string) {
  let success: number = 0
  let failed: number = 0
  await axios.delete('http://localhost:' + port + '/').then((response) => {
    expect(response.status).to.equal(204)
    success++
  }).catch(() => {
    failed++
  })
  expect(failed).to.equal(0)
  expect(success).to.equal(1)
}

async function checkMockerStatus (port: string) {
  let success: number = 0
  let failed: number = 0
  await axios.get('http://localhost:' + port + '/').then((response) => {
    expect(response.status).to.equal(204)
    expect(response.data).to.equal('')
    success++
  }).catch(() => {
    failed++
  })
  expect(failed).to.equal(0)
  expect(success).to.equal(1)
}