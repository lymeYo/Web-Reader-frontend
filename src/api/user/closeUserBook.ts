import { getUserStore } from '@/store'
import authentication from './authentication'
import { isTokenResError } from './constants'

const closeUserBook = async (): Promise<void> => {
  try {
    const { username, password } = getUserStore()
    if (!username || !password) throw new Error('Something going wrong')
    const token = await authentication(username, password)
    if (isTokenResError(token)) throw new Error('Something going wrong')

    const res = await fetch('http://localhost:5000/user/books/close', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bookId: 19 })
    })

    if (!res.ok) throw new Error('Something going wrong')

    const data = await res.json()
  } catch (err) {
    console.error(err)
  }
}

export default closeUserBook
