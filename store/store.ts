import { action, observable } from 'mobx'
import { useStaticRendering } from 'mobx-react'
import { CurrentUser } from './types';

const isServer = !process.browser
useStaticRendering(isServer)

export class Store {
    @observable currentUser?: CurrentUser

    @action
    setCurrentUser = (userName: string, userId: string) => {
        this.currentUser = {userName, userId}
    }
}

let store: Store | null = null

export function initializeStore() {
    return new Store()
}