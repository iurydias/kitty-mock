import IConfig from '../../interfaces/IConfig'
import { expect } from 'chai'
import checkParamsConfig from '../../helpers/check-params-config'

describe('Check params', () => {
  it('Check valid params', () => {
    let config: IConfig = {
      host: '0.0.0.0',
      mockersPortsRange: '6000-5000',
      serverPort: '4000'
    }
    expect(checkParamsConfig(config)).to.be.undefined
  })
  it('Check params with invalid host', () => {
    let config: IConfig = {
      host: 'sdfsdf',
      mockersPortsRange: '6000-5000',
      serverPort: '4000'
    }
    expect(checkParamsConfig(config)).to.equal('host with invalid format')
  })
  it('Check params with invalid port range', () => {
    let config: IConfig = {
      host: '0.0.0.0',
      mockersPortsRange: '6d000-5000',
      serverPort: '4000'
    }
    expect(checkParamsConfig(config)).to.equal('mocker ports range with invalid format')
  })
  it('Check params with invalid server port', () => {
    let config: IConfig = {
      host: '0.0.0.0',
      mockersPortsRange: '6000-5000',
      serverPort: '4hg000'
    }
    expect(checkParamsConfig(config)).to.equal('port with invalid format')
  })
})