import { action, observable } from 'mobx'
import { useStaticRendering } from 'mobx-react'

const isServer = !process.browser
useStaticRendering(isServer)

export class Store {
  @observable lastUpdate: number = 0
  @observable light: boolean = false

  private timer: any

  constructor(isServer: boolean, initialData: any = {}) {
    this.lastUpdate =
      initialData.lastUpdate != null ? initialData.lastUpdate : Date.now()
    this.light = !!initialData.light
  }

  @action
  start = () => {
    this.timer = setInterval(() => {
      this.lastUpdate = Date.now()
      this.light = true
    }, 1000)
  }

  stop = () => clearInterval(this.timer)
}

let store: Store | null = null

export function initializeStore(initialData: any = {}) {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return new Store(isServer, initialData)
  }
  if (store === null) {
    store = new Store(isServer, initialData)
  }
  return store
}