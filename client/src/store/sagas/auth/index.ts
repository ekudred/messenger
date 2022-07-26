import { fork } from 'redux-saga/effects'

import { watchAuthHTTP } from './http'

export function* watchAuth() {
  yield fork(watchAuthHTTP)
}
