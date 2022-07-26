import { all } from 'redux-saga/effects'

import { watchGlobal } from './global'
import { watchAuth } from './auth'
import { watchMessenger } from './messenger'
import { watchProfile } from './profile'

function* rootSaga() {
  yield all([
    watchGlobal(),
    watchAuth(),
    watchMessenger(),
    watchProfile(),
  ])
}

export default rootSaga
