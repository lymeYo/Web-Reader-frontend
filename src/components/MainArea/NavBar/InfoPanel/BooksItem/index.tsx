import RemoveWhiteImg from '@/assets/images/remove-white.png'
import RemoveRedImg from '@/assets/images/remove-red.png'
import { observer } from 'mobx-react-lite'
import { getUserStore } from '@/store'

import styles from './styles.module.css'

type BooksItemProps = {
  title: string
  bookId: number
  ind: number
  closeHandler: () => void
  handleDelete: (bookId: number, bookName: string) => void
}

const BooksItem = observer(({ title, ind, bookId, closeHandler, handleDelete }: BooksItemProps) => {
  const { openedBookId, openBook } = getUserStore()
  const handleOpenBook = async () => {
    await openBook(bookId)
    closeHandler()
  }
  const handleDeleteBook = async () => {
    handleDelete(bookId, title)
  }

  return (
    <li className={`${styles.item} ${openedBookId == bookId ? styles.active : ''}`}>
      <button className={styles.title} onClick={handleOpenBook}>
        {title}
      </button>
      <button onClick={handleDeleteBook}>
        <img className={styles['remove-img']} src={RemoveWhiteImg.src} alt='remove' />
      </button>
    </li>
  )
})
export default BooksItem
