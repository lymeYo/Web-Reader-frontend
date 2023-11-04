import { getUserStore } from '@/store'
import type { TBookData } from '@/store/constants'
import authentication from './authentication'
import { isTokenResError } from './constants'

const openUserBook = async (bookId: number): Promise<TBookData | null> => {
  const bookData: TBookData | null = null
  try {
    const { username, password } = getUserStore()
    if (!username || !password) throw new Error('Something going wrong')
    const token = await authentication(username, password)
    if (isTokenResError(token)) throw new Error('Something going wrong')

    const resBody = { bookId }
    const res = await fetch('http://localhost:5000/user/books/open', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(resBody)
    })
    if (!res.ok) throw new Error('Something going wrong')

    const bookData = await res.json()
    return bookData
  } catch (err) {
    console.error(err)
  }

  return bookData
}

export default openUserBook
