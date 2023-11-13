import { makeAutoObservable } from 'mobx'
import Cookies from 'js-cookie'
import { bookRefCookieKey, cfiCookieKey, themeCookieKey } from '@/constants'
import type { TBookData, TchapterInfo, Ttheme, Ttoc } from './constants'
import type { ClassRootStore } from '.'
import updateUserBook, { type TbookDataForUpdate } from '@/api/user/updateUserBook'

type TbookSize = {
  height: number
  width: number
}

export class ClassBookStore {
  rootStore: ClassRootStore
  bookRef: string | null = Cookies.get(bookRefCookieKey) || null
  bookName: string | null = null
  curCfi: string | null = Cookies.get(cfiCookieKey) || null
  lastCfi: string | null = null // на случай если пользователь перешел в аннотации и хочет вернуться на исходную страницу
  lastCfiDate: number = 0 // расчет задержки, при быстром листании не спамило на сервер
  bookSize: TbookSize = {
    height: 0,
    width: 0
  }
  bookId: number | null = null
  toc: Ttoc[] | null = null
  chapterInfo: TchapterInfo | null = null
  
  get isBookRefLoad() {
    return Boolean(this.bookRef)
  }

  get isPageJumped() {
    return Boolean(this.lastCfi)
  }

  constructor(rootStore: ClassRootStore) {
    makeAutoObservable(this)
    this.rootStore = rootStore
  }

  setBookRef = async (ref: string, bookSize?: TbookSize) => {
    this.bookRef = ref
    if (bookSize) this.bookSize = bookSize
  }

  setToc = (toc: Ttoc[]) => {
    this.toc = toc
  }

  // перелистывание страницы
  private isCfiCanUpdate: boolean = true
  private isCfiUpdateTimerActive: boolean = false
  private lastCfiForUpdate: string | null = null
  private cfiUpdateTimer = (cfi: string) => {
    this.lastCfiForUpdate = cfi
    if (this.isCfiUpdateTimerActive) return
    this.isCfiCanUpdate = false
    this.isCfiUpdateTimerActive = true
    setTimeout(() => {
      this.isCfiCanUpdate = true
      this.isCfiUpdateTimerActive = false
      if (this.bookId && this.curCfi && this.curCfi != cfi)
        this.handleServerCfi(this.curCfi, this.bookId)
    }, 1000)
  }
  private handleServerCfi = (cfi: string, bookId: number) => {
    if (this.isCfiCanUpdate) {
      const dataForUpdate: TbookDataForUpdate = {
        id: bookId,
        epubCfi: cfi,
        bookName: this.bookName
      }
      updateUserBook(dataForUpdate) // async
    }
    this.cfiUpdateTimer(cfi) // обновлять данные на сервере только раз в секунду
  }
  setCfi = (cfi: string) => {
    this.curCfi = cfi
    Cookies.set(cfiCookieKey, cfi)

    const newChapterName = this.toc?.find((title) => title.href == cfi)?.href

    if (this.bookId && this.rootStore.userStore.isLogin) this.handleServerCfi(cfi, this.bookId) // bookId есть только в том случае, если книга открыта у залогиненого пользователя
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

  setChapterInfo = (curPageStart: number, curPageEnd: number, totalPages: number) => {
    this.chapterInfo = {
      curPageStart,
      curPageEnd,
      totalPages
    }
  }

  setBookData = (book: TBookData) => {
    if (this.bookRef) this.dropCurBook()

    const { bookRef, bookName, epubCfi, id } = book
    this.bookRef = bookRef
    this.bookName = bookName
    this.bookId = id
    Cookies.set(bookRefCookieKey, bookRef)
    if (epubCfi) {
      Cookies.set(cfiCookieKey, epubCfi)
      this.setCfi(epubCfi)
    }
  }

  dropCurBook = () => {
    this.bookRef = null
    Cookies.remove(bookRefCookieKey)
    this.curCfi = null
    Cookies.remove(cfiCookieKey)
    this.bookName = null
    this.bookId = null
    this.toc = null
    this.lastCfi = null
    this.lastCfiForUpdate = null
  }
}
