import { createSelector } from '@reduxjs/toolkit'

import { RootState } from '../index'

export const selectTabs = (state: RootState) => state.messenger.manager.tabs

export const selectTab = (id: string) => {
  return createSelector(selectTabs, tabs => {
    if (id === '0') {
      return tabs.default['0']
    }

    if (id === '1') {
      return tabs.default['1']
    }

    if (tabs.folders.hasOwnProperty(id)) {
      return tabs.folders[id]
    }

    return null
  })
}
