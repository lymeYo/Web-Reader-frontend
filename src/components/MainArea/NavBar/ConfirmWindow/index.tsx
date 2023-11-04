import { observer } from 'mobx-react-lite'
import styles from './styles.module.css'
import parentStyles from '../styles.module.css'

type ConfirmWindowProps = {
  message: string
  isOpen: boolean
  openHandler: () => void
  callback: () => void
}

const ConfirmWindow = observer(({ message, isOpen, openHandler, callback }: ConfirmWindowProps) => {
  const handleReject = () => {
    openHandler()
  }
  const handleResolve = () => {
    callback()
    openHandler()
  }

  return (
    <div
      className={`${styles['info-mess']} ${parentStyles['info-panel']} ${
        isOpen ? '' : styles.hide
      }`}
    >
      <p className={styles.message}>{message}</p>
      <div className={styles.buttons}>
        <button onClick={handleReject}>Нет</button>
        <button onClick={handleResolve}>Да</button>
      </div>
    </div>
  )
})
export default ConfirmWindow
