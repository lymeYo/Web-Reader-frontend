import type { TuserData, TuserErrorData } from '@/api/user/constants'
import SendImg from '@/assets/images/send-2.png'
import { getUserStore, getBookStore } from '@/store'
import { observer } from 'mobx-react-lite'
import { useCallback, useRef, useState } from 'react'

import styles from './styles.module.css'

type TauthType = 'login' | 'register'
const isDataError = (data: any): data is TuserErrorData => data.errMessage

type ShowLoginProps = {
  closePanel: () => void
  isOpen: boolean
}

const ShowLogin = observer(({ closePanel, isOpen }: ShowLoginProps) => {
  const nameInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const [authType, setAuthType] = useState<TauthType>('login')
  const [errMessage, setErrMessage] = useState<string>('')
  const { login, registration } = getUserStore()

  const setLoginType = () => {
    setAuthType('login')
  }

  const setRegisterType = () => {
    setAuthType('register')
  }

  const handleAuth = useCallback(async () => {
    const name = nameInputRef.current?.value
    const password = passwordInputRef.current?.value
    if (!name || !password) return
    let userData: TuserData | TuserErrorData

    if (authType == 'login') userData = await login(name, password)
    else userData = await registration(name, password)

    if (nameInputRef.current) nameInputRef.current.value = ''
    if (passwordInputRef.current) passwordInputRef.current.value = ''

    if (isDataError(userData)) {
      setErrMessage(userData.errMessage)
    } else {
      setErrMessage('')
      closePanel()
    }
  }, [authType])

  return (
    <form action='' className={`${styles.form} ${isOpen ? '' : styles.close}`}>
      <input type='text' placeholder='Имя' ref={nameInputRef} />
      <input type='text' placeholder='Пароль' ref={passwordInputRef} />
      <div className={styles.options}>
        <div className={styles.toggler}>
          <button
            onClick={setLoginType}
            className={authType == 'login' ? styles.active : ''}
            type='button'
          >
            Вход
          </button>
          <button
            onClick={setRegisterType}
            className={authType == 'register' ? styles.active : ''}
            type='button'
          >
            Регистрация
          </button>
        </div>
        <button onClick={handleAuth} type='button' className={styles['send-btn']}>
          <img src={SendImg.src} alt='' />
        </button>
      </div>
      <span className={styles['error-mess']}>{errMessage}</span>
    </form>
  )
})
export default ShowLogin
