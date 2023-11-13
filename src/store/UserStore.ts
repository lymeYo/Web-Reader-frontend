import { makeAutoObservable } from 'mobx'
import type { ClassRootStore } from '.'
import login from '@/api/user/login'
import { isUserResError, type TuserData } from '@/api/user/constants'
import { bookRefCookieKey, cfiCookieKey, tokenCookieKey } from '@/constants'
import Cookies from 'js-cookie'
import loginByToken from '@/api/user/loginByToken'
import registartion from '@/api/user/registration'
import type { TBookData } from './constants'
import getUserBooks from '@/api/user/getUserBooks'
import addUserBook from '@/api/user/addUserBook'
import getBookNameByRef from '@/api/book/getBookNameByRef'
import openUserBook from '@/api/user/openUserBook'
import dropUserBook from '@/api/user/dropUserBook'
import closeUserBook from '@/api/user/closeUserBook'
import type { TbookDataForUpdate } from '@/api/user/updateUserBook'
import updateUserBook from '@/api/user/updateUserBook'

export class ClassUserStore {
  rootStore: ClassRootStore
  isLogin: boolean = false
  username: string | null = null
  password: string | null = null
  userBooks: TBookData[] = []
  openedBookId: number | null = null

  constructor(rootStore: ClassRootStore) {
    makeAutoObservable(this)
    this.rootStore = rootStore
    this.initialLogin()
  }

  login = async (username: string, password: string) => {
    const userData = await login(username, password)
    if (!isUserResError(userData)) this.setUserData(userData)
    return userData
  }

  registration = async (username: string, password: string) => {
    const userData = await registartion(username, password)
    if (!isUserResError(userData)) this.setUserData(userData)
    return userData
  }

  logout = () => {
    this.isLogin = false
    this.username = null
    this.password = null
    this.userBooks = []
    Cookies.remove(tokenCookieKey)
  }

  addBook = async (bookRef: string) => {
    const bookName = await getBookNameByRef(bookRef)
    const book = await addUserBook(bookRef, bookName)
    if (!book) return

    this.userBooks.push(book)
    await this.openBook(book.id)
  }

  openBook = async (bookId: number) => {
    const openedBook = await openUserBook(bookId)
    if (!openedBook) return

    this.openedBookId = bookId
    this.rootStore.bookStore.setBookData(openedBook)
  }

  dropBook = async (bookId: number) => {
    await dropUserBook(bookId)
    this.userBooks = this.userBooks.filter((book) => book.id != bookId)

    if (this.openedBookId == bookId) {
      this.openedBookId = null
      this.rootStore.bookStore.dropCurBook()
    }
  }

  closeBook = async () => {
    this.openedBookId = null
    this.rootStore.bookStore.dropCurBook()
    await closeUserBook()
  }

  updateBookName = async (bookId: number, bookName: string) => {
    const book = this.userBooks.find((book) => book.id == bookId)
    if (!this.isLogin || !book) return
    const dataForUpdate: TbookDataForUpdate = {
      id: bookId,
      epubCfi: book.epubCfi,
      bookName: bookName
    }
    updateUserBook(dataForUpdate)
  }

  private initialLogin = async () => {
    const token = Cookies.get(tokenCookieKey)
    if (token) {
      const userData = await loginByToken(token)
      if (!isUserResError(userData)) this.setUserData(userData)
    }
  }

  private setUserData = async (userData: TuserData) => {
    this.isLogin = true
    this.username = userData.username
    this.password = userData.password
    this.userBooks = (await getUserBooks(this.username, this.password)) ?? []

    const openedBookId = userData.openedBookId
    this.openedBookId = openedBookId
    if (openedBookId) {
      const openedBook = this.userBooks.find((book) => book.id == openedBookId)
      if (openedBook) {
        this.rootStore.bookStore.setBookData(openedBook)
        Cookies.set(bookRefCookieKey, openedBook.bookRef)
        if (openedBook.epubCfi) Cookies.set(cfiCookieKey, openedBook.epubCfi)
      }
    }
  }
}
