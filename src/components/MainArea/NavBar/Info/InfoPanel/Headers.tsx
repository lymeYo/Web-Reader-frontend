import { observer } from 'mobx-react-lite'
import CloseImg from '@/assets/images/close.png'

import styles from './styles.module.css'
import type { TdisplayMode } from './constants'

type HeadersProps = {
  mode: TdisplayMode
  setMode: (mode: TdisplayMode) => void
  close: () => void
}
const Headers = observer(({ mode, setMode, close }: HeadersProps) => {
  const handleTocClick = () => setMode('toc')
  const handleBooksClick = () => setMode('books')

  return (
    <div className={styles.header}>
      <div className={styles['header-row']}>
        <button
          onClick={handleTocClick}
          className={mode == 'toc' ? styles.active : ''}
          tabIndex={0}
        >
          <h3>оглавление</h3>
        </button>
        <button
          className={mode == 'books' ? styles.active : ''}
          onClick={handleBooksClick}
          tabIndex={0}
        >
          <h3>мои книги</h3>
        </button>
      </div>
      <button tabIndex={0} onClick={close}>
        <img src={CloseImg.src} alt='close' />
      </button>
    </div>
  )
})

export default Headers
