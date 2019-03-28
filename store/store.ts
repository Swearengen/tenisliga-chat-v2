import { action, observable, computed } from 'mobx'
import { useStaticRendering } from 'mobx-react'
const Chatkit = require('@pusher/chatkit-client'); // todo: why import is not working
import * as _ from 'lodash'

import { UserJoinedRoom, SubscribedRoom, Message, RoomUser, MessagesCollection } from './types';

const isServer = !process.browser
useStaticRendering(isServer)

const API_URL = process.env.API_URL
const CHATKIT_INSTANCE_LOCATOR = process.env.CHATKIT_INSTANCE_LOCATOR

export class Store {
    @observable errorMessage?: string
    @observable loading: boolean = true;
    @observable chatkitUser: any = {}
    @observable usersWhoAreTyping: string[] = []
    @observable subscribedRooms?: SubscribedRoom[]
    @observable messagesCollection: MessagesCollection = {}
    @observable currentRoomId?: string

    private userJoinedRooms?: UserJoinedRoom[]

    @action
    setUserJoinedRoom = (rooms: UserJoinedRoom[]) => {
        this.userJoinedRooms = rooms
        this.userJoinedRooms.forEach(room => {
            if (room.name === 'General') {
                this.currentRoomId = room.id
            }
        })
    }

    @action
    changeCurrentRoomId = (id: string) => {
        this.currentRoomId = id
    }

    @action
    public connectUserRequest = (userId: string) => {
        this.loading = true

        let url = process.env.NODE_ENV === 'production' ? '/api/authenticate' : `${API_URL}/api/authenticate`

        const chatManager = new Chatkit.ChatManager({
            instanceLocator: CHATKIT_INSTANCE_LOCATOR,
            userId,
            tokenProvider: new Chatkit.TokenProvider({url})
        })


        chatManager
        .connect()
        .then((currentUser: any) => {
            this.chatkitUser = currentUser

            this.userJoinedRooms!.forEach(room => {
                this.chatkitUser.subscribeToRoom({
                    roomId: room.id,
                    messageLimit: 20,
                    hooks: {
                        onMessage: (message: Message) => {
                            const roomMessages = this.messagesCollection[message.roomId]
                            this.messagesCollection[message.roomId] = roomMessages ? [...roomMessages, message] : [message]
                        },
                        onUserStartedTyping: (user: RoomUser) => {
                            this.usersWhoAreTyping = [...this.usersWhoAreTyping, user.name]
                        },
                        onUserStoppedTyping: (user: RoomUser) => {
                            this.usersWhoAreTyping = this.usersWhoAreTyping.filter(
                                username => username !== user.name
                            )
                        }
                    }
                })
                .then((currentRoom: SubscribedRoom) => {
                    this.loading = false
                    this.subscribedRooms = this.subscribedRooms ? [...this.subscribedRooms, currentRoom] : [currentRoom]
                })
                .catch((err: any) => {
                    console.log(err);
                    this.loading = false
                    this.errorMessage = err.info ? err.info.error_description : 'Server error'
                })
            });
        })
        .catch((error: any) => {
            console.error(error)
            this.loading = false
            this.errorMessage = error.info ? error.info.error_description : 'Server error'
        })
    }

    public sendUserTypingEvent = () => {
        this.chatkitUser.isTypingIn({roomId: this.currentRoomId})
            .catch((error: any) => {
                console.log(error)
            })
    }

    public sendMessage = (text: string) => {
        this.chatkitUser.sendSimpleMessage({
            text,
            roomId: this.currentRoomId
        })
        .catch((error: any) => {
            console.log(error)
        })
    }

    public connectUser = _.once(this.connectUserRequest)

    @computed
    get messages() {
        return this.messagesCollection[this.currentRoomId!]
    }

    @computed
    get currentRoom() {
        return _.find(this.subscribedRooms, ['id', this.currentRoomId])
    }

    @computed
    get getLastMessageId() {
        const lastMessage = _.last(this.messages)
        if (lastMessage) {
            return String(lastMessage.id)
        }
        return undefined
    }

    @computed
    get privateRooms() {
        return _.filter(this.subscribedRooms, 'isPrivate')
    }

    @computed
    get publicRooms() {
        return _.filter(this.subscribedRooms, ['isPrivate', false])
    }
}

export function initializeStore() {
    return new Store()
}