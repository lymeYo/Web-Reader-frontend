import { getAuthStore } from '@/store'
import authentication from '../user/authentication'
import { isTokenResError } from '../user/constants'

const dropBook = async (): Promise<void> => {
  const { username, password } = getAuthStore()
  if (!username || !password) return

  try {
    const token = await authentication(username, password)

    if (isTokenResError(token)) {
      throw new Error('Something going wrong')
    }

    const res = await fetch('http://localhost:5000/user/drop-book', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  } catch (err) {
    console.error(err)
  }
}

export default dropBook
