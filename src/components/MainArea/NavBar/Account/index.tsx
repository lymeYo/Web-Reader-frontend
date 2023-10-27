import ExitImg from '@/assets/images/account/exit.png'
import ProfileImg from '@/assets/images/account/profile.png'
import { observer } from 'mobx-react-lite'
import { getAuthStore, getBookStore } from '@/store'
import Button from '../Button'
import ShowLogin from './ShowLogin'
import ShowLogout from './ShowLogout'

import styles from './styles.module.css'

interface AccountProps {
  isOpen: boolean
  openHandler: (isOpen?: boolean) => void
}

const Account = observer(({ isOpen, openHandler }: AccountProps) => {
  const { isLogin } = getAuthStore()
  const closePanel = () => openHandler(false)

  return (
    //оля
    <>
      <Button
        url={ProfileImg.src}
        isVariable
        activeUrl={ExitImg.src}
        onClick={openHandler}
        isActiveFirst={isLogin}
        activeController={isLogin}
      />
      <div
        className={`${styles.wrapper} ${
          isLogin ? styles['logout-wrapper'] : styles['login-wrapper']
        } ${isOpen ? '' : styles.close}`}
      >
        <ShowLogout isOpen={isLogin} />
        <ShowLogin isOpen={!isLogin} closePanel={closePanel} />
      </div>
    </>
  )
})
export default Account
