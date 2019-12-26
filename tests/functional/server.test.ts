import 'mocha'
import { expect } from 'chai'
import axios, { Method } from 'axios'
import server from '../../server'
import IJsend from '../../interfaces/IJsend'
import IMocker from '../../interfaces/IMocker'
import IRoute from '../../interfaces/IRoute'
import { GET, POST } from '../../consts/methods-consts'
import IRequest from '../../interfaces/IRequest'

describe('Server teste 1', () => {
  let server: IMocker
  before(async () => server = await runServer('127.0.0.1', '4000', '5000-6000'))
  after(() => server.stopServer())

  it('Check mocker root functionality', () => {
    return createANewMocker('4000', [5000, 6000]).then((port) =>
      checkMockerStatus(port).then(() =>
        deleteMocker(port).then(() =>
          checkDeletedMocker(port)
        )
      )
    )
  })
  it('Create two mockers in a range with one port', () => {
    return runServer('127.0.0.1', '4001', '6000-6001').then((serverMockerRoot) =>
      createANewMocker('4001', [6000, 6001]).then((mockerPort) =>
        createANewMockerWithFail('4001').then(async () => {
          await deleteMocker(mockerPort)
          await serverMockerRoot.stopServer()
        })
      )
    )
  })
  it('Testing retrying', () => {
    return runServer('127.0.0.1', '4002', '4002-4004').then((serverMockerRoot) =>
      createANewMocker('4002', [4002, 4004]).then((mockerPort) =>
        createANewMockerWithFail('4002').then(async () => {
          await deleteMocker(mockerPort)
          await serverMockerRoot.stopServer()
        })
      )
    )
  })
  it('Request to mocker server root with unacceptable methods', () => {
    return Promise.all([
      requestToServerRootShouldFail('put'),
      requestToServerRootShouldFail('delete'),
      requestToServerRootShouldFail('get'),
      requestToServerRootShouldFail('patch'),
    ])
  })
  it('Request to mocker server with unacceptable methods', () => {
    return createANewMocker('4000', [5000, 6000])
      .then((port) => Promise.all([
        makeRequestToServer('put', port),
        makeRequestToServer('post', port),
        makeRequestToServer('patch', port)
      ]).then(() => deleteMocker(port)))
  })
  it('Check server mocker functionality', () =>
    createANewMocker('4000', [5000, 6000]).then((port) => {
      let route: IRoute = {
        filters: { path: '/oi', method: 'POST' },
        response: { code: 200, body: 'sddfsdf' }
      }
      return createANewRoute(port, 'success', 'route successfully created', route).then(() =>
        requestToARoute('POST', {
          port: port,
          path: '/oi',
          expectedCode: 200,
          expectedResponse: '"sddfsdf"'
        }).then(() =>
          deleteARoute(port, { path: '/oi', method: 'POST' }).then(() =>
            requestToARouteWithFailure('POST', {
              port: port,
              path: '/oi',
              expectedCode: 404
            }).then(() => deleteMocker(port))
          )
        )
      )
    })
  )
  it('Trying to request ina route with a different stablished method', () =>
    createANewMocker('4000', [5000, 6000]).then((port) => {
      let route: IRoute = {
        filters: { path: '/oi', method: 'POST' },
        response: { code: 200, body: 'sddfsdf' }
      }
      return createANewRoute(port, 'success', 'route successfully created', route).then(() =>
        requestToARouteWithFailure('GET', {
          port: port,
          path: '/oi',
          expectedCode: 405
        }).then(() => deleteMocker(port))
      )
    })
  )
  it('Requesting to a inexistent route', () =>
    createANewMocker('4000', [5000, 6000]).then((port) => {
      return requestToARouteWithFailure('GET', {
        port: port,
        path: '/oi',
        expectedCode: 404
      }).then(() => deleteMocker(port))
    })
  )
  it('Getting mocker routes with data', () =>
    createANewMocker('4000', [5000, 6000]).then((port) => {
      let route: IRoute = {
        filters: { path: '/oi', method: 'POST' },
        response: { code: 200, body: 'sddfsdf' }
      }
      return createANewRoute(port, 'success', 'route successfully created', route).then(() =>
        requestToARoute('GET', {
          port: port,
          path: '/=^.^=/route',
          expectedCode: 200,
          expectedResponse: '{"status":"success","data":"[{\\"path\\":\\"/oi\\",\\"method\\":\\"POST\\"}]"}'
        }).finally(() => deleteMocker(port))
      )
    })
  )
  it('Getting mocker routes with no data', () =>
    createANewMocker('4000', [5000, 6000]).then((port) => {
      return requestToARoute('GET', {
        port: port,
        path: '/=^.^=/route',
        expectedCode: 200,
        expectedResponse: '{"status":"success","data":"[]"}'
      }).finally(() => deleteMocker(port))
    })
  )
  it('Check server mocker creating repeated routes', () => {
    let route: IRoute = { filters: { path: '/oi', method: 'POST' }, response: { code: 200, body: 'sddfsdf' } }
    return createANewMocker('4000', [5000, 6000]).then((port) =>
      createANewRoute(port, 'success', 'route successfully created', route).then(() =>
        createANewRoute(port, 'fail', 'route already created in this mocker', route).finally(() =>
          deleteMocker(port)
        )
      )
    )
  })
  it('Check server mocker creating route with invalid path', () => {
    let route: IRoute = { filters: { path: 'oi', method: 'POST' }, response: { code: 200, body: 'sddfsdf' } }
    return createANewMocker('4000', [5000, 6000]).then((port) =>
      createANewRoute(port, 'fail', 'request with invalid route path', route).then(() =>
        deleteMocker(port)
      )
    )
  })
  it('Check server mocker creating route with invalid method', () => {
    let route: IRoute = { filters: { path: '/oi', method: 'POsST' }, response: { code: 200, body: 'sddfsdf' } }
    return createANewMocker('4000', [5000, 6000]).then((port) =>
      createANewRoute(port, 'fail', 'request with invalid route method', route).then(() =>
        deleteMocker(port)
      )
    )
  })
  it('Check server mocker creating route with invalid code', () => {
    let route: IRoute = { filters: { path: '/oi', method: 'POST' }, response: { code: 700, body: 'sddfsdf' } }
    return createANewMocker('4000', [5000, 6000]).then((port) =>
      createANewRoute(port, 'fail', 'request with invalid route response code', route).then(() =>
        deleteMocker(port)
      )
    )
  })
  it('Check server mocker creating route with invalid json', () => {
    let route: IRoute = { filters: { path: '/oi', method: 'POST' }, response: { code: 700, body: 'sddfsdf' } }
    return createANewMocker('4000', [5000, 6000]).then(async (port) =>
      tryCreateARouteWithInvalidJson(port, 'error', 'request missing body. Unexpected end of JSON input').then(() =>
        deleteMocker(port)
      )
    )
  })
  it('Creating route missing path', () => {
    let route = { filters: { method: 'POST' }, response: { code: 200, body: 'sddfsdf' } }
    return createANewMocker('4000', [5000, 6000]).then((port) =>
      createANewRoute(port, 'fail', 'request missing route path', route).then(() =>
        deleteMocker(port)
      )
    )
  })
  it('Creating route missing method', () => {
    let route = { filters: { path: '/oi' }, response: { code: 200, body: 'sddfsdf' } }
    return createANewMocker('4000', [5000, 6000]).then((port) =>
      createANewRoute(port, 'fail', 'request missing route method', route).then(() =>
        deleteMocker(port)
      )
    )
  })
  it('Creating route missing response', () => {
    let route = { filters: { path: '/oi', method: 'POST' } }
    return createANewMocker('4000', [5000, 6000]).then((port) =>
      createANewRoute(port, 'fail', 'request missing route response', route).then(() =>
        deleteMocker(port)
      )
    )
  })
  it('Creating route missing response code', () => {
    let route = { filters: { path: '/oi', method: 'POST' }, response: { code: 200 } }
    return createANewMocker('4000', [5000, 6000]).then((port) =>
      createANewRoute(port, 'fail', 'request missing route response body', route).then(() =>
        deleteMocker(port)
      )
    )
  })
  it('Creating route missing response body', () => {
    let route = { filters: { path: '/oi', method: 'POST' }, response: { body: 'sddfsdf' } }
    return createANewMocker('4000', [5000, 6000]).then((port) =>
      createANewRoute(port, 'fail', 'request missing route response code', route).then(() =>
        deleteMocker(port)
      )
    )
  })
  it('Checking route history functionality', () => {
    return createANewMocker('4000', [5000, 6000]).then(async (port) => {
      let route: IRoute = { filters: { path: '/oi', method: POST }, response: { code: 200, body: 'sddfsdf' } }
      await createANewRoute(port, 'success', 'route successfully created', route).then(() =>
        requestToARoute('POST', {
          port: port,
          path: '/oi',
          expectedCode: 200,
          expectedResponse: '"sddfsdf"'
        }).then(() =>
          getAndCheckRouteHistory(port, { path: '/oi', method: POST }).then(() =>
            deleteRouteHistory(port, { path: '/oi', method: POST }).then(() =>
              getAndCheckEmptyRouteHistory(port, { path: '/oi', method: POST }).then(() =>
                deleteMocker(port)
              )
            )
          )
        )
      )
    })
  })
  it('Getting history of a inexistent route', () =>
    createANewMocker('4000', [5000, 6000]).then((port) =>
      requestRouteHistoryWithFailure('GET', 404, port, { path: '/oi', method: POST }).then(() =>
        deleteMocker(port)
      )
    )
  )
  it('Getting history of route with inexistent method', () =>
    createANewMocker('4000', [5000, 6000]).then((port) => {
      let route: IRoute = { filters: { path: '/oi', method: POST }, response: { code: 200, body: 'sddfsdf' } }
      return createANewRoute(port, 'success', 'route successfully created', route).then(() =>
        requestRouteHistoryWithFailure('GET', 404, port, { path: '/oi', method: GET }).then(() =>
          deleteMocker(port)
        )
      )
    })
  )
  it('Deleting history of a inexistent route', () =>
    createANewMocker('4000', [5000, 6000]).then((port) =>
      requestRouteHistoryWithFailure('DELETE', 404, port, { path: '/oi', method: POST }).then(() =>
        deleteMocker(port)
      )
    )
  )
  it('Deleting history of route with inexistent method', () =>
    createANewMocker('4000', [5000, 6000]).then(async (port) => {
      let route: IRoute = { filters: { path: '/oi', method: POST }, response: { code: 200, body: 'sddfsdf' } }
      await createANewRoute(port, 'success', 'route successfully created', route).then(() =>
        requestRouteHistoryWithFailure('DELETE', 404, port, { path: '/oi', method: GET }).then(() =>
          deleteMocker(port)
        )
      )
    })
  )
  it('Request history with invalids methods', () =>
    createANewMocker('4000', [5000, 6000]).then(async (port) =>
      Promise.all([
        requestRouteHistoryWithFailure('POST', 405, port, { path: '/oi', method: GET }),
        requestRouteHistoryWithFailure('PATCH', 405, port, { path: '/oi', method: GET }),
        requestRouteHistoryWithFailure('PUT', 405, port, { path: '/oi', method: GET })
      ]).then(() => deleteMocker(port)
      )
    )
  )
})

