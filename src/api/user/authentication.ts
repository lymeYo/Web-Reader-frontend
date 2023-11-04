import {
  type TtokenData,
  type TtokenErrorData
} from './constants'

const authentication = async (
  username: string,
  password: string
): Promise<TtokenData | TtokenErrorData> => {
  let status: number = 404
  try {
    const postBody = {
      username,
      password
    }

    const tokenRes = await fetch('http://localhost:5000/auth/login', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(postBody)
    })
    if (!tokenRes.ok) {
      status = tokenRes.status
      throw new Error('Something going wrong')
    }
    const { token }: { token: string } = await tokenRes.json()

    return token
  } catch (err) {
    console.error(err)
  }

  return {
    errStatus: status
  }
}

export default authentication
