import { observer } from 'mobx-react-lite'
import MenuImg from '@/assets/images/menu.png'
import Button from '../Button'
import parentStyles from '../styles.module.css'
import { useRef, useState } from 'react'
import type { TdisplayMode, TshowConfirmPanel } from './constants'
import ContentDisplay from './ContentDisplay'
import Headers from './Headers'

import styles from './styles.module.css'
import { getUserStore } from '@/store'
import ConfirmWindow from '../ConfirmWindow'

type TdeleteBookData = {
  bookId: number
  bookName: string
}

interface AccountProps {
  isOpen: boolean
  openHandler: (isOpen?: boolean) => void
  openConfirmPanel: TshowConfirmPanel
}

const InfoPanel = observer(({ isOpen, openHandler, openConfirmPanel }: AccountProps) => {
  const { dropBook } = getUserStore()
  const [isConfirmWindowOpen, setConfirmWindowOpen] = useState<boolean>(false)
  const deleteBookData = useRef<TdeleteBookData>()
  const [curMode, setCurMode] = useState<TdisplayMode>('toc')
  const close = () => openHandler(false)
  const open = () => openHandler(true)
  const toggle = () => openHandler()

  const handleBookDelete = (bookId: number, bookName: string) => {
    const dropBookHandler = () => {
      if (bookId) dropBook(bookId)
    }
    const dropBookMessage = 'Вы действительно хотите удалить книгу?' //!TODO `Вы действительно хотите удалить книгу ${bookName}?` не влезает в окно
    openConfirmPanel(true, dropBookHandler, dropBookMessage)
  }

  return (
    <>
      <Button url={MenuImg.src} onClick={toggle} /> {/* меню */}
      <div className={`${parentStyles['info-panel']} ${isOpen ? '' : parentStyles.close}`}>
        <Headers mode={curMode} close={close} setMode={setCurMode} />
        <ContentDisplay
          closePanelHandler={openHandler}
          mode={curMode}
          handleBookDelete={handleBookDelete}
        />
      </div>
    </>
  )
})

export default InfoPanel
