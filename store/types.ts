export interface CurrentUser {
    userName: string;
    userId: string;
}

export interface RoomUser {
    id: string;
    name: string;
    avatarUrl?: string;
}

export interface Room {
    id: string;
    name?: string;
    isPrivate: boolean;
    customData?: Object;
    userIds?: string[];
    users: Array<any>
}

export interface Message {
    id: number;
    roomId: string;
    senderId: string;
    parts: Part[];
    createdAt: string;
    updatedAt: string;
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