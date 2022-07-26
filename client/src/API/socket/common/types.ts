import { UserResponse } from '../../common/types'

export interface SocketError<T = null> {
  error?: {
    message: string
    extra: T
  }
}

export interface DialogResponse {
  id: string
  roster: UserResponse[]
  messages: MessageResponse[]
  lastMessage: MessageResponse | null
  unreadMessages: MessageResponse[] | null
  updatedAt: string
  createdAt: string
}

export interface DialogChatResponse {
  type: 'user'
  chat: DialogResponse
}

export interface GroupResponse {
  id: string
  name: string
  avatar: string
  creator: UserResponse
  roster: UserResponse[]
  messages: MessageResponse[]
  lastMessage: MessageResponse | null
  unreadMessages: MessageResponse[] | null
  updatedAt: string
  createdAt: string
}

export interface GroupChatResponse {
  type: 'group'
  chat: GroupResponse
}

export interface MessageResponse {
  id: string
  author: UserResponse
  chatType: ChatTypeResponse
  chatID: string
  text: string
  unread: MessageUnreadResponse[]
  createdAt: string
  updatedAt: string
}

export interface MessageUnreadResponse {
  userID: string
}

export type ChatTypeResponse = 'user' | 'group'

export interface ReadChatMessages extends SocketError {
  userID: string
  chatType: ChatTypeResponse
  chatID: string
  roster: UserResponse[]
  readMessages: { id: string }[]
  unreadMessages: number
}