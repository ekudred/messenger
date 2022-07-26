import { combineReducers } from '@reduxjs/toolkit'

import chatReducer from './chat'
import managerReducer from './manager'

const messengerReducer = combineReducers({
  chat: chatReducer,
  manager: managerReducer,
})

export default messengerReducer