function runServer (host: string, port: string, portsRange: string): Promise<IMocker> {
  return server({ host: host, serverPort: port, mockersPortsRange: portsRange })
}

function requestToServerRootShouldFail (method: Method) {
  return axios({
    method: method,
    url: 'http://localhost:4000/create'
  }).catch((error) => {
    expect(error.response.status).to.equal(405)
  })
}

function makeRequestToServer (method: Method, port: string) {
  return axios({
    method: method,
    url: 'http://localhost:' + port + '/'
  }).catch((error) => {
    expect(error.response.status).to.equal(405)
  })
}

async function createANewMocker (port: string, range: Array<number>): Promise<string> {
  let body: string = ''
  await axios.post(`http://localhost:${port}/create`).then((response) => {
    expect(response.status).to.equal(200)
    body = JSON.stringify(response.data)
  })
  let res: IJsend = JSON.parse(body)
  expect(res.status).to.equal('success')
  let mockerInfo = JSON.parse(res.data)
  expect(mockerInfo.port >= range[0] && range[1] >= mockerInfo.port).to.equal(true)
  expect(res.message).to.equal('mocker successfully created')
  return mockerInfo.port.toString()
}

function deleteARoute (port: string, { path, method }) {
  return axios.delete(`http://localhost:${port}/=^.^=/route?path=${path}&method=${method}`).then((response) => {
    expect(response.status).to.equal(204)
  })

}

