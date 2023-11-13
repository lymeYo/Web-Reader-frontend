import BackIcon from '@/assets/images/arrow-left2-dark.png'
import Button from '../Button'
import { observer } from 'mobx-react-lite'
import type { TshowConfirmPanel } from '../InfoPanel/constants'
import { getBookStore, getUserStore } from '@/store'

type DropBookProps = {
  isOpen: boolean
  openConfirmPanel: TshowConfirmPanel
}

const DropBook = observer(({ isOpen, openConfirmPanel }: DropBookProps) => {
  const { bookId, dropCurBook } = getBookStore() //TODO
  const { isLogin, closeBook } = getUserStore()

  const handleClick = () => {
    const handleDropBook = () => {
      if (isLogin && bookId) closeBook()
      else dropCurBook()
    }
    openConfirmPanel(true, handleDropBook, 'Вы хотите закрыть книгу?')
  }
  return <Button url={BackIcon.src} onClick={handleClick} />
})
export default DropBook
