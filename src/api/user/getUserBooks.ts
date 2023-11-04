import { getUserStore, getBookStore } from '@/store'
import authentication from '../user/authentication'
import { getErrorMessage, isTokenResError } from '../user/constants'
import type { TBookData } from '@/store/constants'

const getUserBooks = async (username: string, password: string): Promise<TBookData[] | null> => {
  let userBooks: TBookData[] | null = null

  try {
    const token = await authentication(username, password)
    if (isTokenResError(token)) throw new Error('Something going wrong')

    const res = await fetch('http://localhost:5000/user/books', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      method: 'GET'
    })
    if (!res.ok) throw new Error('Something going wrong')

    userBooks = await res.json()
  } catch (err) {
    console.error(err)
  }

  return userBooks
}

export default getUserBooks