async function getAndCheckRouteHistory (port: string, { path, method }) {
  let body: string = ''
  await axios.get(`http://localhost:${port}/=^.^=/history?path=${path}&method=${method}`).then((response) => {
    expect(response.status).to.equal(200)
    body = JSON.stringify(response.data)
  })
  let res: IJsend = JSON.parse(body)
  expect(res.status).to.equal('success')
  let history: IRequest[] = JSON.parse(JSON.stringify(res.data))
  expect(history[0].ip).to.equal('127.0.0.1')
  expect(history[0].body).to.equal('')
  expect(JSON.stringify(history[0].header)).to.equal(`{"connection":"close","contentType":"application/x-www-form-urlencoded"}`)
  expect(history[0].url).to.equal('/oi')
  expect(history[0].method).to.equal(POST)
  expect(history[0].date).to.be.not.undefined
}

async function getAndCheckEmptyRouteHistory (port: string, { path, method }) {
  await axios.get(`http://localhost:${port}/=^.^=/history?path=${path}&method=${method}`).then((response) => {
    expect(response.status).to.equal(200)
    expect(JSON.stringify(response.data)).to.equal('{"status":"success","data":[]}')
  })
}

async function requestRouteHistoryWithFailure (requestMethod: Method, expectedCode: number, port: string, { path, method }) {
  let failed: number = 0
  await axios({
    method: requestMethod,
    url: `http://localhost:${port}/=^.^=/history?path=${path}&method=${method}`
  }).catch((err) => {
    expect(err.response.status).to.equal(expectedCode)
    failed++
  })
  expect(failed).to.equal(1)
}

