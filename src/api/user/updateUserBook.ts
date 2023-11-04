import { getUserStore } from '@/store'
import authentication from './authentication'
import { isTokenResError } from './constants'
import type { TBookData } from '@/store/constants'

export type TbookDataForUpdate = {
  id: number
  epubCfi: string | null
  bookName: string | null
}

const updateUserBook = async ({
  id: bookId,
  bookName,
  epubCfi
}: TbookDataForUpdate): Promise<TBookData | null> => {
  let book: TBookData | null = null
  try {
    const { username, password } = getUserStore()
    if (!username || !password) throw new Error('Something going wrong')
    const token = await authentication(username, password)
    if (isTokenResError(token)) throw new Error('Something going wrong')
    const resBody = { bookId, bookName, epubCfi }
    const res = await fetch('http://localhost:5000/user/books', {
      method: 'PATCH',
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

export default updateUserBook
