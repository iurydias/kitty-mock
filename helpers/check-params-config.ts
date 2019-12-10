import IConfig from '../interfaces/IConfig'

export default function checkParamsConfig(config: IConfig): string | undefined {
    if (!checkHost(config.host)) {
        return 'host with invalid format'
    }
    if (!checkPort(config.serverPort)) {
        return 'port with invalid format'
    }
    if (!checkRange(config.mockersPortsRange)) {
        return 'mocker ports range with invalid format'
    }
}

function checkHost(host: string): boolean {
    let hostRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.?){4}|([-_a-z0-9]+\.)([-_a-z0-9]+)$/i
    return hostRegex.test(host)
}

function checkPort(port: string): boolean {
    let portRegex = /^[\d]{2,}$/
    return portRegex.test(port)
}

function checkRange(range: string): boolean {
    let rangeRegex = /^\d+-\d+$/
    return rangeRegex.test(range)
}