import { observer } from 'mobx-react-lite'
import styles from './styles.module.css'
import parentStyles from '../styles.module.css'
import { useEffect, useRef } from 'react'
import setPositionOnNavBar from '../utils/SetPositionOnNavBar'

type ConfirmWindowProps = {
  message: string
  isOpen: boolean
  openHandler: () => void
  callback: () => void
}

const ConfirmWindow = observer(({ message, isOpen, openHandler, callback }: ConfirmWindowProps) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const handleReject = () => {
    openHandler()
  }
  const handleResolve = () => {
    callback()
    openHandler()
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
    <div className={styles.wrapper} ref={elementRef}>
      <div className={`${styles['info-mess']} ${isOpen ? '' : styles.hide}`}>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttons}>
          <button onClick={handleReject}>Нет</button>
          <button onClick={handleResolve}>Да</button>
        </div>
      </div>
    </div>
  )
})
export default ConfirmWindow
