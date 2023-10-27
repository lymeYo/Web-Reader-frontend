import Cookies from 'js-cookie'
import authentication from './authentication'
import {
  getErrorMessage,
  type TuserErrorData,
  type TuserData,
  type TtokenErrorData,
  isTokenResError
} from './constants'

const login = async (username: string, password: string): Promise<TuserData | TuserErrorData> => {
  let userData: TuserData | TuserErrorData = {
    errMessage: getErrorMessage(404)
  }

  try {
    const token = await authentication(username, password)

    if (isTokenResError(token)) {
      userData = {
        errMessage: getErrorMessage(token.errStatus)
      }
      throw new Error('Something going wrong')
    }
    Cookies.set('token', token)

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
  }

  return userData
}

export default login
