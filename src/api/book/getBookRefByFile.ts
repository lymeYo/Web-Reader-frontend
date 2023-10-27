const getBookRefByFile = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('book', file)

  const res = await fetch('http://localhost:5000/upload/book', {
    method: 'POST',
    body: formData
  })
  const bookRef = await res.json()
  return bookRef
}

export default getBookRefByFile
