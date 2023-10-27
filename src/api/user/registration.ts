import { type TuserData, type TuserErrorData, getErrorMessage } from './constants'
import login from './login'

const registartion = async (
  username: string,
  password: string
): Promise<TuserData | TuserErrorData> => {
  let userData: TuserData | TuserErrorData = {
    errMessage: getErrorMessage(404)
  }
  const postBody = {
    username,
    password
  }

  try {
    const res = await fetch('http://localhost:5000/auth/registration', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(postBody)
    })
    if (!res.ok) {
      userData = {
        errMessage: getErrorMessage(res.status)
      }
      throw new Error('Something going wrong')
    }
    userData = await login(username, password)
  } catch (err) {
    console.error(err)
  }

  return userData
}

export default registartion
