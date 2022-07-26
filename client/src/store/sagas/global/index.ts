import { fork } from 'redux-saga/effects'

import { watchGlobalHTTP } from './http'

export function* watchGlobal() {
  yield fork(watchGlobalHTTP)
}