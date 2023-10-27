import { getBookStore } from '@/store'
import { observer } from 'mobx-react-lite'
import BooksItem from './BooksItem'
import TocItem from './TocItem'

import styles from './styles.module.css'
import type { TdisplayMode } from './constants'

type ContentDisplayProps = {
  mode: TdisplayMode
}
const ContentDisplay = observer(({ mode }: ContentDisplayProps) => {
  if (mode == 'toc') return <TocContent />
  if (mode == 'books') return <BooksContent />
})

const TocContent = observer(() => {
  const { toc } = getBookStore()

  return (
    <ul className={styles.list}>
      {toc?.map((item) => (
        <TocItem href={item.href} title={item.title} key={item.href} closeNavBar={close} />
      ))}
    </ul>
  )
})

const BooksContent = observer(() => {
  const testList = [
    'Начало Бесконечности. Дэвид Дойч',
    'Зачем мы спим? Мэтью Уолкер',
    'Мастер и Маргарита. Михаил Булгаков',
    'Каспар, Мельхиор и Бальтазар. Мишель Турнье',
    'Отверженные. Виктор Гюго Очень длинное название',
    'Отверженные. Виктор Гюго'
  ]
  return (
    <ul className={`${styles.list} ${styles['books-list']}`}>
      {testList.map((item, ind) => (
        <BooksItem key={ind} item={item} ind={ind} />
      ))}
    </ul>
  )
})

export default ContentDisplay
