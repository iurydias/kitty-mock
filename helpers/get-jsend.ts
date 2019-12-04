import IJsend from '../interfaces/IJsend'
import { StatusError, StatusFail, StatusSuccess } from '../consts/jsend-consts'

export default function getJsend (statusCode: number, data: string | undefined, message: string | undefined): IJsend {
  let statusString: string = StatusSuccess
  switch (true) {
    case (statusCode >= 500):
      statusString = StatusError
    case (statusCode >= 400 && statusCode < 500):
      statusString = StatusFail
  }
  return { status: statusString, data: data, message: message }
}