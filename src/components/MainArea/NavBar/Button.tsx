import { useState } from 'react'
import styles from './styles.module.css'

interface ButtonProps {
  url: string
  onClick: () => void
  isVariable?: boolean // в случае если иконка меняется при нажатии
  activeUrl?: string // активная иконка - та, на которую меняется обычная. Активная - темный фон, обычная - светлый
  isActiveFirst?: boolean // если активная иконка должна быть первой
  activeController?: boolean // в случае, если отображть активную иконку надо не просто по нажатию, а иным образом (например при входе в аккаунт)
}

const Button = ({
  url,
  onClick,
  isVariable,
  activeUrl,
  isActiveFirst,
  activeController
}: ButtonProps) => {
  const [isActive, setActive] = useState(!!isActiveFirst)

  const handleClick = () => {
    onClick()
    if (isVariable && activeUrl && activeController == undefined) {
      setActive((prev) => !prev)
    }
  }

  const activeStatus = activeController ? activeController : isActive
  return (
    <button
      className={`${styles.button} ${activeStatus ? styles.active : ''}`}
      onClick={handleClick}
      tabIndex={0}
    >
      <img src={activeStatus ? activeUrl : url} alt='' />
    </button>
  )
}
export default Button
