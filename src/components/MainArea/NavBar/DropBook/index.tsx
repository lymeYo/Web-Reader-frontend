import BackIcon from '@/assets/images/arrow-left2-dark.png'
import Button from '../Button'
import { getBookStore } from '@/store'

import styles from './styles.module.css'
import parentStyles from '../styles.module.css'
import { useState } from 'react'
import { observer } from 'mobx-react-lite'

type DropBookProps = {
  isOpen: boolean
  openHandler: () => void
}

const DropBook = observer(({ isOpen, openHandler }: DropBookProps) => {
  const { dropBook } = getBookStore()

  const handleDropBook = () => {
    dropBook()
    openHandler()
  }

  const handleClick = () => {
    openHandler()
  }
  return (
    <>
      <Button url={BackIcon.src} onClick={handleClick} />
      <div
        className={`${styles['info-mess']} ${parentStyles['info-panel']} ${
          isOpen ? '' : styles.hide
        }`}
      >
        <p>Вы хотите закрыть книгу?</p>
        <div className={styles.buttons}>
          <button onClick={handleClick}>Нет</button>
          <button onClick={handleDropBook}>Да</button>
        </div>
      </div>
    </>
  )
})
export default DropBook
