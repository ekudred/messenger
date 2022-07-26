import { SocketError, DialogChatResponse, GroupChatResponse } from '../common/types'

export interface FolderResponse {
  id: string
  userID: string
  name: string
  list: (DialogChatResponse | GroupChatResponse)[]
  updatedAt: string
  createdAt: string
}

// CreateFolder

export interface CreateFolder {
  userID: string
  name: string
  dialogs: { id: string }[]
  groups: { id: string }[]
}

export interface CreatedFolder extends SocketError {
  folder: FolderResponse
}

// EditFolder

export interface EditFolder {
  folderID: string
  folderName: string
  list: {
    deleted: {
      dialogs: DialogChatResponse[]
      groups: GroupChatResponse[]
    }
    added: {
      dialogs: DialogChatResponse[]
      groups: GroupChatResponse[]
    }
  }
}

export interface EditedFolder extends SocketError<{ folderID: string }> {
  folder: FolderResponse
}

// GetFolders

export interface GetFolders {
  userID: string
}

export interface GotFolders extends SocketError {
  folders: FolderResponse[]
}

// SearchChats

export interface SearchFolderChats {
  userID: string
  folderID: string
  value: string
}

export interface SearchedFolderChats extends SocketError<{ folderID: string }> {
  userID: string
  folderID: string
  chats: (DialogChatResponse | GroupChatResponse)[]
}

// DeleteFolder

export interface DeleteFolder {
  folderID: string
  folderName: string
}

export interface DeletedFolder extends SocketError<{ folderID: string }> {
  folderName: string
  folderID: string
}

// GetChats

export interface GetChats {
  userID: string
}

export interface GotChats extends SocketError {
  userID: string
  chats: (DialogChatResponse | GroupChatResponse)[]
}
