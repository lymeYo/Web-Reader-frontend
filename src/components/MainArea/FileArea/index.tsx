import { useRef, type ChangeEvent } from 'react'
import { observer } from 'mobx-react-lite'
import AddFileImg from '@/assets/images/add.png'
import SendImg from '@/assets/images/send.png'
import { getBookStore, getUserStore } from '@/store'
import getBookRefByFile from '@/api/book/getBookRefByFile'
import Cookies from 'js-cookie'

import styles from './styles.module.css'
import { bookRefCookieKey } from '@/constants'
import type { TbookInfo } from '@/api/book/constants'

interface FileAreaProps {
  // handleBookLoad: (isLoad: boolean) => void
}

const FileArea = observer(() => {
  const { isLogin, addBook } = getUserStore()
  const { setBookRef } = getBookStore()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const textInputRef = useRef<HTMLInputElement>(null)

  const urlHandler = async () => {
    const bookUrl = textInputRef.current?.value ?? ''
    const fileExt = bookUrl.split('.').slice(-1)[0]

    const res = await fetch(bookUrl, {
      mode: 'no-cors'
    })
    const blob = await res.blob()
    const bookFile = new File([blob], `book.${fileExt}`, { type: blob.type })

    const bookInfo = await getBookRefByFile(bookFile)
    if (bookInfo) handleBookRef(bookInfo)
  }

  const fileHandler = async () => {
    const objectFiles = fileInputRef.current?.files
    if (!objectFiles) return

    const bookInfo = await getBookRefByFile(objectFiles[0])
    if (bookInfo) handleBookRef(bookInfo)
  }

  const handleBookRef = ({ bookRef, bookName }: TbookInfo) => {
    if (isLogin) {
      addBook(bookRef)
    } else {
      setBookRef(bookRef)
      Cookies.set(bookRefCookieKey, bookRef)
    }
  }

  const imitateFileInputClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <p className={styles.info}>
          Добро пожаловать в <span>Web Reader</span>, загрузите книгу или вставьте ссылку на её
          загрузку!
        </p>
        <form className={styles.form}>
          <input type='text' className={styles['text-input']} ref={textInputRef} />
          <input
            type='file'
            name='book'
            className={styles['file-input']}
            onChange={fileHandler}
            ref={fileInputRef}
          />
          <button type='button' className={styles['add-btn']} onClick={imitateFileInputClick}>
            <img src={AddFileImg.src} alt='add book' />
          </button>
          <button type='button' className={styles['send-btn']} onClick={urlHandler}>
            <img src={SendImg.src} alt='send book' />
          </button>
        </form>
      </div>
    </div>
  )
})
export default FileArea
