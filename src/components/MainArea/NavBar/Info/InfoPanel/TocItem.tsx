import { observer } from 'mobx-react-lite'
import { getBookStore } from '@/store'

import styles from './styles.module.css'

type TocItemProps = {
  title: string
  href: string
  onClick: () => void
}

const TocItem = observer(({ title, href, onClick }: TocItemProps) => {
  const { handleCfiJump } = getBookStore()

  const clickHandler = () => {
    handleCfiJump(href)
    onClick()
  }

  return (
    <li>
      <button className={styles['toc-item']} onClick={clickHandler}>
        {title}
      </button>
    </li>
  )
})
export default TocItem
