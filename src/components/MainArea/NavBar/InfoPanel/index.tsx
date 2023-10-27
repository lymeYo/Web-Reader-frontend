import { observer } from 'mobx-react-lite'
import MenuImg from '@/assets/images/menu.png'
import Button from '../Button'
import parentStyles from '../styles.module.css'
import { useState } from 'react'
import type { TdisplayMode } from './constants'
import ContentDisplay from './ContentDisplay'
import Headers from './Headers'

import styles from './styles.module.css'

interface AccountProps {
  isOpen: boolean
  openHandler: (isOpen?: boolean) => void
}

const InfoPanel = observer(({ isOpen, openHandler }: AccountProps) => {
  const [curMode, setCurMode] = useState<TdisplayMode>('books')
  const close = () => openHandler(false)
  const open = () => openHandler(true)
  const toggle = () => openHandler()

  return (
    <>
      <Button url={MenuImg.src} onClick={toggle} /> {/* меню */}
      <div className={`${parentStyles['info-panel']} ${isOpen ? '' : parentStyles.close}`}>
        <Headers mode={curMode} setMode={setCurMode} />
        <ContentDisplay mode={curMode} />
      </div>
    </>
  )
})

export default InfoPanel
