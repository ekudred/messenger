import { SocketError, MessageResponse, DialogChatResponse, GroupChatResponse, ChatTypeResponse } from '../common/types'
import { UserResponse } from '../../common/types'

// JoinChat

export type JoinChat = {
  type: ChatTypeResponse
  id: string
  userID: string
}

export interface JoinedChat extends SocketError {
  userID: string
  chat: (DialogChatResponse | GroupChatResponse) & { created: boolean }
}

// LeaveChat

export interface LeaveChat {
  type: ChatTypeResponse
  id: string
}

export interface LeftChat extends SocketError {
  type: ChatTypeResponse
  id: string
}

// SendMessage

export interface SendMessage {
  messageID: string
  userID: string
  chatType: ChatTypeResponse
  chatID: string
  text: string
}

export interface SentMessage extends SocketError {
  message: MessageResponse
  unreadMessages: MessageResponse[]
}

// ViewMessage

export interface ViewChatMessages {
  userID: string
  chatType: ChatMessageType
  chatID: string
  roster: UserResponse[]
  viewMessages: { id: string }[]
}

export type ChatMessageType = 'my' | 'me'