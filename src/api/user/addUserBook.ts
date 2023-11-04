import { getUserStore } from '@/store'
import type { TBookData } from '@/store/constants'
import authentication from './authentication'
import { isTokenResError } from './constants'

const addUserBook = async (bookRef: string, bookName: string | null): Promise<TBookData | null> => {
  let book: TBookData | null = null

  try {
    const { username, password } = getUserStore()
    if (!username || !password) throw new Error('Something going wrong')
    const token = await authentication(username, password)
    if (isTokenResError(token)) throw new Error('Something going wrong')

    const resBody = {
      bookRef,
      bookName,
      epubCfi: null
    }
    const res = await fetch('http://localhost:5000/user/books', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(resBody)
    })

    if (!res.ok) throw new Error('Something going wrong')

    book = await res.json()
  } catch (err) {
    console.error(err)
  }

  return book
}

export default addUserBook
