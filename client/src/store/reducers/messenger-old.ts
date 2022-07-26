export {}

// import { createSlice, PayloadAction, current } from '@reduxjs/toolkit'
//
// import {
//   InitialState,
//   DialogChatListItem,
//   GroupChatListItem,
//   Folder,
//   ChatMessage,
//   HeadType,
//   ChatType,
//   TabFolderActions,
//   TabFolderModals,
//   TabFolderExtra,
// } from '../types/messenger'
// import { User, Socket, ActionStatus, Modal } from '../types/common'
// import { ExtraPayloadCreateFolder, ExtraPayloadCreateGroup } from '../types/messenger'
// import { move } from '../../utils/services'
// import { setActionStatus, setExtraAction, setModalAction } from '../helpers/common'
//
// const initialState: InitialState = {
//   socket: {
//     chat: {
//       connected: false,
//     },
//     chatManager: {
//       connected: false,
//     },
//     folderManager: {
//       connected: false,
//     },
//   },
//   chat: {
//     head: {
//       type: 'empty',
//       id: null,
//       name: null,
//       avatar: null,
//       roster: [],
//     },
//     body: {
//       messages: [],
//       unreadMessages: null,
//     },
//     actions: {
//       joinChat: { status: 'idle', message: null },
//       leaveChat: { status: 'idle', message: null },
//       sendMessage: { status: 'idle', message: null },
//       sentMessage: { status: 'idle', message: null },
//       readMessages: { status: 'idle', message: null },
//     },
//   },
//   tabs: {
//     chats: {
//       list: [],
//       actions: {
//         searchChats: { status: 'idle', message: null },
//       },
//       extra: {
//         createFolder: { active: false, payload: { name: null, dialogs: [], groups: [] } },
//       },
//     },
//     personalChats: {
//       list: [],
//       actions: {
//         searchChats: { status: 'idle', message: null },
//       },
//       extra: {
//         createGroup: { active: false, payload: { name: null, roster: [] } },
//       },
//     },
//     folders: [],
//   },
//   actions: {
//     getChats: { status: 'idle', message: null },
//     getDialogs: { status: 'idle', message: null },
//     getFolders: { status: 'idle', message: null },
//     createGroup: { status: 'idle', message: null },
//     createFolder: { status: 'idle', message: null },
//     addNewMessage: { status: 'idle', message: null },
//   },
//   modals: {
//     createFolder: { visible: false, selected: {}, options: {} },
//     createGroup: { visible: false, selected: {}, options: {} },
//   },
// }
//
// const folderActions: TabFolderActions = {
//   editFolder: { status: 'idle', message: null },
//   deleteFolder: { status: 'idle', message: null },
//   searchChats: { status: 'idle', message: null },
// }
// const folderModals: TabFolderModals = {
//   deleteFolder: { visible: false, selected: {}, options: {} },
//   editFolder: { visible: false, selected: {}, options: {} },
//   confirmDeleteFolderChats: { visible: false, selected: {}, options: {} },
// }
// const folderExtra: TabFolderExtra = {}
//
// const state = { ...initialState }
//
// const messengerSlice = createSlice({
//   name: 'messenger',
//   initialState: state,
//   reducers: {
//     setSocket: (
//       state,
//       { payload }: PayloadAction<{ field: 'chat' | 'chatManager' | 'folderManager'; socket: Socket }>
//     ) => {
//       state.socket[payload.field] = { ...state.socket[payload.field], ...payload.socket }
//     },
//     setMessengerAction: (
//       state,
//       {
//         payload,
//       }: PayloadAction<{
//         field: 'getChats' | 'getDialogs' | 'getFolders' | 'createGroup' | 'createFolder' | 'addNewMessage'
//         action: ActionStatus
//       }>
//     ) => {
//       setActionStatus(state.actions[payload.field], payload.action)
//     },
//     setMessengerModal: (
//       state,
//       { payload }: PayloadAction<{ field: 'createFolder' | 'createGroup'; action: Modal<any, any> }>
//     ) => {
//       setModalAction(state.modals[payload.field], payload.action)
//     },
//     setExtraCreateGroup: (state, { payload }: PayloadAction<{ active?: boolean; action: ExtraPayloadCreateGroup }>) => {
//       const { active, action } = payload
//
//       setExtraAction(state.tabs.personalChats.extra.createGroup, { active, payload: action })
//     },
//     clear: () => {
//       return initialState
//     },
//
//     setChatHead: (
//       state,
//       {
//         payload,
//       }: PayloadAction<{
//         type?: HeadType
//         id?: string | null
//         name?: string | null
//         avatar?: string | null
//         roster?: User[]
//       }>
//     ) => {
//       state.chat.head.type = payload.type ?? state.chat.head.type
//       state.chat.head.id = payload.id ?? state.chat.head.id
//       state.chat.head.name = payload.name ?? state.chat.head.name
//       state.chat.head.avatar = payload.avatar ?? state.chat.head.avatar
//       state.chat.head.roster = payload.roster ?? state.chat.head.roster
//     },
//     setMessages: (state, { payload }: PayloadAction<ChatMessage[]>) => {
//       state.chat.body.messages = payload
//     },
//     setChatUnreadMessages: (state, { payload }: PayloadAction<number>) => {
//       state.chat.body.unreadMessages = payload
//     },
//     addMessages: (state, { payload }: PayloadAction<ChatMessage[]>) => {
//       state.chat.body.messages = [...state.chat.body.messages, ...payload]
//     },
//     addMessage: (state, { payload }: PayloadAction<ChatMessage>) => {
//       state.chat.body.messages = [...state.chat.body.messages, payload]
//     },
//     setMessagesStatus: (state, { payload }: PayloadAction<{ [id: string]: { sent?: boolean; read?: boolean } }>) => {
//       state.chat.body.messages = state.chat.body.messages.map(message => {
//         if (payload.hasOwnProperty(message.id)) {
//           message.sent = payload[message.id].sent ?? message.sent
//           message.read = payload[message.id].read ?? message.read
//         }
//
//         return message
//       })
//     },
//     setChatAction: (
//       state,
//       {
//         payload,
//       }: PayloadAction<{
//         field: 'joinChat' | 'leaveChat' | 'sendMessage' | 'sentMessage' | 'readMessages'
//         action: ActionStatus
//       }>
//     ) => {
//       setActionStatus(state.chat.actions[payload.field], payload.action)
//     },
//     clearChat: state => {
//       state.chat.head = initialState.chat.head
//       state.chat.body = initialState.chat.body
//     },
//
//     setChats: (state, { payload }: PayloadAction<(DialogChatListItem | GroupChatListItem)[]>) => {
//       state.tabs.chats.list = payload
//     },
//     setChat: (state, { payload }: PayloadAction<DialogChatListItem | GroupChatListItem>) => {
//       state.tabs.chats.list = [payload, ...state.tabs.chats.list]
//     },
//     setChatsAction: (state, { payload }: PayloadAction<{ field: 'searchChats'; action: ActionStatus }>) => {
//       setActionStatus(state.tabs.chats.actions[payload.field], payload.action)
//     },
//     editChat: (state, { payload }: PayloadAction<{ id: string; chat: DialogChatListItem | GroupChatListItem }>) => {
//       state.tabs.chats.list = state.tabs.chats.list.map(chat => {
//         if (chat.id === payload.id) {
//           chat = payload.chat
//         }
//         return chat
//       })
//     },
//
//     setPersonalChats: (state, { payload }: PayloadAction<DialogChatListItem[]>) => {
//       state.tabs.personalChats.list = payload
//     },
//     setPersonalChat: (state, { payload }: PayloadAction<DialogChatListItem>) => {
//       state.tabs.personalChats.list = [payload, ...state.tabs.personalChats.list]
//     },
//     setPersonalChatsAction: (state, { payload }: PayloadAction<{ field: 'searchChats'; action: ActionStatus }>) => {
//       setActionStatus(state.tabs.personalChats.actions[payload.field], payload.action)
//     },
//
//     setFolders: (state, { payload }: PayloadAction<Folder[]>) => {
//       state.tabs.folders = payload.map(folder => ({
//         folder,
//         actions: folderActions,
//         modals: folderModals,
//         extra: folderExtra,
//       }))
//     },
//     setFolder: (state, { payload }: PayloadAction<Folder>) => {
//       state.tabs.folders = [
//         { folder: payload, actions: folderActions, modals: folderModals, extra: folderExtra },
//         ...state.tabs.folders,
//       ]
//     },
//     editFolder: (
//       state,
//       {
//         payload,
//       }: PayloadAction<{
//         id: string
//         name?: string
//         list?: (DialogChatListItem | GroupChatListItem)[]
//         updatedAt?: string
//         createdAt?: string
//       }>
//     ) => {
//       state.tabs.folders = state.tabs.folders.map(tabFolder => {
//         if (tabFolder.folder.id === payload.id) {
//           tabFolder.folder.name = payload.name ?? tabFolder.folder.name
//           tabFolder.folder.list = payload.list ?? tabFolder.folder.list
//           tabFolder.folder.updatedAt = payload.updatedAt ?? tabFolder.folder.updatedAt
//           tabFolder.folder.createdAt = payload.createdAt ?? tabFolder.folder.createdAt
//         }
//         return tabFolder
//       })
//     },
//     deleteFolder: (state, { payload }: PayloadAction<{ id: string }>) => {
//       state.tabs.folders = state.tabs.folders.filter(tabFolder => tabFolder.folder.id !== payload.id)
//     },
//     setFolderAction: (
//       state,
//       {
//         payload,
//       }: PayloadAction<{ id: string; field: 'editFolder' | 'deleteFolder' | 'searchChats'; action: ActionStatus }>
//     ) => {
//       state.tabs.folders.map(tabFolder => {
//         if (tabFolder.folder.id === payload.id) {
//           setActionStatus(tabFolder.actions[payload.field], payload.action)
//         }
//
//         return tabFolder
//       })
//     },
//     setFolderModal: (
//       state,
//       {
//         payload,
//       }: PayloadAction<{
//         id: string
//         field: 'deleteFolder' | 'editFolder' | 'confirmDeleteFolderChats'
//         action: Modal<any, any>
//       }>
//     ) => {
//       state.tabs.folders.map(tabFolder => {
//         if (tabFolder.folder.id === payload.id) {
//           setModalAction(tabFolder.modals[payload.field], payload.action)
//         }
//
//         return tabFolder
//       })
//     },
//     setExtraCreateFolder: (
//       state,
//       { payload }: PayloadAction<{ active?: boolean; action: ExtraPayloadCreateFolder }>
//     ) => {
//       const { active, action } = payload
//
//       setExtraAction(state.tabs.chats.extra.createFolder, { active, payload: action })
//     },
//
//     handleChatRosterItem: (
//       state,
//       { payload }: PayloadAction<{ id: string; chatType: ChatType; unreadMessages: number }>
//     ) => {
//       const chatIndex = state.tabs.chats.list.findIndex(chat => chat.id === payload.id)
//
//       if (chatIndex !== -1) {
//         state.tabs.chats.list[chatIndex].unreadMessages = payload.unreadMessages
//       }
//
//       if (payload.chatType === 'user') {
//         const dialogIndex = state.tabs.personalChats.list.findIndex(dialog => dialog.id === payload.id)
//
//         if (dialogIndex !== -1) {
//           state.tabs.personalChats.list[chatIndex].unreadMessages = payload.unreadMessages
//         }
//       }
//
//       state.tabs.folders.map(tabFolder => {
//         const chatIndex = tabFolder.folder.list.findIndex(chat => chat.id === payload.id)
//
//         if (chatIndex !== -1) {
//           tabFolder.folder.list[chatIndex].unreadMessages = payload.unreadMessages
//         }
//
//         return tabFolder
//       })
//     },
//
//     addNewMessageChatRosterItem: (
//       state,
//       { payload }: PayloadAction<{ id: string; message: ChatMessage; chat: DialogChatListItem | GroupChatListItem }>
//     ) => {
//       const chatIndex = state.tabs.chats.list.findIndex(chat => chat.id === payload.id)
//
//       if (chatIndex !== -1) {
//         state.tabs.chats.list[chatIndex] = payload.chat
//         state.tabs.chats.list = move(current(state.tabs.chats.list), chatIndex, 0)
//       } else {
//         state.tabs.chats.list = [payload.chat, ...state.tabs.chats.list]
//       }
//
//       if (payload.chat.type === 'user') {
//         const dialogIndex = state.tabs.personalChats.list.findIndex(dialog => dialog.id === payload.id)
//
//         if (dialogIndex !== -1) {
//           state.tabs.personalChats.list[chatIndex] = payload.chat
//           state.tabs.personalChats.list = move(current(state.tabs.personalChats.list), chatIndex, 0)
//         } else {
//           state.tabs.personalChats.list = [payload.chat, ...state.tabs.personalChats.list]
//         }
//       }
//
//       state.tabs.folders.map(tabFolder => {
//         const chatIndex = tabFolder.folder.list.findIndex(chat => chat.id === payload.id)
//
//         if (chatIndex !== -1) {
//           tabFolder.folder.list[chatIndex] = payload.chat
//           tabFolder.folder.list = move(current(tabFolder.folder.list), chatIndex, 0)
//         }
//
//         return tabFolder
//       })
//     },
//   },
// })
//
// export const messengerSliceActions = messengerSlice.actions
// export default messengerSlice.reducer
