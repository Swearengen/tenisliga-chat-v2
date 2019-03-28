export interface CurrentUser {
    userName: string;
    userId: string;
}

export interface RoomUser {
    id: string;
    name: string;
    avatarUrl?: string;
}

export interface SubscribedRoom {
    id: string;
    name?: string;
    isPrivate: boolean;
    customData?: Object;
    userIds?: string[];
    users: Array<any>
}

export interface UserJoinedRoom {
    id: string;
    name: string;
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

export interface MessagesCollection {
    [key: string]: Message[]
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