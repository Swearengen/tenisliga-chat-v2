import * as _ from 'lodash'

import { SubscribedRoom, UserJoinedRoom, RoomUser } from "./types";

export const mapSubscribedRoomToUserJoinedRoom = (room: SubscribedRoom): UserJoinedRoom => {
    const userJoinedProps =  {
        id: room.id,
        name: room.name,
        private: room.isPrivate,
        member_user_ids: room.userIds,
    } as UserJoinedRoom

    if (room.customData) {
        return {
            ...userJoinedProps,
            customData: room.customData
        }
    }

    return userJoinedProps
}

export const findPrivateRoom = (userForChat: RoomUser, currentUserId: string, privateRooms: UserJoinedRoom[]) => {
    return _.find(privateRooms, (room) => {
        if (!room.private) {
            return false
        }
        const intersection = _.intersection(room.member_user_ids, [currentUserId, userForChat.id])
        return intersection.length === 2
    })
}