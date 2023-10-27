import { observer } from 'mobx-react-lite'
import CloseImg from '@/assets/images/close.png'

import styles from './styles.module.css'
import type { TdisplayMode } from './constants'

type HeadersProps = {
  mode: TdisplayMode
  setMode: (mode: TdisplayMode) => void
}
const Headers = observer(({ mode, setMode }: HeadersProps) => {
  const handleTocClick = () => setMode('toc')
  const handleBooksClick = () => setMode('books')

  return (
    <div className={styles.header}>
      <div className={styles['header-row']}>
        <h3 onClick={handleTocClick} className={mode == 'toc' ? styles.active : ''}>
          оглавление
        </h3>
        <h3 onClick={handleBooksClick} className={mode == 'books' ? styles.active : ''}>
          мои книги
        </h3>
      </div>
      <button onClick={close}>
        <img src={CloseImg.src} alt='close' />
      </button>
    </div>
  )
})

export default Headers
