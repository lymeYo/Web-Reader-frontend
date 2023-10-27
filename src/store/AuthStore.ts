import { action, computed, makeAutoObservable, makeObservable, observable, runInAction } from 'mobx'
import type { ClassRootStore } from '.'
import login from '@/api/user/login'
import { isUserResError, type TuserData } from '@/api/user/constants'
import updateBookData from '@/api/book/updateBookData'
import { bookRefCookieKey, cfiCookieKey, tokenCookieKey } from '@/constants'
import Cookies from 'js-cookie'
import loginByToken from '@/api/user/loginByToken'
import registartion from '@/api/user/registration'

export class ClassAuthStore {
  rootStore: ClassRootStore
  isLogin: boolean = false
  username: string | null = null
  password: string | null = null
  curCfi: string | null = null
  bookRef: string | null = null

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

  // TODO
  logout = () => {
    this.isLogin = false
    this.username = null
    this.password = null
    Cookies.remove(tokenCookieKey)
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

    const storeBookRef = this.rootStore.bookStore.bookRef
    const storeCfi = this.rootStore.bookStore.curCfi
    // книга на сервере заменяется той, которую пользователь выбрал до входа
    if (storeBookRef) await updateBookData(storeBookRef, storeCfi)
    else {
      if (userData.bookRef) Cookies.set(bookRefCookieKey, userData.bookRef)
      if (userData.epubCfi) Cookies.set(cfiCookieKey, userData.epubCfi)
      this.rootStore.bookStore.setBookInfo(userData.bookRef, userData.epubCfi)
    }
  }
}
