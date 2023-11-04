import { action, computed, makeAutoObservable, makeObservable, observable, runInAction } from 'mobx'
import { ClassBookStore } from './BookStore'
import { ClassUserStore } from './UserStore'
import { ClassUIStore } from './UIStore'

export class ClassRootStore {
  userStore: ClassUserStore
  bookStore: ClassBookStore
  uiStore: ClassUIStore

  constructor() {
    makeAutoObservable(this)
    this.bookStore = new ClassBookStore(this)
    this.userStore = new ClassUserStore(this)
    this.uiStore = new ClassUIStore(this)
  }
}

const RootStore = new ClassRootStore()

export const getBookStore = () => RootStore.bookStore
export const getUserStore = () => RootStore.userStore
export const getUIStore = () => RootStore.uiStore

export default RootStore
