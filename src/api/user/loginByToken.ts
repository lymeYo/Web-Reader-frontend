import Cookies from 'js-cookie'
import authentication from './authentication'
import {
  getErrorMessage,
  type TuserErrorData,
  type TuserData,
  type TtokenErrorData,
  isTokenResError
} from './constants'
import { tokenCookieKey } from '@/constants'

const loginByToken = async (token: string): Promise<TuserData | TuserErrorData> => {
  let userData: TuserData | TuserErrorData = {
    errMessage: getErrorMessage(404)
  }

  try {
    const userRes = await fetch('http://localhost:5000/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      method: 'GET'
    })
    if (!userRes.ok) {
      userData = {
        errMessage: getErrorMessage(userRes.status)
      }
      throw new Error('Something going wrong')
    }

    userData = (await userRes.json()) as TuserData
  } catch (err) {
    console.error(err)
    Cookies.remove(tokenCookieKey)
  }

  return userData
}

export default loginByToken
