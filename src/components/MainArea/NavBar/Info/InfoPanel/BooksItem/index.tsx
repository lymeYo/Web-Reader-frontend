import RemoveWhiteImg from '@/assets/images/remove-white.png'
import RemoveRedImg from '@/assets/images/remove-red.png'
import RemoveImg from '@/assets/images/remove.svg'
import { observer } from 'mobx-react-lite'
import { getUserStore } from '@/store'

import styles from './styles.module.css'
import { useCallback, useRef, useState } from 'react'

type BooksItemProps = {
  title: string
  bookId: number
  ind: number
  closeHandler: () => void
  handleDelete: (bookId: number, bookName: string) => void
}

const BooksItem = observer(({ title, ind, bookId, closeHandler, handleDelete }: BooksItemProps) => {
  const { updateBookName } = getUserStore()
  const inputValueRef = useRef<HTMLInputElement>(null)
  const [isEditMode, setEditMode] = useState(false)
  const handleEdit = (isEdit: boolean) => {
    if (isEdit) {
      const newBookName = inputValueRef.current?.value
      if (newBookName) updateBookName(bookId, newBookName)
    } else {
      inputValueRef.current?.focus()
    }

    setEditMode(!isEdit)
  }

  const { openedBookId, openBook } = getUserStore()
  const handleOpenBook = useCallback(async () => {
    if (isEditMode) return

    await openBook(bookId)
    closeHandler()
  }, [isEditMode])

  const handleDeleteBook = async () => {
    handleDelete(bookId, title)
  }

  return (
    <li className={`${styles.item} ${openedBookId == bookId ? styles.active : ''}`}>
      <button
        className={`${styles.title} ${isEditMode ? styles['edit-mode'] : ''}`}
        onClick={handleOpenBook}
      >
        <input
          type='text'
          readOnly={!isEditMode}
          defaultValue={title}
          ref={inputValueRef}
          autoFocus={isEditMode}
        />
      </button>
      <div className={styles.buttons}>
        <SvgEdit handleEdit={handleEdit} isEdit={isEditMode} />
        <SvgRemove handleClick={handleDeleteBook} />
      </div>
    </li>
  )
})

type SvgRemoveProps = {
  handleClick: () => void
}
const SvgRemove = ({ handleClick }: SvgRemoveProps) => (
  <button className={styles.wrapper} onClick={handleClick}>
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth='1.5'
      stroke='currentColor'
      className={`${styles['remove-image']} ${styles.image}`}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
      />
    </svg>
  </button>
)

type SvgEditProps = {
  isEdit: boolean
  handleEdit: (isEdit: boolean) => void
}
const SvgEdit = ({ isEdit, handleEdit }: SvgEditProps) => {
  const handleClick = useCallback(() => {
    handleEdit(isEdit)
  }, [isEdit])

  return (
    <button className={styles.wrapper} onClick={handleClick}>
      {!isEdit ? (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className={`${styles['edit-image']} ${styles.image}`}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125'
          />
        </svg>
      ) : (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className={`${styles['done-image']} ${styles.image}`}
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
        </svg>
      )}
    </button>
  )
}

export default BooksItem
