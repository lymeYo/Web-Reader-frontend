import { getUserStore } from '@/store'
import authentication from './authentication'
import { isTokenResError } from './constants'

const dropUserBook = async (bookId: number): Promise<void> => {
  try {
    const { username, password } = getUserStore()
    if (!username || !password) throw new Error('Something going wrong')
    const token = await authentication(username, password)
    if (isTokenResError(token)) throw new Error('Something going wrong')

    const resBody = { bookId }
    const res = await fetch('http://localhost:5000/user/books', {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(resBody)
    })

    if (!res.ok) throw new Error('Something going wrong')
  } catch (err) {
    console.error(err)
  }
}

export default dropUserBook
