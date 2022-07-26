import { ActionStatus, Socket, User } from '../common'

export interface InitialState {
  socket: Socket
  head: ChatHead
  body: ChatBody
  actions: {
    joinChat: ActionStatus
    leaveChat: ActionStatus
    sendMessage: ActionStatus
    sentMessage: ActionStatus
    readMessages: ActionStatus
  }
}

export type ChatType = 'user' | 'group'
export type HeadType = 'idle' | 'empty' | ChatType

export interface ChatHead {
  type: HeadType
  id: string | null
  name: string | null
  avatar: string | null
  roster: User[]
}

export interface ChatBody {
  messages: ChatMessage[]
  unreadMessages: number | null
}

export interface ChatMessage {
  type: ChatMessageType
  id: string
  author: User
  text: string
  sent: boolean
  read: boolean
  updatedAt: string
  createdAt: string
}

export type ChatMessageType = 'my' | 'me'