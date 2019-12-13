import 'mocha'
import getPort from '../../helpers/get_port'
import { expect } from 'chai'

describe('Get port', () => {

  it('Getting a port with no used ports', () => {
    const portRange: number[] = [6000, 6001, 6002, 6003]
    const usedPorts: number[] = []
    let port: number = getPort(portRange, usedPorts)
    expect(port >= 6000 && port <= 6003).to.be.true
  })
  it('Getting a port with used ports', () => {
    const portRange: number[] = [6000, 6001, 6002, 6003]
    const usedPorts: number[] = [6000, 6001]
    let port: number = getPort(portRange, usedPorts)
    expect(port >= 6002 && port <= 6003).to.be.true
  })
  it('Getting a port with one free port', () => {
    const portRange: number[] = [6000, 6000]
    const usedPorts: number[] = []
    let port: number = getPort(portRange, usedPorts)
    expect(port == 6000).to.be.true
  })
  it('Getting a port with no free port', () => {
    const portRange: number[] = [6000, 6002]
    const usedPorts: number[] = [6000, 6002]
    let port: number = getPort(portRange, usedPorts)
    expect(port).to.be.undefined
  })
})



