import { observer } from 'mobx-react-lite'

import styles from './styles.module.css'

type BooksItemProps = {
  item: string
  ind: number
}

const BooksItem = observer(({ item, ind }: BooksItemProps) => {
  return <li className={`${styles['books-item']} ${ind == 0 ? styles.active : ''}`}>{item}</li>
})
export default BooksItem
