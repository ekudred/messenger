import { createSlice, PayloadAction, current } from '@reduxjs/toolkit'

import { ActionStatus, Modal, Socket } from '../../types/common'
import { ChatType, ChatMessage } from '../../types/messenger/chat'
import {
  InitialState,
  ChatsTabActions,
  ChatsTabModals,
  PersonalChatsTabActions,
  PersonalChatsTabModals,
  Folder,
  FolderTab,
  FolderTabActions,
  FolderTabModals,
  DialogChatListItem,
  GroupChatListItem,
  ChatsTabExtra,
  PersonalChatsTabExtra,
  FolderTabExtra,
} from 'store/types/messenger/manager'
import { setActionStatus, setModalAction } from 'store/helpers/common'
import { move } from 'utils/services'

const initialState: InitialState = {
  socket: {
    chatManager: {
      connected: false,
    },
    folderManager: {
      connected: false,
    },
  },
  tabs: {
    default: {
      0: {
        id: '0',
        key: 'chats',
        name: 'All chats',
        list: [],
        selected: {},
        selectable: false,
        actions: {
          createFolder: { status: 'idle', message: null },
          searchChats: { status: 'idle', message: null },
        },
        modals: {
          createFolder: { visible: false, selected: {}, options: {} },
          addChatsToFolder: { visible: false, selected: {}, options: {} },
        },
        extra: null,
      },
      1: {
        id: '1',
        key: 'personalChats',
        name: 'Personal',
        list: [],
        selected: {},
        selectable: false,
        actions: {
          createGroup: { status: 'idle', message: null },
          searchChats: { status: 'idle', message: null },
        },
        modals: {
          createGroup: { visible: false, selected: {}, options: {} },
        },
        extra: null,
      },
    },
    folders: {},
  },
  actions: {
    getChats: { status: 'idle', message: null },
    getDialogs: { status: 'idle', message: null },
    getFolders: { status: 'idle', message: null },
    addNewMessage: { status: 'idle', message: null },
  },
}

const folderActions: FolderTabActions = {
  editFolder: { status: 'idle', message: null },
  deleteFolder: { status: 'idle', message: null },
  searchChats: { status: 'idle', message: null },
}
const folderModals: FolderTabModals = {
  deleteFolder: { visible: false, selected: {}, options: {} },
  editFolder: { visible: false, selected: {}, options: {} },
  confirmDeleteFolderChats: { visible: false, selected: {}, options: {} },
}
const folderExtra: FolderTabExtra = null

const state = { ...initialState }

