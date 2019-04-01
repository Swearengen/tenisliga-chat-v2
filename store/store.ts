import { action, observable, computed, runInAction } from 'mobx'
import { useStaticRendering } from 'mobx-react'
const Chatkit = require('@pusher/chatkit-client'); // todo: why import is not working
import * as _ from 'lodash'

import { UserJoinedRoom, SubscribedRoom, Message, RoomUser, RoomDataCollection, Cursor, CursorHook } from './types';

const isServer = !process.browser
useStaticRendering(isServer)

const API_URL = process.env.API_URL
const CHATKIT_INSTANCE_LOCATOR = process.env.CHATKIT_INSTANCE_LOCATOR

// 1. izlistat recimo 5 usera selectanog channela
//  klikom na usera treba provjerit dal postoji room s tim userom.
//  ako postoji samo postavit currentRoomId

// 2. ako ne postoji room, kreirat novi room. u addUserIds dodat usera
//  postavit currentUserId novog rooma

// 3. dodat u connect hook onAddedToRoom, subscrijbat se na taj room

export class Store {
    @observable errorMessage?: string
    @observable loading: boolean = true;
    @observable chatkitUser: any = {}
    @observable usersWhoAreTyping: RoomDataCollection<string[]> = {}
    @observable subscribedRooms?: SubscribedRoom[]
    @observable messagesCollection: RoomDataCollection<Message[]> = {}
    @observable currentRoomId?: string
    @observable userJoinedRooms?: UserJoinedRoom[]
    @observable cursorCollection: RoomDataCollection<number> = {}

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
    setInitialCursorCollection = (cursors: Cursor[]) => {
        cursors.forEach(cursor => {
            this.cursorCollection[cursor.room_id] = cursor.position
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
        .connect({
            onNewReadCursor: (cursor: CursorHook) => {
                runInAction(() => {
                    if (cursor.roomId) {
                        this.cursorCollection[cursor.roomId] = cursor.position
                    }
                })
            }
        })
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
                            this.usersWhoAreTyping[room.id] =
                                this.usersWhoAreTyping[room.id] ? [...this.usersWhoAreTyping[room.id], user.name] : [user.name]

                        },
                        onUserStoppedTyping: (user: RoomUser) => {
                            if (this.usersWhoAreTyping[room.id]) {
                                this.usersWhoAreTyping[room.id] = this.usersWhoAreTyping[room.id].filter(
                                    username => username !== user.name
                                )
                            }
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

    public setCursor = () => {
        this.chatkitUser.setReadCursor({
            roomId: String(this.currentRoomId),
            position: parseInt(this.getLastMessageId!)
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
        return _.chain(this.subscribedRooms)
            .filter(['isPrivate', false])
            .sortBy((room: SubscribedRoom) => room.name === 'General' ? 1 : 99)
            .value()
    }

    @computed
    get notificationsCollection(): RoomDataCollection<boolean> {
        const notificationsCollection: RoomDataCollection<boolean> = {}
        _.forEach(this.messagesCollection, (messages: Message[], key: string) => {
            if (_.isEmpty(messages)) {
                notificationsCollection[key] = false
            } else {
                const lastMessage = _.last(messages!)
                notificationsCollection[key] = lastMessage!.id !== this.cursorCollection[key]
            }
        })

        return notificationsCollection
    }

    @computed
    get usersWhoAreTypingInRoom(): string[] {
        if (!_.isEmpty(this.usersWhoAreTyping[this.currentRoomId!])) {
            return this.usersWhoAreTyping[this.currentRoomId!]
        }
        return []
    }
}

export function initializeStore() {
    return new Store()
}