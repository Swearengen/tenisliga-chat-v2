import { action, observable } from 'mobx'
import { useStaticRendering } from 'mobx-react'
const Chatkit = require('@pusher/chatkit-client'); // todo: why import is not working
import * as _ from 'lodash'

import { UserJoinedRoom, SubscribedRoom, Message, RoomUser } from './types';

const isServer = !process.browser
useStaticRendering(isServer)

const API_URL = process.env.API_URL
const CHATKIT_INSTANCE_LOCATOR = process.env.CHATKIT_INSTANCE_LOCATOR

export class Store {
    @observable userJoinedRooms?: UserJoinedRoom[]
    @observable loading: boolean = true;
    @observable chatkitUser: any = {}
    @observable currentRoom?: SubscribedRoom
    @observable messages?: Message[]
    @observable roomUsers?: RoomUser[]
    @observable usersWhoAreTyping: string[] = []

    @action
    setUserJoinedRoom = (rooms: UserJoinedRoom[]) => {
        this.userJoinedRooms = rooms
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

                // 1. popis idejava svih soba treba dohvatit na serveru, metoda je getUserRooms
                    // proc kroz popis i u channels dodat sve sobe koje su public i koji su sobe od svake lige (customData neki)
                    // ostale su znaci privatne poruke

                // 2. postavit na pocetku da je currentRoom general soba

                // 3. tu se subscrijba i dodaje u general sobu
                    // trebalo bi tu subscrijabat na sve sobe
                    // u onMessage hook metodi odoavat message u store po id-ju
                    // u started i stoped typing metodama zapisivat u store samo ako je trenutni id jednak currentRoom id-ju

                // 4. kad netko zeli promjenit sobu klikajuci po kanalima
                // samo mjenjam currentRoom i u metodi getCurrentMessages (nova metoda) vracam trenutne poruke

                // 5. kad dodam search za usere, odabirom iz dropdowna provjeravam dal postoji private soba sa tim userom
                    // ako postoji uzmem id te sobe i postavljam je kao currentRomm
                    // ako ne postoji kreiram novu sobu i postavljam je kao currentRoom

                this.chatkitUser.subscribeToRoomMultipart({
                    roomId: "19401223",
                    messageLimit: 100,
                    hooks: {
                        onMessage: (message: Message) => {
                            this.messages = this.messages ? [...this.messages, message] : [message]
                        },
                        onUserStartedTyping: (user: RoomUser) => {
                            this.usersWhoAreTyping = [...this.usersWhoAreTyping, user.name]
                        },
                        onUserStoppedTyping: (user: RoomUser) => {
                            this.usersWhoAreTyping = this.usersWhoAreTyping.filter(
                                username => username !== user.name
                            )
                        }
                    },
                })
                .then((currentRoom: SubscribedRoom) => {
                    this.loading = false

                    this.currentRoom = currentRoom
                    _.forEach(currentUser.users, (value) => {
                        let roomUser = value
                        this.roomUsers = this.roomUsers ? [...this.roomUsers, roomUser] : [roomUser]
                    });


                })
            })
            .catch((error: any) => {
                this.loading = false
                // handle error here
                console.error('error', error)
            })
    }

    public sendUserTypingEvent = () => {
        this.chatkitUser.isTypingIn({roomId: this.currentRoom!.id})
            .catch((error: any) => {
                console.log(error)
            })
    }

    public sendMessage = (text: string) => {
        this.chatkitUser.sendSimpleMessage({
            text,
            roomId: this.currentRoom!.id
        })
        .catch((error: any) => {
            console.log(error)
        })
    }

    public connectUser = _.once(this.connectUserRequest)
}

export function initializeStore() {
    return new Store()
}