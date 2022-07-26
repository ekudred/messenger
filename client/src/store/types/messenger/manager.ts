// import { v4 as uuidv4 } from 'uuid'

import { ActionStatus, Socket, User, Modal } from '../common'
import { ChatType, ChatMessage } from './chat'

export interface InitialState {
  socket: {
    chatManager: Socket
    folderManager: Socket
  }
  tabs: {
    default: {
      0: ChatsTab
      1: PersonalChatsTab
    }
    folders: {
      [id: string]: FolderTab
    }
  }
  actions: {
    getChats: ActionStatus
    getDialogs: ActionStatus
    getFolders: ActionStatus
    addNewMessage: ActionStatus
  }
}

// ChatsTab

export interface ChatsTab {
  id: '0'
  key: 'chats'
  name: string
  list: ChatsTabList
  selected: { [id: string]: ChatType }
  selectable: boolean
  actions: ChatsTabActions
  modals: ChatsTabModals
  extra: ChatsTabExtra
}

export type ChatsTabList = (DialogChatListItem | GroupChatListItem)[]

export interface ChatsTabActions {
  createFolder: ActionStatus
  searchChats: ActionStatus
}

export interface ChatsTabModals {
  createFolder: Modal<{}, {}>
  addChatsToFolder: Modal<{}, {}>
}

export type ChatsTabExtra = 'createFolder' | 'addChatsToFolder' | null

// PersonalChatsTab

export interface PersonalChatsTab {
  id: '1'
  key: 'personalChats'
  name: string
  list: PersonalChatsTabList
  selected: { [id: string]: ChatType }
  selectable: boolean
  actions: PersonalChatsTabActions
  modals: PersonalChatsTabModals
  extra: PersonalChatsTabExtra
}

export type PersonalChatsTabList = DialogChatListItem[]

export interface PersonalChatsTabActions {
  createGroup: ActionStatus
  searchChats: ActionStatus
}

export interface PersonalChatsTabModals {
  createGroup: Modal<{}, {}>
}

export type PersonalChatsTabExtra = 'createGroup' | null

// FolderTab

export interface FolderTab {
  id: string
  key: 'folder'
  name: string
  list: FolderTabList
  selected: { [id: string]: ChatType }
  selectable: boolean
  actions: FolderTabActions
  modals: FolderTabModals
  extra: FolderTabExtra
}

export type FolderTabList = (DialogChatListItem | GroupChatListItem)[]

export interface FolderTabActions {
  deleteFolder: ActionStatus
  editFolder: ActionStatus
  searchChats: ActionStatus
}

export interface FolderTabModals {
  deleteFolder: Modal<{}, {}>
  editFolder: Modal<{}, {}>
  confirmDeleteFolderChats: Modal<{}, {}>
}

export type FolderTabExtra = 'deleteFolderChats' | null

// Folder

export interface Folder {
  id: string
  name: string
  list: (DialogChatListItem | GroupChatListItem)[]
  updatedAt: string
  createdAt: string
}

// ChatListItem's

export interface DialogChatListItem {
  type: 'user'
  id: string
  comradeID: string
  name: string
  avatar: string
  roster: User[]
  lastMessage: ChatMessage | null
  unreadMessages: number
  updatedAt: string
  createdAt: string
}

export interface GroupChatListItem {
  type: 'group'
  id: string
  name: string
  avatar: string
  creator: User
  roster: User[]
  lastMessage: ChatMessage | null
  unreadMessages: number
  updatedAt: string
  createdAt: string
}
