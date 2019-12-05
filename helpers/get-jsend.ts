import { StatusError, StatusFail, StatusSuccess } from '../consts/jsend-consts'

export default function getJsend ({ statusCode, data, message }): string {
  let statusString: string = StatusSuccess
  switch (true) {
    case (statusCode >= 500):
      statusString = StatusError
    case (statusCode >= 400 && statusCode < 500):
      statusString = StatusFail
  }
  return JSON.stringify({ status: statusString, data: data, message: message })
}