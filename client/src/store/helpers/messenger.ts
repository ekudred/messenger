import {
  DialogChatResponse,
  DialogResponse,
  GroupChatResponse,
  GroupResponse,
  MessageResponse,
} from 'API/socket/common/types'
import { UserResponse } from 'API/common/types'
import { FolderResponse } from 'API/socket/folder-manager/types'
import { ChatMessage, ChatMessageType } from 'store/types/messenger/chat'
import { DialogChatListItem, GroupChatListItem, Folder } from 'store/types/messenger/manager'
import { User } from 'store/types/common'
import { TransformedUser } from './common'

// ChatRosterItem

export class TransformedUserChatListItem implements DialogChatListItem {
  public type: 'user'
  public id: string
  public comradeID: string
  public name: string
  public avatar: string
  public roster: User[]
  public lastMessage: null
  public unreadMessages: number
  public selected: null
  public updatedAt: string
  public createdAt: string

  constructor(comrade: UserResponse, user: UserResponse) {
    this.type = 'user'
    this.id = comrade.id
    this.comradeID = comrade.id
    this.name = comrade.username
    this.avatar = comrade.avatar
    this.roster = [new TransformedUser(user), new TransformedUser(comrade)]
    this.lastMessage = null
    this.unreadMessages = 0
    this.selected = null
    this.updatedAt = comrade.updatedAt
    this.createdAt = comrade.createdAt
  }
}

export class TransformedDialogChatListItem implements DialogChatListItem {
  public type: 'user'
  public id: string
  public comradeID: string
  public name: string
  public avatar: string
  public roster: User[]
  public lastMessage: ChatMessage | null
  public unreadMessages: number
  public updatedAt: string
  public createdAt: string

  constructor(dialog: DialogResponse, userID: string) {
    const comrade = dialog.roster.find(user => user.id !== userID)!
    const unreadMessages = dialog.unreadMessages
      ? dialog.unreadMessages.filter(message => message.unread.findIndex(item => item.userID === userID) !== -1).length
      : 0

    this.type = 'user'
    this.id = dialog.id
    this.comradeID = comrade.id
    this.name = comrade.username
    this.avatar = comrade.avatar
    this.roster = dialog.roster
    this.lastMessage = dialog.lastMessage
      ? new TransformedChatMessage(dialog.lastMessage, userID, true, dialog.roster.length)
      : null
    this.unreadMessages = unreadMessages
    this.updatedAt = dialog.updatedAt
    this.createdAt = dialog.createdAt
  }
}

export class TransformedGroupChatListItem implements GroupChatListItem {
  public type: 'group'
  public id: string
  public name: string
  public creator: User
  public avatar: string
  public roster: User[]
  public lastMessage: ChatMessage | null
  public unreadMessages: number
  public updatedAt: string
  public createdAt: string

  constructor(group: GroupResponse, userID: string) {
    const comrade = group.roster.find(user => user.id !== userID)!
    const unreadMessages = group.unreadMessages
      ? group.unreadMessages.filter(message => message.unread.findIndex(item => item.userID === userID) !== -1).length
      : 0

    this.type = 'group'
    this.id = group.id
    this.name = comrade.username
    this.creator = new TransformedUser(group.creator)
    this.avatar = comrade.avatar
    this.roster = group.roster.map(item => new TransformedUser(item))
    this.lastMessage = group.lastMessage
      ? new TransformedChatMessage(group.lastMessage, userID, true, group.roster.length)
      : null
    this.unreadMessages = unreadMessages
    this.updatedAt = group.updatedAt
    this.createdAt = group.createdAt
  }
}

export const transformChatList = (chats: (DialogChatResponse | GroupChatResponse)[], userID: string) => {
  return chats.map(item => {
    if (item.type === 'user') {
      return new TransformedDialogChatListItem(item.chat, userID)
    }
    if (item.type === 'group') {
      return new TransformedGroupChatListItem(item.chat, userID)
    }

    throw new Error('Сhat type does not exist')
  })
}

// export const sortChatRoster = (chats: (DialogChatListItem | GroupChatListItem)[]): (DialogChatListItem |
// GroupChatListItem)[] => { return chats.sort((a, b) => { return (a.lastMessage.createdAt > b.lastMessage.createdAt)
// ? -1 : (a.lastMessage.createdAt < b.lastMessage.createdAt) ? 1 : 0 }) }

// Folder

export class TransformedFolder implements Folder {
  public id: string
  public name: string
  public list: (DialogChatListItem | GroupChatListItem)[]
  public updatedAt: string
  public createdAt: string

  constructor(folder: FolderResponse) {
    const list = folder.list.map(item => {
      if (item.type === 'user') {
        return new TransformedDialogChatListItem(item.chat, folder.userID)
      }
      if (item.type === 'group') {
        return new TransformedGroupChatListItem(item.chat, folder.userID)
      }

      throw new Error('Сhat type does not exist')
    })

    this.id = folder.id
    this.name = folder.name
    this.list = list
    this.updatedAt = folder.updatedAt
    this.createdAt = folder.createdAt
  }
}

export const sortFolders = (folders: Folder[]): Folder[] => {
  return folders
  // return folders.sort((a, b) => {
  //   return (a.createdAt > b.createdAt) ? -1 : (a.createdAt < b.createdAt) ? 1 : 0
  // })
}

// ChatMessage

export class TransformedChatMessage implements ChatMessage {
  public type: ChatMessageType
  public id: string
  public author: User
  public text: string
  public sent: boolean
  public read: boolean
  public updatedAt: string
  public createdAt: string

  constructor(message: MessageResponse, userID: string, sent: boolean, rosterLength: number) {
    const type = message.author.id === userID ? 'my' : 'me'
    const read = type === 'me' ? !message.unread.some(item => item.userID === userID) : message.unread.length < rosterLength - 1

    this.type = type
    this.id = message.id
    this.author = new TransformedUser(message.author)
    this.text = message.text
    this.sent = sent
    this.read = read
    this.updatedAt = message.updatedAt
    this.createdAt = message.createdAt
  }
}

// export const sortChatMessages = (messages: ChatMessage[]): ChatMessage[] => {
//   return messages.sort((a, b) => {
//     return (a.createdAt < b.createdAt) ? -1 : (a.createdAt > b.createdAt) ? 1 : 0
//   })
// }