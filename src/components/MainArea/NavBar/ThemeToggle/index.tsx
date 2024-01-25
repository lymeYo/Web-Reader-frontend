import SunIcon from '@/assets/images/theme/sun.png'
import MoonIcon from '@/assets/images/theme/moon.png'
import { getBookStore, getUIStore } from '@/store'
import type { Ttheme } from '@/store/constants'
import { observer } from 'mobx-react-lite'
import Button from '../Button'
import Cookies from 'js-cookie'
import { themeCookieKey } from '@/constants'
import { useCallback } from 'react'

const ThemeToggle = observer(() => {
  const { theme, setTheme } = getUIStore()

  const handleClick = () => {
    
    const newTheme: Ttheme = theme == 'light' ? 'dark' : 'light'
    
    Cookies.set(themeCookieKey, newTheme)
    
    setTheme(newTheme)
  }

  return (
    <Button
      url={SunIcon.src}
      isVariable
      activeUrl={MoonIcon.src}
      onClick={handleClick}
      isActiveFirst={theme == 'dark'}
    />
  )
})
export default ThemeToggle
