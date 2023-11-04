import type { TbookInfo } from './constants'

const getBookRefByFile = async (file: File): Promise<TbookInfo | null> => {
  let data: TbookInfo | null = null

  try {
    const formData = new FormData()
    formData.append('book', file)

    const res = await fetch('http://localhost:5000/upload/book', {
      method: 'POST',
      body: formData
    })
    data = await res.json()
  } catch (e) {
    console.error(e)
  }
  return data
}

export default getBookRefByFile
