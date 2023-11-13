import { observer } from 'mobx-react-lite'
import MenuImg from '@/assets/images/menu.png'
import Button from '../../Button'

import styles from './styles.module.css'

interface InfoButtonProps {
  openHandler: (isOpen?: boolean) => void
}

const InfoButton = observer(({ openHandler }: InfoButtonProps) => {
  return <Button url={MenuImg.src} onClick={openHandler} />
})

export default InfoButton
