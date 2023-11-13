import { useEffect, useRef, useState } from 'react'
import type { TdisplayMode, TshowConfirmPanel } from './constants'
import { observer } from 'mobx-react-lite'
import ContentDisplay from './ContentDisplay'
import Headers from './Headers'
import { getUserStore } from '@/store'

import styles from './styles.module.css'
import parentStyles from '../../styles.module.css'
import { navbarId } from '../../constants'
import setPositionOnNavBar from '../../utils/SetPositionOnNavBar'

interface AccountProps {
  isOpen: boolean
  openHandler: (isOpen?: boolean) => void
  openConfirmPanel: TshowConfirmPanel
}

const InfoPanel = observer(({ isOpen, openHandler, openConfirmPanel }: AccountProps) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const { dropBook } = getUserStore()
  const [curMode, setCurMode] = useState<TdisplayMode>('toc')
  const close = () => openHandler(false)

  const handleBookDelete = (bookId: number, bookName: string) => {
    const dropBookHandler = () => {
      if (bookId) dropBook(bookId)
    }
    const dropBookMessage = `Вы действительно хотите удалить книгу "${bookName}"?` //!TODO `Вы действительно хотите удалить книгу ${bookName}?` не влезает в окно
    openConfirmPanel(true, dropBookHandler, dropBookMessage)
  }

  useEffect(() => {
    const resizeHandler = () => {
      const element = elementRef.current
      if (element) setPositionOnNavBar(element)
    }

    window.addEventListener('resize', resizeHandler)
    resizeHandler()

    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  return (
    <div
      className={`${parentStyles['info-panel']} ${isOpen ? '' : parentStyles.close}`}
      ref={elementRef}
    >
      <Headers mode={curMode} close={close} setMode={setCurMode} />
      <ContentDisplay
        closePanelHandler={openHandler}
        mode={curMode}
        handleBookDelete={handleBookDelete}
      />
    </div>
  )
})

export default InfoPanel
