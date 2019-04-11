export interface CurrentUser {
    userName: string;
    userId: string;
}

export interface RoomUser {
    id: string;
    name: string;
    avatarURL?: string;
}

export interface PresenceData {
    [key: string]: 'online' | 'offline'
}

export interface SubscribedRoom {
    id: string;
    name?: string;
    isPrivate: boolean;
    customData?: any;
    userIds?: string[];
    users: RoomUser[]
    createdByUserId?: string
}

export interface PrivateSubscribedRoom extends SubscribedRoom {
    displayName: string
}

export interface UserJoinedRoom {
    id: string;
    name: string;
    private: boolean;
    member_user_ids: string[];
    customData?: any
}

export interface Message {
    id: number;
    roomId: string;
    senderId: string;
    parts: Part[];
    createdAt: string;
    updatedAt: string;
    text?: string;
}

export interface RoomDataCollection<T> {
    [key: string]: T
}

export interface Cursor {
    position: number
    room_id: string
}

export interface CursorHook {
    position: number
    roomId: string
}

export enum PartType {
    INLINE = "inline",
    // URL = "url",
    // ATTACHMENT = "attachment"
}

interface MessagePayload {
    type: string;
    content: string;
}

export interface Part {
    type: PartType,
    payload: MessagePayload
}