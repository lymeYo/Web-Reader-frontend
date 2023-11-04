export type TBookData = {
  id: number
  bookRef: string
  bookName: string
  epubCfi: string | null
}


export type Ttoc = {
  title: string
  href: string
}

export type Ttheme = 'light' | 'dark'