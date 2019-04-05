import * as _ from 'lodash'

import { SubscribedRoom, RoomUser } from "./types";

export const findPrivateRoom = (userForChat: RoomUser, currentUserId: string, privateRooms: SubscribedRoom[]) => {
    return _.find(privateRooms, (room) => {
        if (!room.isPrivate) {
            return false
        }
        const intersection = _.intersection(room.userIds!, [currentUserId, userForChat.id])
        return intersection.length === 2
    })
}