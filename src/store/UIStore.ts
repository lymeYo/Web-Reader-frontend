import { makeAutoObservable } from 'mobx'
import Cookies from 'js-cookie'
import type { ClassRootStore } from '.'
import type { Ttheme } from './constants'
import { themeCookieKey } from '@/constants'

export class ClassUIStore {
  rootStore: ClassRootStore
  isCopyAllow: boolean = false
  theme: Ttheme = 'dark'

  constructor(rootStore: ClassRootStore) {
    makeAutoObservable(this)
    this.rootStore = rootStore
    this.renderTheme()
  }

  isAnyInputActive = () => {
    return document.activeElement?.tagName === 'INPUT'
  }

  changeCopyAllow = (isAllow: boolean) => {
    this.isCopyAllow = isAllow
  }

  setTheme = (curTheme?: Ttheme) => {
    const theme = curTheme ? curTheme : this.theme == 'light' ? 'dark' : 'light'
    this.theme = theme
    document.body.setAttribute('data-theme', theme)
  }

  private renderTheme = () => {
    const cookiesTheme = Cookies.get(themeCookieKey)
    const isCookiesThemeValid = (cookiesTheme: any): cookiesTheme is Ttheme =>
      cookiesTheme == 'light' || cookiesTheme == 'dark'

    if (isCookiesThemeValid(cookiesTheme)) {
      this.setTheme(cookiesTheme)
      return
    }

    const theme =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    this.setTheme(theme)
  }
}
