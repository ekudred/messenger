import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { InitialState } from '../types/global'
import { setActionStatus } from '../helpers/common'

const initialState: InitialState = {
  client: {
    id: null,
    timezone: null,
  },
  actions: {
    getResultFP: { status: 'idle', message: null },
  },
}

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setAction: (
      state,
      {
        payload,
      }: PayloadAction<{ field: keyof typeof state.actions; action: typeof state.actions[keyof typeof state.actions] }>
    ) => {
      setActionStatus(state.actions[payload.field], payload.action)
    },
    setClient: (state, { payload }: PayloadAction<typeof state.client>) => {
      state.client = payload
    },
  },
})

export const globalSliceActions = globalSlice.actions
export default globalSlice.reducer
