import { combineReducers } from '@reduxjs/toolkit'
import { History } from 'history'
import { createRouterReducer } from '@lagunovsky/redux-react-router'

import globalReducer from './global'
import authReducer from './auth'
import messengerReducer from './messenger'
import profileReducer from './profile'
import navbarReducer from './navbar'

const createRootReducer = (history: History) => {
  return combineReducers({
    router: createRouterReducer(history),
    global: globalReducer,
    auth: authReducer,
    messenger: messengerReducer,
    profile: profileReducer,
    navbar: navbarReducer
  })
}

export default createRootReducer
