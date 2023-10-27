import { action, computed, makeAutoObservable, makeObservable, observable, runInAction } from 'mobx'
import { ClassBookStore } from './BookStore'
import { ClassAuthStore } from './AuthStore'

export class ClassRootStore {
  authStore: ClassAuthStore
  bookStore: ClassBookStore

  constructor() {
    makeAutoObservable(this)
    this.bookStore = new ClassBookStore(this)
    this.authStore = new ClassAuthStore(this)
  }
}

const RootStore = new ClassRootStore()

export const getBookStore = () => RootStore.bookStore
export const getAuthStore = () => RootStore.authStore

export default RootStore
