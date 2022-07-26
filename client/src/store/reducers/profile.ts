import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { InitialState } from '../types/profile'
import { ActionStatus, Modal } from '../types/common'
import { setActionStatus, setModalAction } from '../helpers/common'

const initialState: InitialState = {
  user: {
    avatar: null,
    username: null,
    fullname: null,
    birthdate: null,
    email: null,
    phone: null,
  },
  actions: {
    edit: { status: 'idle', message: null },
  },
  modals: {
    confirmModal: {
      visible: false,
      selected: {},
      options: {},
    },
  },
  isEdit: false,
}

const state = { ...initialState }

const profileSlice = createSlice({
  name: 'profile',
  initialState: state,
  reducers: {
    setUser(state, { payload }: PayloadAction<{ [_: string]: any }>) {
      state.user = { ...state.user, ...payload }
    },
    setEdit(state, { payload }: PayloadAction<typeof state.isEdit>) {
      state.isEdit = payload
    },
    setAction: (
      state,
      {
        payload,
      }: PayloadAction<{ field: keyof typeof state.actions; action: typeof state.actions[keyof typeof state.actions] }>
    ) => {
      setActionStatus(state.actions[payload.field], payload.action)
    },
    setModal(
      state,
      {
        payload,
      }: PayloadAction<{ field: keyof typeof state.modals; action: typeof state.modals[keyof typeof state.modals] }>
    ) {
      setModalAction(state.modals[payload.field], payload.action)
    },
    clear() {
      return initialState
    },
  },
})

export const profileSliceActions = profileSlice.actions
export default profileSlice.reducer
