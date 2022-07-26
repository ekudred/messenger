import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { InitialState } from '../types/navbar'

const initialState: InitialState = {
  drawer: {
    visible: false
  }
}

const state = { ...initialState }

const navbarSlice = createSlice({
  name: 'navbar',
  initialState: state,
  reducers: {
    showNavbarDrawer: (state, { payload }: PayloadAction<typeof state.drawer.visible>) => {
      state.drawer.visible = payload
    },
    clear: () => {
      return initialState
    }
  }
})

export const navbarSliceActions = navbarSlice.actions
export default navbarSlice.reducer