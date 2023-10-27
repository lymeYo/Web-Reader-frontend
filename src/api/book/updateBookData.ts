import { getAuthStore, getBookStore } from '@/store'
import authentication from '../user/authentication'
import { getErrorMessage, isTokenResError } from '../user/constants'

const updateBookData = async (bookRef: string, epubCfi: string | null): Promise<void> => {
  const postBody = {
    bookRef,
    epubCfi
  }
  const { username, password } = getAuthStore()
  if (!username || !password) return

  try {
    const token = await authentication(username, password)
    if (isTokenResError(token)) {
      throw new Error('Something going wrong')
    }

    const res = await fetch('http://localhost:5000/user/profile', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, PATCH, OPTIONS'
      },
      method: 'PATCH',
      body: JSON.stringify(postBody)
    })
    const data = res.json()

    return data
  } catch (err) {
    console.error(err)
  }
}

export default updateBookData
