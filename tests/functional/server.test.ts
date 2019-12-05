import 'mocha'
import { expect } from 'chai'
import axios, { Method } from 'axios'
import { inRange } from 'lodash'
import server from '../../server'
import IJsend from '../../interfaces/IJsend'
import IMocker from '../../interfaces/IMocker'

describe('Server teste 1', () => {
  let server: IMocker
  before(async () => {
    server = await runServer('127.0.0.1', '4000', '5000-6000')
  })
  after(async () => {
    await server.stopServer()
  })

  it('Check mocker root functionality', async () => {
    let success: number = 0
    let failed: number = 0
    await createANewMocker('4000', [5000, 6000]).then(async (port) => {
      await checkMockerStatus(port).then(async () => {
        await deleteMocker(port).then(async () => {
          await checkDeletedMocker(port).then(() => {
            success++
          })
        })
      })
    }).catch(() => {
      failed++
    })
    expect(failed).to.equal(0)
    expect(success).to.equal(1)
  })
  it('Create two mockers in a range with one port', async () => {
    let success: number = 0
    let failed: number = 0
    await runServer('127.0.0.1', '4001', '6000-6001').then(async function (serverMockerRoot) {
      await createANewMocker('4001', [6000, 6001]).then(async (mockerPort) => {
        await createANewMockerWithFail().then(async () => {
          await deleteMocker(mockerPort)
          await serverMockerRoot.stopServer().then(() => {
            success++
          })
        })
      })
    }).catch(() => {
      failed++
    })
    expect(failed).to.equal(0)
    expect(success).to.equal(1)
  })
  it('Request to mocker server root with unacceptable methods', async () => {
    await makeRequestToServerRoot('put')
    await makeRequestToServerRoot('delete')
    await makeRequestToServerRoot('get')
    await makeRequestToServerRoot('patch')
  })
  it('Request to mocker server with unacceptable methods', async () => {
    let port: string = await createANewMocker('4000', [5000, 6000])
    await makeRequestToServer('put', port)
    await makeRequestToServer('post', port)
    await makeRequestToServer('patch', port)
    await deleteMocker(port)
  })
  it('Check server mocker functionality', async () => {
    await createANewMocker('4000', [5000, 6000]).then(async (port) => {
      await createANewRoute(port).then(async () => {
        await requestToARoute('POST', {
          port: port,
          path: '/oi',
          expectedCode: 200,
          expectedResponse: "\"sddfsdf\""
        }).then(async () => {
          await deleteARoute(port, { path: '/oi', method: 'POST' }).then(async () => {
            await requestToADeletedRoute('POST', { port: port, path: '/oi', expectedCode: 404 }).then(async () => {
              await deleteMocker(port)
            })
          })
        })
      })
    })
  })
  it('Check server mocker routes ', async () => {
    await createANewMocker('4000', [5000, 6000]).then(async (port) => {
      await createANewRoute(port).then(async () => {
        await requestToARoute('GET', {
          port: port,
          path: '/=^.^=/route',
          expectedCode: 200,
          expectedResponse: '{"status":"success","data":"[{\\"path\\":\\"/\\",\\"method\\":\\"GET\\"},{\\"path\\":\\"/\\",\\"method\\":\\"DELETE\\"},{\\"path\\":\\"/oi\\",\\"method\\":\\"POST\\"}]"}'
        })
      })
    })
  })
})

async function runServer (host: string, port: string, portsRange: string): Promise<IMocker> {
  return server({ host: host, serverPort: port, mockersPortsRange: portsRange })
}

async function makeRequestToServerRoot (method: Method) {
  let success: number = 0
  let failed: number = 0
  await axios({
    method: method,
    url: 'http://localhost:4000/create'
  }).then(() => {
    success++
  }).catch((error) => {
    expect(error.response.status).to.equal(405)
    failed++
  })
  expect(failed).to.equal(1)
  expect(success).to.equal(0)
}

