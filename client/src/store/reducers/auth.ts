import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { InitialState } from '../types/auth'
import { setActionStatus } from '../helpers/common'

const initialState: InitialState = {
  isAuth: false,
  isConfirm: false,
  info: {
    userID: null,
    role: null,
    accessToken: null,
    updatedAt: null,
    createdAt: null,
  },
  actions: {
    signUp: { status: 'idle', message: null },
    signIn: { status: 'idle', message: null },
    signOut: { status: 'idle', message: null },
    refresh: { status: 'idle', message: null },
    confirm: { status: 'idle', message: null },
  },
}

const state = { ...initialState }

const authSlice = createSlice({
  name: 'auth',
  initialState: state,
  reducers: {
    setAuth: (state, { payload }: PayloadAction<typeof state.isAuth>) => {
      state.isAuth = payload
    },
    setConfirm(state, { payload }: PayloadAction<typeof state.isConfirm>) {
      state.isConfirm = payload
    },
    setInfo: (state, { payload }: PayloadAction<typeof state.info>) => {
      state.info = { ...state.info, ...payload }
    },
    setAction: (
      state,
      {
        payload,
      }: PayloadAction<{ field: keyof typeof state.actions; action: typeof state.actions[keyof typeof state.actions] }>
    ) => {
      setActionStatus(state.actions[payload.field], payload.action)
    },
    clear: () => {
      return initialState
    },
  },
})

export const authSliceActions = authSlice.actions
export default authSlice.reducer
