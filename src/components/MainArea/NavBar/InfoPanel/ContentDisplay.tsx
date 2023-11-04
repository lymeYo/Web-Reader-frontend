import { getBookStore, getUserStore } from '@/store'
import type { TdisplayMode } from './constants'
import { observer } from 'mobx-react-lite'
import BooksItem from './BooksItem'
import TocItem from './TocItem'

import styles from './styles.module.css'

type ContentDisplayProps = {
  mode: TdisplayMode
  closePanelHandler: () => void
  handleBookDelete: (bookId: number, bookName: string) => void
}
const ContentDisplay = observer(
  ({ mode, closePanelHandler, handleBookDelete }: ContentDisplayProps) => {
    if (mode == 'toc') return <TocContent clickHandler={closePanelHandler} />
    if (mode == 'books')
      return <BooksContent closeHandler={closePanelHandler} handleBookDelete={handleBookDelete} />
  }
)

type TocContentProps = {
  clickHandler: () => void
}

const TocContent = observer(({ clickHandler }: TocContentProps) => {
  const { toc } = getBookStore()

  return (
    <ul className={styles.list}>
      {toc?.map((item) => (
        <TocItem key={item.href} href={item.href} title={item.title} onClick={clickHandler} />
      ))}
    </ul>
  )
})

type BooksContentProps = {
  closeHandler: () => void
  handleBookDelete: (bookId: number, bookName: string) => void
}

const BooksContent = observer(({ closeHandler, handleBookDelete }: BooksContentProps) => {
  const { userBooks } = getUserStore()
  return (
    <ul className={`${styles.list} ${styles['books-list']}`}>
      {userBooks.map((item, ind) => (
        <BooksItem
          key={ind}
          title={item.bookName ?? '<Без названия>'}
          bookId={item.id}
          ind={ind}
          handleDelete={handleBookDelete}
          closeHandler={closeHandler}
        />
      ))}
    </ul>
  )
})

export default ContentDisplay