const managerSlice = createSlice({
  name: 'manager',
  initialState: state,
  reducers: {
    setSocket: (state, { payload }: PayloadAction<{ field: keyof typeof state.socket; socket: Socket }>) => {
      state.socket[payload.field] = { ...state.socket[payload.field], ...payload.socket }
    },
    setManagerAction: (
      state,
      { payload }: PayloadAction<{ field: keyof typeof state.actions; action: ActionStatus }>,
    ) => {
      setActionStatus(state.actions[payload.field], payload.action)
    },

    // ChatsTab

    setChatsTabList: (state, { payload }: PayloadAction<(DialogChatListItem | GroupChatListItem)[]>) => {
      state.tabs.default['0'].list = [...payload]
    },
    addChatsTabList: (state, { payload }: PayloadAction<(DialogChatListItem | GroupChatListItem)[]>) => {
      state.tabs.default['0'].list = [...payload, ...state.tabs.default['0'].list]
    },
    setChatsTabAction: (state, { payload }: PayloadAction<{ field: keyof ChatsTabActions; action: ActionStatus }>) => {
      setActionStatus(state.tabs.default['0'].actions[payload.field], payload.action)
    },
    setChatsTabModal: (
      state,
      { payload }: PayloadAction<{ field: keyof ChatsTabModals; action: Modal<any, any> }>,
    ) => {
      setModalAction(state.tabs.default['0'].modals[payload.field], payload.action)
    },
    deleteChatsTabListItem: (state, { payload }: PayloadAction<{ id: string }>) => {
      state.tabs.default['0'].list = state.tabs.default['0'].list.filter(item => item.id === payload.id)
    },
    changeChatsTabListItem: (
      state,
      { payload }: PayloadAction<{ id: string; item: DialogChatListItem | GroupChatListItem }>,
    ) => {
      state.tabs.default['0'].list = state.tabs.default['0'].list.map(item => {
        if (item.id === payload.id) {
          item = payload.item
        }

        return item
      })
    },
    setChatsTabExtra: (state, { payload }: PayloadAction<ChatsTabExtra>) => {
      state.tabs.default['0'].extra = payload
    },
    setChatsTabSelectable: (state, { payload }: PayloadAction<boolean>) => {
      state.tabs.default['0'].selectable = payload
    },
    handleChatsTabSelected: (state, { payload }: PayloadAction<{ item: { id: string, type: ChatType } }>) => {
      if (state.tabs.default['0'].selected[payload.item.id]) {
        delete state.tabs.default['0'].selected[payload.item.id]
      } else {
        state.tabs.default['0'].selected[payload.item.id] = payload.item.type
      }
    },
    clearChatsTabSelected: (state) => {
      state.tabs.default['0'].selected = {}
    },

    // PersonalChatsTab

    setPersonalChatsTabList: (state, { payload }: PayloadAction<DialogChatListItem[]>) => {
      state.tabs.default['1'].list = [...payload]
    },
    addPersonalChatsTabList: (state, { payload }: PayloadAction<DialogChatListItem[]>) => {
      state.tabs.default['1'].list = [...payload, ...state.tabs.default['1'].list]
    },
    setPersonalChatsTabAction: (
      state,
      { payload }: PayloadAction<{ field: keyof PersonalChatsTabActions; action: ActionStatus }>,
    ) => {
      setActionStatus(state.tabs.default['1'].actions[payload.field], payload.action)
    },
    setPersonalChatsTabModal: (
      state,
      { payload }: PayloadAction<{ field: keyof PersonalChatsTabModals; action: Modal<any, any> }>,
    ) => {
      setModalAction(state.tabs.default['1'].modals[payload.field], payload.action)
    },
    deletePersonalChatsTabListItem: (state, { payload }: PayloadAction<{ id: string }>) => {
      state.tabs.default['1'].list = state.tabs.default['1'].list.filter(item => item.id === payload.id)
    },
    changePersonalChatsTabListItem: (state, { payload }: PayloadAction<{ id: string; item: DialogChatListItem }>) => {
      state.tabs.default['1'].list = state.tabs.default['1'].list.map(item => {
        if (item.id === payload.id) {
          item = payload.item
        }

        return item
      })
    },
    setPersonalChatsTabExtra: (state, { payload }: PayloadAction<PersonalChatsTabExtra>) => {
      state.tabs.default['1'].extra = payload
    },
    setPersonalChatsTabSelectable: (state, { payload }: PayloadAction<boolean>) => {
      state.tabs.default['1'].selectable = payload
    },
    handlePersonalChatsTabSelected: (state, { payload }: PayloadAction<{ item: { id: string, type: ChatType } }>) => {
      if (state.tabs.default['1'].selected[payload.item.id]) {
        delete state.tabs.default['1'].selected[payload.item.id]
      } else {
        state.tabs.default['1'].selected[payload.item.id] = payload.item.type
      }
    },
    clearPersonalChatsTabSelected: (state) => {
      state.tabs.default['1'].selected = {}
    },

    // FolderTab

    setFolderTab: (state, { payload }: PayloadAction<Folder>) => {
      state.tabs.folders[payload.id] = {
        id: payload.id,
        key: 'folder',
        name: payload.name,
        list: payload.list,
        selected: {},
        selectable: false,
        actions: folderActions,
        modals: folderModals,
        extra: folderExtra,
      }
    },
    setFolderTabs: (state, { payload }: PayloadAction<Folder[]>) => {
      const folderTabs: { [id: string]: FolderTab } = Object.fromEntries(
        payload.map(folder => [
          folder.id,
          {
            id: folder.id,
            key: 'folder',
            name: folder.name,
            list: folder.list,
            selected: {},
            selectable: false,
            actions: folderActions,
            modals: folderModals,
            extra: folderExtra,
          },
        ]),
      )

      state.tabs.folders = { ...state.tabs.folders, ...folderTabs }
    },
    changeFolderTab: (
      state,
      {
        payload,
      }: PayloadAction<{
        id: string
        name?: string
        list?: (DialogChatListItem | GroupChatListItem)[]
      }>,
    ) => {
      state.tabs.folders[payload.id].id = payload.id ?? state.tabs.folders[payload.id].id
      state.tabs.folders[payload.id].name = payload.name ?? state.tabs.folders[payload.id].name
      state.tabs.folders[payload.id].list = payload.list ?? state.tabs.folders[payload.id].list
    },
    deleteFolderTab: (state, { payload }: PayloadAction<{ id: string }>) => {
      delete state.tabs.folders[payload.id]
    },
    setFolderTabAction: (
      state,
      { payload }: PayloadAction<{ id: string; field: keyof FolderTabActions; action: ActionStatus }>,
    ) => {
      setActionStatus(state.tabs.folders[payload.id].actions[payload.field], payload.action)
    },
    setFolderTabModal: (
      state,
      { payload }: PayloadAction<{ id: string; field: keyof FolderTabModals; action: Modal<any, any> }>,
    ) => {
      setModalAction(state.tabs.folders[payload.id].modals[payload.field], payload.action)
    },
    setFolderTabExtra: (state, { payload }: PayloadAction<{ id: string; extra: FolderTabExtra }>) => {
      state.tabs.folders[payload.id].extra = payload.extra
    },
    setFolderTabSelectable: (state, { payload }: PayloadAction<{ id: string, selectable: boolean }>) => {
      state.tabs.folders[payload.id].selectable = payload.selectable
    },
    handleFolderTabSelected: (state, { payload }: PayloadAction<{ id: string; item: { id: string, type: ChatType } }>) => {
      if (state.tabs.folders[payload.id].selected[payload.item.id]) {
        delete state.tabs.folders[payload.id].selected[payload.item.id]
      } else {
        state.tabs.folders[payload.id].selected[payload.item.id] = payload.item.type
      }
    },
    clearFolderTabSelected: (state, { payload }: PayloadAction<{ id: string }>) => {
      state.tabs.folders[payload.id].selected = {}
    },

    handleChatListItem: (
      state,
      { payload }: PayloadAction<{ id: string; chatType: ChatType; unreadMessages: number }>,
    ) => {
      const chatIndex = state.tabs.default['0'].list.findIndex(item => item.id === payload.id)

      if (chatIndex !== -1) {
        state.tabs.default['0'].list[chatIndex].unreadMessages = payload.unreadMessages
      }

      if (payload.chatType === 'user') {
        const dialogIndex = state.tabs.default['1'].list.findIndex(item => item.id === payload.id)

        if (dialogIndex !== -1) {
          state.tabs.default['1'].list[chatIndex].unreadMessages = payload.unreadMessages
        }
      }

      for (const key in state.tabs.folders) {
        const chatIndex = state.tabs.folders[key].list.findIndex(item => item.id === payload.id)

        if (chatIndex !== -1) {
          state.tabs.folders[key].list[chatIndex].unreadMessages = payload.unreadMessages
        }
      }
    },

    addNewMessageChatListItem: (
      state,
      { payload }: PayloadAction<{ id: string; message: ChatMessage; item: DialogChatListItem | GroupChatListItem }>,
    ) => {
      const chatIndex = state.tabs.default['0'].list.findIndex(item => item.id === payload.id)

      if (chatIndex !== -1) {
        state.tabs.default['0'].list[chatIndex] = payload.item
        state.tabs.default['0'].list = move(current(state.tabs.default['0'].list), chatIndex, 0)
      } else {
        state.tabs.default['0'].list = [payload.item, ...state.tabs.default['0'].list]
      }

      if (payload.item.type === 'user') {
        const dialogIndex = state.tabs.default['1'].list.findIndex(item => item.id === payload.id)

        if (dialogIndex !== -1) {
          state.tabs.default['1'].list[dialogIndex] = payload.item
          state.tabs.default['1'].list = move(current(state.tabs.default['1'].list), chatIndex, 0)
        } else {
          state.tabs.default['1'].list = [payload.item, ...state.tabs.default['1'].list]
        }
      }

      for (const key in state.tabs.folders) {
        const chatIndex = state.tabs.folders[key].list.findIndex(item => item.id === payload.id)

        if (chatIndex !== -1) {
          state.tabs.folders[key].list[chatIndex] = payload.item
          state.tabs.folders[key].list = move(current(state.tabs.folders[key].list), chatIndex, 0)
        }
      }
    },
    clear: () => {
      return initialState
    },
  },
})

export const managerSliceActions = managerSlice.actions
export default managerSlice.reducer
