import CopyImg from '@/assets/images/copy.png'
import CopyActiveImg from '@/assets/images/copy-active.png'
import { getBookStore } from '@/store'
import { observer } from 'mobx-react-lite'
import Button from '../Button'

const CopyAllowStatus = observer(() => {
  const { isCopyAllow, changeCopyAllow } = getBookStore()

  const handleClick = () => {
    changeCopyAllow(!isCopyAllow)
  }

  // return <div onClick={handleClick}>{isCopyAllow ? 'c' : 'n'}</div>
  return <Button url={CopyImg.src} isVariable activeUrl={CopyActiveImg.src} onClick={handleClick} />
})
export default CopyAllowStatus
