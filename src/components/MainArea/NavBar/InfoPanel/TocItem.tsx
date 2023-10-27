import { observer } from 'mobx-react-lite'
import { getBookStore } from '@/store'

import styles from './styles.module.css'

type TocItemProps = {
  title: string
  href: string
  closeNavBar: () => void
}

const TocItem = observer(({ title, href, closeNavBar }: TocItemProps) => {
  const { handleCfiJump } = getBookStore()

  const clickHandler = () => {
    handleCfiJump(href)
    closeNavBar()
  }

  return (
    <li key={href} className={styles['toc-itemw']} onClick={clickHandler}>
      {title}
    </li>
  )
})
export default TocItem
