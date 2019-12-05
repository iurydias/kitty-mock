import { expect } from 'chai'
import checkRequest from '../../helpers/check-request'
import { POST } from '../../consts/methods-consts'
import IResponse from '../../interfaces/IResponse'
import checkParamsConfig from '../../helpers/check-params-config'
import IConfig from '../../interfaces/IConfig'
//
// describe('Check request', () => {
//   it('Check request invalid path', async () => {
//     let config: IConfig = {
//       filters: {path: "53345sd", method: POST},
//       response:{code: 200, body: "json"}
//     }
//     expect(checkParamsConfig(request.filters, request.response as IResponse)).to.equal("request with invalid route path")
//   })
//
// })