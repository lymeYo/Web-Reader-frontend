import ArrowLeftImg from '@/assets/images/arrow-left.png'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import InfoPanel from './InfoPanel'
import CopyAllowStatus from './CopyAllowStatus'
import ThemeToggle from './ThemeToggle'
import Account from './Account'
import { EpanelIds } from './constants'
import DropBook from './DropBook'

import styles from './styles.module.css'

interface NavBarProps {
  isOpen: boolean
  handleOpen: (isOpen?: boolean) => void
}

const NavBar = observer(({ isOpen, handleOpen }: NavBarProps) => {
  const [curOpenedPanel, setCurOpenedPanel] = useState<EpanelIds | null>(EpanelIds.infoPanel)
  const [isTogglerVisible, setIsTogglerVisible] = useState<boolean>(true)
  const lastIndicatorActiveRef = useRef<number>(0)
  const isNavBarOpenRef = useRef<boolean>(isOpen)
  useMemo(() => (isNavBarOpenRef.current = isOpen), [isOpen])

  const handleTogglerClick = () => {
    handleOpen()
  }

  useMemo(() => {
    if (!isOpen) setCurOpenedPanel(null)
  }, [isOpen])

  const showInfoPanel = (isPanelOpen?: boolean) => {
    handlePanel(EpanelIds.infoPanel, isPanelOpen)
  }

  const showAccountPanel = (isPanelOpen?: boolean) => {
    handlePanel(EpanelIds.account, isPanelOpen)
  }

  const showDropPanel = (isPanelOpen?: boolean) => {
    handlePanel(EpanelIds.dropBook, isPanelOpen)
  }

  const handlePanel = useCallback(
    (panel: EpanelIds | null, isPanelOpen?: boolean) => {
      if (isPanelOpen) setCurOpenedPanel(panel)
      else if (isPanelOpen == false) setCurOpenedPanel(null)
      else setCurOpenedPanel(curOpenedPanel == panel ? null : panel)
    },
    [curOpenedPanel]
  )

  const handleIndicatorHover = () => {
    const curTime = new Date().getTime()
    lastIndicatorActiveRef.current = curTime
    setIsTogglerVisible(true)
    const delay = 10000 // через сколько мс будет скрываться кнопка

    setTimeout(() => {
      if (lastIndicatorActiveRef.current == curTime && !isNavBarOpenRef.current)
        setIsTogglerVisible(false)
    }, delay)
  }

  useEffect(() => {
    handleIndicatorHover()

    const clickHandler = (event: any) => {
      const isNavBarClick = Boolean(event.target.closest('.' + styles.navbar))

      if (!isNavBarClick) handleOpen(false)
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  }, [])

  return (
    <div className={`${styles.navbar} ${isOpen ? '' : styles.close}`}>
      <div
        className={`${styles.toggler} ${isOpen ? '' : styles.close} ${
          isTogglerVisible ? '' : styles.unvisible
        }`}
        onClick={handleTogglerClick}
        onMouseOver={handleIndicatorHover}
      >
        <img src={ArrowLeftImg.src} alt='' />
      </div>
      <div className={styles.buttons}>
        <DropBook isOpen={curOpenedPanel == EpanelIds.dropBook} openHandler={showDropPanel} />
        <InfoPanel isOpen={curOpenedPanel == EpanelIds.infoPanel} openHandler={showInfoPanel} />
        <CopyAllowStatus />
        <ThemeToggle />
        <Account isOpen={curOpenedPanel == EpanelIds.account} openHandler={showAccountPanel} />
      </div>
      {/* hover-indicator скрывает кнопку открывания NavBar, если пользователь долго не наводил туда курсор */}
      <div onMouseOver={handleIndicatorHover} className={styles['hover-indicator']}></div>
    </div>
  )
})

export default NavBar
