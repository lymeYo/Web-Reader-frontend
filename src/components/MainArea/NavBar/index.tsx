import ArrowLeftImg from '@/assets/images/arrow-left.png'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import InfoPanel from './Info/InfoPanel'
import CopyAllowStatus from './CopyAllowStatus'
import ThemeToggle from './ThemeToggle'
import Account from './Account'
import { EpanelIds, navbarId } from './constants'
import DropBook from './DropBook'
import FullscreenMode from './FullscreenMode'
import ConfirmWindow from './ConfirmWindow'

import styles from './styles.module.css'
import { getUIStore } from '@/store'
import InfoButton from './Info/InfoButton'
import type { TshowConfirmPanel } from './Info/InfoPanel/constants'

interface NavBarProps {
  isOpen: boolean
  handleOpen: (isOpen?: boolean) => void
}

type TconfirmWindowData = {
  callback: () => void
  message: string
}

const NavBar = observer(({ isOpen, handleOpen }: NavBarProps) => {
  const { isAnyInputActive } = getUIStore()
  const [curOpenedPanel, setCurOpenedPanel] = useState<EpanelIds | null>(null)
  const [isTogglerVisible, setIsTogglerVisible] = useState<boolean>(true)
  const [confirmWindowData, setConfirmWindowData] = useState<TconfirmWindowData>()
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

  const showConfirmPanel: TshowConfirmPanel = (isPanelOpen, callback, message) => {
    if (callback && message)
      setConfirmWindowData({
        callback,
        message
      })
    handlePanel(EpanelIds.confirmWindow, isPanelOpen)
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
      const isNavBarClick = Boolean(
        event.target.closest('.' + styles.navbar) ||
          event.target.closest('.' + styles['info-panel'])
      )
      if (!isNavBarClick) handleOpen(false)
    }
    const keydownHandler = (event: KeyboardEvent) => {
      if ((event.code == 'ArrowLeft' || event.code == 'ArrowRight') && !isAnyInputActive())
        handleOpen(false)
    }

    document.addEventListener('click', clickHandler)
    document.addEventListener('keydown', keydownHandler)
    return () => {
      document.removeEventListener('click', clickHandler)
      document.removeEventListener('keydown', keydownHandler)
    }
  }, [])

  return (
    <>
      <div className={`${styles.navbar} ${isOpen ? '' : styles.close}`} id={navbarId}>
        <button
          className={`${styles.toggler} ${isOpen ? '' : styles.close} ${
            isTogglerVisible ? '' : styles.unvisible
          }`}
          onClick={handleTogglerClick}
          onMouseOver={handleIndicatorHover}
        >
          <img src={ArrowLeftImg.src} alt='' />
        </button>
        <div className={styles.buttons}>
          <DropBook
            isOpen={curOpenedPanel == EpanelIds.confirmWindow}
            openConfirmPanel={showConfirmPanel}
          />
          <InfoButton openHandler={showInfoPanel} />
          <CopyAllowStatus />
          <FullscreenMode />
          <ThemeToggle />
          <Account isOpen={curOpenedPanel == EpanelIds.account} openHandler={showAccountPanel} />
        </div>
        {/* hover-indicator скрывает кнопку открывания NavBar, если пользователь долго не наводил туда курсор */}
        <div onMouseOver={handleIndicatorHover} className={styles['hover-indicator']}></div>
      </div>
      <InfoPanel
        isOpen={curOpenedPanel == EpanelIds.infoPanel}
        openHandler={showInfoPanel}
        openConfirmPanel={showConfirmPanel}
      />
      {confirmWindowData ? (
        <ConfirmWindow
          isOpen={curOpenedPanel == EpanelIds.confirmWindow}
          openHandler={showConfirmPanel}
          {...confirmWindowData}
        />
      ) : (
        ''
      )}
    </>
  )
})

export default NavBar