async function deleteRouteHistory (port: string, { path, method }) {
  let success: number = 0
  let failed: number = 0
  await axios.delete(`http://localhost:${port}/=^.^=/history?path=${path}&method=${method}`).then((response) => {
    expect(response.status).to.equal(204)
    success++
  }).catch(() => {
    failed++
  })
  expect(failed).to.equal(0)
  expect(success).to.equal(1)
}

async function createANewRoute (port: string, status: string, message: string, route: any) {
  let body: string = ''
  await axios.post('http://localhost:' + port + '/=^.^=/route', JSON.stringify(route)).then((response) => {
    expect(response.status).to.equal(200)
    body = JSON.stringify(response.data)
  }).catch((error) => {
    body = JSON.stringify(error.response.data)
  })
  let res: IJsend = JSON.parse(body)
  expect(res.status).to.equal(status)
  expect(res.data).to.be.undefined
  expect(res.message).to.equal(message)
}

async function tryCreateARouteWithInvalidJson (port: string, status: string, message: string) {
  let body: string = ''
  await axios.post('http://localhost:' + port + '/=^.^=/route', `{"sdfsdf":100`).then((response) => {
    expect(response.status).to.equal(200)
    body = JSON.stringify(response.data)
  }).catch((error) => {
    body = JSON.stringify(error.response.data)
  })
  let res: IJsend = JSON.parse(body)
  expect(res.status).to.equal(status)
  expect(res.data).to.be.undefined
  expect(res.message).to.equal(message)
}

async function requestToARoute (method: Method, { port, path, expectedCode, expectedResponse }) {
  let body: string = ''
  await axios({
    method: method,
    url: 'http://localhost:' + port + path
  }).then((response) => {
    expect(response.status).to.equal(expectedCode)
    body = JSON.stringify(response.data)
  })
  expect(body).to.equal(expectedResponse)
}

function requestToARouteWithFailure (method: Method, { port, path, expectedCode }) {
  return axios({
    method: method,
    url: 'http://localhost:' + port + path
  }).catch((error) => {
    expect(error.response.status).to.equal(expectedCode)
  })
}

function createANewMockerWithFail (port: string) {
  return axios.post(`http://localhost:${port}/create`).catch((error) => {
    expect(error.response.status).to.equal(500)
  })
}

function checkMockerStatus (port: string) {
  return axios.get('http://localhost:' + port + '/').then((response) => {
    expect(response.status).to.equal(204)
    expect(response.data).to.equal('')
  })
}

async function checkDeletedMocker (port: string) {
  let failed: number = 0
  await axios.get('http://localhost:' + port + '/').catch(() => {
    failed++
  })
  expect(failed).to.equal(1)
}

function deleteMocker (port: string) {
  return axios.delete('http://localhost:' + port + '/').then((response) => {
    expect(response.status).to.equal(204)
    expect(response.data).to.equal('')
  })
}
