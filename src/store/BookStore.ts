import { action, computed, makeAutoObservable, makeObservable, observable, runInAction } from 'mobx'
import Cookies from 'js-cookie'
import { bookRefCookieKey, cfiCookieKey, themeCookieKey, tokenCookieKey } from '@/constants'
import { isUserResError, type TuserData } from '@/api/user/constants'
import updateBookData from '@/api/book/updateBookData'
import loginByToken from '@/api/user/loginByToken'
import type { Ttheme, Ttoc } from './constants'
import type { ClassRootStore } from '.'
import dropBookData from '@/api/book/dropBookData'

type TbookSize = {
  height: number
  width: number
}

export class ClassBookStore {
  rootStore: ClassRootStore
  bookRef: string | null = Cookies.get(bookRefCookieKey) || null
  curCfi: string | null = Cookies.get(cfiCookieKey) || null
  lastCfi: string | null = null // на случай если пользователь перешел в аннотации и хочет вернуться на исходную страницу
  lastCfiDate: number = 0 // расчет задержки, при быстром листании не спамило на сервер
  bookSize: TbookSize = {
    height: 0,
    width: 0
  }
  toc: Ttoc[] | null = null
  isCopyAllow: boolean = false
  bookName: string | null = null
  theme: Ttheme = 'dark'

  get isBookRefLoad() {
    return Boolean(this.bookRef)
  }

  get isPageJumped() {
    return Boolean(this.lastCfi)
  }

  constructor(rootStore: ClassRootStore) {
    makeAutoObservable(this)
    this.rootStore = rootStore
    this.renderTheme()
  }

  setBookRef = async (ref: string, bookSize?: TbookSize) => {
    this.bookRef = ref
    if (bookSize) this.bookSize = bookSize

    await updateBookData(ref, null)
  }

  setToc = (toc: Ttoc[]) => {
    this.toc = toc
  }

  // перелистывание страницы
  setCfi = (cfi: string) => {
    const date = new Date().getTime()
    // обновлять данные на сервере только раз в секунду
    this.curCfi = cfi
    Cookies.set(cfiCookieKey, cfi)
    if (date - this.lastCfiDate > 1000) if (this.bookRef) updateBookData(this.bookRef, cfi) // async
    this.lastCfiDate = date
  }

  setLastCfi = (cfi: string) => {
    this.lastCfi = cfi
  }

  handleCfiJump = (cfi: string) => {
    this.lastCfi = this.curCfi
    this.setCfi(cfi)
  }

  handleCfiGoBack = () => {
    if (this.lastCfi) this.setCfi(this.lastCfi)
    this.lastCfi = null
  }

  setBookName = (name: string) => {
    this.bookName = name
  }

  changeCopyAllow = (isAllow: boolean) => {
    this.isCopyAllow = isAllow
  }

  setTheme = (curTheme?: Ttheme) => {
    const theme = curTheme ? curTheme : this.theme == 'light' ? 'dark' : 'light'
    this.theme = theme
    document.body.setAttribute('data-theme', theme)
  }

  setBookInfo = (bookRef: string | null, curCfi: string | null) => {
    this.bookRef = bookRef
    if (curCfi) this.setCfi(curCfi)
  }

  dropBook = async () => {
    this.bookRef = null
    Cookies.remove(bookRefCookieKey)
    this.curCfi = null
    Cookies.remove(cfiCookieKey)

    const username = this.rootStore.authStore.username
    const password = this.rootStore.authStore.password
    if (this.rootStore.authStore.isLogin && username && password) await dropBookData() // удалются данные с сервера
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
