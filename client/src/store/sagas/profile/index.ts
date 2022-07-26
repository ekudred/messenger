import { fork } from 'redux-saga/effects'

import { watchProfileHTTP } from './http'

export function* watchProfile() {
  yield fork(watchProfileHTTP)
}
