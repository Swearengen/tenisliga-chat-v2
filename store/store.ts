import { action, observable, computed } from 'mobx'
import { useStaticRendering } from 'mobx-react'
const Chatkit = require('@pusher/chatkit-client'); // todo: why import is not working
import * as _ from 'lodash'

import { UserJoinedRoom, SubscribedRoom, Message, RoomUser, RoomDataCollection, Cursor, CursorHook, PresenceData } from './types';
import { findPrivateRoom } from './utils';

const isServer = !process.browser
useStaticRendering(isServer)

const API_URL = process.env.API_URL
const CHATKIT_INSTANCE_LOCATOR = process.env.CHATKIT_INSTANCE_LOCATOR

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
    @observable sendMessagesCollection: RoomDataCollection<string> = {}
    @observable presenceData: PresenceData = {}

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
    changeRoom = (id: string) => {
        this.currentRoomId = id
    }

    @action
    leagueUserClicked = (user: RoomUser) => {
        const existingRoom = findPrivateRoom(user, this.chatkitUser.id, this.privateRooms)

        if (existingRoom) {
            this.changeRoom(existingRoom.id)
        } else {
            this.chatkitUser.createRoom({
                name: `${this.chatkitUser.name}-${user.name}`,
                private: true,
                addUserIds: [user.id]
            })
            .then((room: SubscribedRoom) => {
                this.connectToRoom(room.id)
                .then(() => {
                    this.currentRoomId = room.id
                })
            })
        }
    }

    @action
    setMessageToSend = (text: string) => {
        this.sendMessagesCollection[this.currentRoomId!] = text
        this.sendUserTypingEvent()
    }

    @action
    sendMessage = () => {
        this.chatkitUser.sendSimpleMessage({
            text: this.messageToSend,
            roomId: this.currentRoomId
        })
        .then(() => {
            this.sendMessagesCollection[this.currentRoomId!] = ''
        })
        .catch((error: any) => {
            console.log(error)
        })
    }

    @action
    connectUserRequest = (userId: string) => {
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
                if (cursor.roomId) {
                    this.cursorCollection[cursor.roomId] = cursor.position
                }
            },
            onPresenceChanged: (state: any, user: any) => {
                this.presenceData[user.id] = state.current
            },
            onAddedToRoom: (room: SubscribedRoom) => {
                if (this.chatkitUser.id !== room.createdByUserId) {
                    this.connectToRoom(room.id)
                }
            },
        })
        .then((currentUser: any) => {
            this.chatkitUser = currentUser

            this.userJoinedRooms!.forEach(room => {
                this.loading = true
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

    @action
    connectToRoom(id: string) {
        return this.chatkitUser
            .subscribeToRoom({
                roomId: id,
                messageLimit: 50,
                hooks: {
                    onMessage: (message: Message) => {
                        const roomMessages = this.messagesCollection[message.roomId]
                        this.messagesCollection[message.roomId] = roomMessages ? [...roomMessages, message] : [message]
                    },
                    onUserStartedTyping: (user: RoomUser) => {
                        this.usersWhoAreTyping[id] =
                            this.usersWhoAreTyping[id] ? [...this.usersWhoAreTyping[id], user.name] : [user.name]
                    },
                    onUserStoppedTyping: (user: RoomUser) => {
                        if (this.usersWhoAreTyping[id]) {
                            this.usersWhoAreTyping[id] = this.usersWhoAreTyping[id].filter(
                                username => username !== user.name
                            )
                        }
                    }
                }
            })
            .then((currentRoom: SubscribedRoom) => {
                this.subscribedRooms = this.subscribedRooms ? [...this.subscribedRooms, currentRoom] : [currentRoom]
            })
            .catch((err: any) => {
                console.log(err);
                this.errorMessage = err.info ? err.info.error_description : 'Server error'
            })
    }

    public sendUserTypingEvent = () => {
        this.chatkitUser.isTypingIn({roomId: this.currentRoomId})
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
    get leagueRoom() {
        // todo: tu dohvatit usere koji su roomu lige.
        // dohvatit sobu po customData
        return _.find(this.subscribedRooms, ['name', 'Room 1'])
    }

    @computed
    get usersFromLeagueRoom(): any {
        if (this.leagueRoom) {
            const userIds = _.difference(this.leagueRoom.userIds, [this.chatkitUser.id])

            return _.filter(this.chatkitUser.userStore.users, _.flow(
                _.identity,
                _.property('id'),
                _.partial(_.includes, userIds)
            ))
        }
        return []
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

    @computed
    get messageToSend(): string {
        return this.sendMessagesCollection[this.currentRoomId!]
    }
}

export function initializeStore() {
    return new Store()
}