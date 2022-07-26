import { fork } from 'redux-saga/effects'

import { watchChatSocket } from './chat/socket'
import { watchChatManagerSocket } from './chat-manager/socket'
import { watchFolderManagerSocket } from './folder-manager/socket'

// Watch

export function* watchMessenger() {
  yield fork(watchChatSocket)
  yield fork(watchChatManagerSocket)
  yield fork(watchFolderManagerSocket)
}