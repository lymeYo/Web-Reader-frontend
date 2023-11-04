import FullscreenImg from '@/assets/images/fullscreen.png'
import FullscreenActiveImg from '@/assets/images/fullscreen-active.png'
import { observer } from 'mobx-react-lite'
import Button from '../Button'

const FullscreenMode = observer(() => {
  const handleClick = () => {
    if (!document.fullscreenElement) { //toggle fullscreen
      document.documentElement.requestFullscreen()
    } else if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }

  // return <div onClick={handleClick}>{isCopyAllow ? 'c' : 'n'}</div>
  return (
    <Button
      url={FullscreenImg.src}
      isVariable
      activeUrl={FullscreenActiveImg.src}
      onClick={handleClick}
    />
  )
})
export default FullscreenMode
