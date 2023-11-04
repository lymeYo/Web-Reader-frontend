import { makeAutoObservable } from 'mobx'
import type { ClassRootStore } from '.'
import login from '@/api/user/login'
import { isUserResError, type TuserData } from '@/api/user/constants'
import updateBookData from '@/api/book/updateBookData'
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
    if (openedBookId) {
      const openedBook = this.userBooks.find((book) => book.id == openedBookId)
      if (openedBook) {
        this.rootStore.bookStore.setBookData(openedBook)
        Cookies.set(bookRefCookieKey, openedBook.bookRef)
        if (openedBook.epubCfi) Cookies.set(cfiCookieKey, openedBook.epubCfi)
      }
    }

    // else {
    // const storeBookRef = this.rootStore.bookStore.bookRef
    // const storeBookName = this.rootStore.bookStore.bookName
    // const storeCfi = this.rootStore.bookStore.curCfi
    // книга на сервере заменяется той, которую пользователь выбрал до входа
    // if (storeBookRef) await updateBookData(storeBookRef, storeBookName, storeCfi) //TODO добавлять существующую
    // }
  }
}
