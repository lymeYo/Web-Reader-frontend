import type { TbookInfo } from './constants'

const getBookNameByRef = async (ref: string): Promise<string | null> => {
  let data: string | null = null

  try {
    const resData = { bookRef: ref }
    const res = await fetch('http://localhost:5000/upload/book/get-name', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resData)
    })
    data = await res.json()
  } catch (e) {
    console.error(e)
  }

  return data
}

export default getBookNameByRef
