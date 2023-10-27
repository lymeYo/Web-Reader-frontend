import { observer } from 'mobx-react-lite'
import styles from './styles.module.css'
import { getAuthStore } from '@/store'

type ShowLogoutProps = {
  isOpen: boolean
}
const ShowLogout = observer(({ isOpen }: ShowLogoutProps) => {
  const { logout } = getAuthStore()
  const handleExit = () => logout()

  return (
    <button onClick={handleExit} className={`${styles['exit-btn']} ${isOpen ? '' : styles.close}`}>
      Выйти
    </button>
  )
})
export default ShowLogout
