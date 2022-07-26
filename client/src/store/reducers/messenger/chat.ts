import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { User, ActionStatus } from 'store/types/common'
import { setActionStatus } from 'store/helpers/common'
import { InitialState, ChatMessage, HeadType } from 'store/types/messenger/chat'

const initialState: InitialState = {
  socket: {
    connected: false,
  },
  head: {
    type: 'empty',
    id: null,
    name: null,
    avatar: null,
    roster: [],
  },
  body: {
    messages: [],
    unreadMessages: null,
  },
  actions: {
    joinChat: { status: 'idle', message: null },
    leaveChat: { status: 'idle', message: null },
    sendMessage: { status: 'idle', message: null },
    sentMessage: { status: 'idle', message: null },
    readMessages: { status: 'idle', message: null },
  },
}

const state = { ...initialState }

const chatSlice = createSlice({
  name: 'chat',
  initialState: state,
  reducers: {
    setSocket: (state, { payload }: PayloadAction<{ connected: boolean }>) => {
      state.socket = { ...state.socket, ...payload }
    },
    setChatHead: (
      state,
      {
        payload,
      }: PayloadAction<{
        type?: HeadType
        id?: string | null
        name?: string | null
        avatar?: string | null
        roster?: User[]
      }>
    ) => {
      state.head.type = payload.type ?? state.head.type
      state.head.id = payload.id ?? state.head.id
      state.head.name = payload.name ?? state.head.name
      state.head.avatar = payload.avatar ?? state.head.avatar
      state.head.roster = payload.roster ?? state.head.roster
    },
    setMessages: (state, { payload }: PayloadAction<ChatMessage[]>) => {
      state.body.messages = payload
    },
    addMessages: (state, { payload }: PayloadAction<ChatMessage[]>) => {
      state.body.messages = [...state.body.messages, ...payload]
    },
    setUnreadMessages: (state, { payload }: PayloadAction<number>) => {
      state.body.unreadMessages = payload
    },
    setMessagesStatus: (state, { payload }: PayloadAction<{ [_: string]: { sent?: boolean; read?: boolean } }>) => {
      state.body.messages = state.body.messages.map(message => {
        if (payload.hasOwnProperty(message.id)) {
          message.sent = payload[message.id].sent ?? message.sent
          message.read = payload[message.id].read ?? message.read
        }

        return message
      })
    },
    setAction: (state, { payload }: PayloadAction<{ field: keyof typeof state.actions; action: ActionStatus }>) => {
      setActionStatus(state.actions[payload.field], payload.action)
    },
    clear: () => {
      return initialState
    },
  },
})

export const chatSliceActions = chatSlice.actions
export default chatSlice.reducer
