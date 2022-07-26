import {
  SocketError,
  DialogChatResponse,
  GroupChatResponse,
  DialogResponse,
  GroupResponse,
  MessageResponse
} from '../common/types'
import { UserResponse } from '../../common/types'

// GetChats

export interface GetChats {
  userID: string
}

export interface GotChats extends SocketError {
  userID: string
  chats: (DialogChatResponse | GroupChatResponse)[]
}

// GetDialogs

export interface GetDialogs {
  userID: string
}

export interface GotDialogs extends SocketError {
  userID: string
  dialogs: DialogResponse[]
}

// SearchChats

export interface SearchChats {
  value: string
  userID: string
}

export interface SearchedChats extends SocketError {
  userID: string
  chats: (DialogChatResponse | GroupChatResponse)[]
  users: UserResponse[]
}

// SearchDialogs

export interface SearchDialogs {
  value: string
  userID: string
}

export interface SearchedDialogs extends SocketError {
  userID: string
  dialogs: GroupResponse[]
}

// CreateGroup

export interface CreateGroup {
  creatorID: string
  name: string
  image?: string
  roster: { userID: string }[]
}

export interface CreatedGroup extends SocketError {
  userID: string
  group: GroupResponse
}

// New Messages

export interface NewMessage extends SocketError {
  chat: (DialogChatResponse | GroupChatResponse) & { created: boolean }
  message: MessageResponse
}