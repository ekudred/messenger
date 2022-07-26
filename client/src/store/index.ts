import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from '@redux-saga/core'
import { createBrowserHistory } from 'history'
import { createRouterMiddleware } from '@lagunovsky/redux-react-router'

import createRootReducer from './reducers'
import rootSaga from './sagas'

const saga = createSagaMiddleware()

export const history = createBrowserHistory()
const router = createRouterMiddleware(history)

const store = configureStore({
  reducer: createRootReducer(history),
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    thunk: false,
    serializableCheck: false,
  }).concat([saga, router]),
})

saga.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
