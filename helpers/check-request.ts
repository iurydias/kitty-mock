import * as methods from '../consts/methods-consts'
import IResponse from '../interfaces/IResponse'
import IFilter from '../interfaces/IFilter'

export default function checkRequest(filters: IFilter, response: IResponse): string | undefined {
    if (filters == undefined) {
        return 'request missing filters'
    } else if (filters.path == undefined) {
        return 'request missing route path'
    } else if (!checkPath(filters.path)) {
        return 'request with invalid route path'
    } else if (filters.method == undefined) {
        return 'request missing route method'
    } else if (!checkMethod(filters.method.toUpperCase())) {
        return 'request with invalid route method'
    } else if (response == undefined) {
        return 'request missing route response'
    } else if (response.code == undefined) {
        return 'request missing route response code'
    } else if (!checkCode(response.code)) {
        return 'request with invalid route response code'
    } else if (response.body == undefined) {
        return 'request missing route response body'
    }
}

function checkMethod(method: string): boolean {
    return Object.values(methods).indexOf(method) >= 0
}

function checkPath(path: string): boolean {
    let re = /^\/[-_\w\d\/]*/
    return re.test(path)
}

function checkCode(code: number): boolean {
    return code >= 100 && code < 600
}