async function makeRequestToServer (method: Method, port: string) {
  let success: number = 0
  let failed: number = 0
  await axios({
    method: method,
    url: 'http://localhost:' + port + '/'
  }).then(() => {
    success++
  }).catch((error) => {
    expect(error.response.status).to.equal(405)
    failed++
  })
  expect(failed).to.equal(1)
  expect(success).to.equal(0)
}

async function createANewMocker (port: string, range: Array<number>): Promise<string> {
  let body: string = ''
  let success: number = 0
  let failed: number = 0
  await axios.post(`http://localhost:${port}/create`).then((response) => {
    expect(response.status).to.equal(200)
    body = JSON.stringify(response.data)
    success++
  }).catch(() => {
    failed++
  })
  expect(failed).to.equal(0)
  expect(success).to.equal(1)
  let res: IJsend = JSON.parse(body)
  expect(res.status).to.equal('success')
  let mockerInfo = JSON.parse(res.data)
  expect(inRange(mockerInfo.port, range[0], range[1])).to.equal(true)
  expect(res.message).to.equal('mocker successfully created')
  return mockerInfo.port.toString()
}

async function deleteARoute (port: string, { path, method }) {
  let success: number = 0
  let failed: number = 0
  await axios.delete(`http://localhost:${port}/=^.^=/route?path=${path}&method=${method}`).then((response) => {
    expect(response.status).to.equal(204)
    success++
  }).catch(() => {
    failed++
  })
  expect(failed).to.equal(0)
  expect(success).to.equal(1)

}

async function createANewRoute (port: string) {
  let body: string = ''
  let success: number = 0
  let failed: number = 0
  await axios.post('http://localhost:' + port + '/=^.^=/route', '{"filters":{"path":"/oi","method":"POST"},"response":{"code":200,"body":"sddfsdf"}}').then((response) => {
    expect(response.status).to.equal(200)
    body = JSON.stringify(response.data)
    success++
  }).catch(() => {
    failed++
  })
  expect(failed).to.equal(0)
  expect(success).to.equal(1)
  let res: IJsend = JSON.parse(body)
  expect(res.status).to.equal('success')
  expect(res.data).to.be.undefined
  expect(res.message).to.equal('route successfully created')
}

async function requestToARoute (method: Method, { port, path, expectedCode, expectedResponse }) {
  let body: string = ''
  let success: number = 0
  let failed: number = 0
  await axios({
    method: method,
    url: 'http://localhost:' + port + path
  }).then((response) => {
    expect(response.status).to.equal(expectedCode)
    body = JSON.stringify(response.data)
    success++
  }).catch(() => {
    failed++
  })
  expect(failed).to.equal(0)
  expect(success).to.equal(1)
  expect(body).to.equal(expectedResponse)
}

async function requestToADeletedRoute (method: Method, { port, path, expectedCode }) {
  let success: number = 0
  let failed: number = 0
  await axios({
    method: method,
    url: 'http://localhost:' + port + path
  }).then(() => {
    success++
  }).catch((error) => {
    expect(error.response.status).to.equal(expectedCode)
    failed++
  })
  expect(success).to.equal(0)
  expect(failed).to.equal(1)
}

async function createANewMockerWithFail () {
  let success: number = 0
  let failed: number = 0
  await axios.post('http://localhost:4001/create').then((response) => {
    success++
  }).catch((error) => {
    expect(error.response.status).to.equal(500)
    failed++
  })
  expect(failed).to.equal(1)
  expect(success).to.equal(0)
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

async function checkDeletedMocker (port: string) {
  let success: number = 0
  let failed: number = 0
  await axios.get('http://localhost:' + port + '/').then((response) => {
    success++
  }).catch((error) => {
    failed++
  })
  expect(failed).to.equal(1)
  expect(success).to.equal(0)
}

async function deleteMocker (port: string) {
  let success: number = 0
  let failed: number = 0
  await axios.delete('http://localhost:' + port + '/').then((response) => {
    expect(response.status).to.equal(204)
    expect(response.data).to.equal('')
    success++
  }).catch(() => {
    failed++
  })
  expect(failed).to.equal(0)
  expect(success).to.equal(1)
}
