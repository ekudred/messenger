import { put, takeEvery, call, select } from 'redux-saga/effects'
import { push } from '@lagunovsky/redux-react-router'

import { authSliceActions } from 'store/reducers/auth'
import { profileSliceActions } from 'store/reducers/profile'
import { chatSliceActions } from 'store/reducers/messenger/chat'
import { managerSliceActions } from 'store/reducers/messenger/manager'
import { navbarSliceActions } from 'store/reducers/navbar'
import { AuthAPI } from 'API/http/auth/request'
import { SignInRequest, SignInResponse, SignUpRequest, SignUpResponse, RefreshResponse } from 'API/http/auth/types'
import { AuthActions } from 'store/actions/auth'
import { Action } from 'store/types/common'
import { Paths } from 'utils/paths'

interface SignUpOptions extends SignUpRequest {}

interface SignInOptions extends SignInRequest {}

// Workers

function* signUpWorker(action: Action<SignUpOptions>) {
  yield put(
    authSliceActions.setAction({
      field: 'signUp',
      action: { status: 'loading' },
    })
  )

  try {
    const clientID: string = yield select(store => store.global.client.id)
    const response: SignUpResponse = yield call(AuthAPI.signUp, { clientID }, action.payload)

    yield put(
      authSliceActions.setAction({
        field: 'signUp',
        action: { status: 'succeeded', message: response.data.message },
      })
    )
    yield put(
      authSliceActions.setAction({
        field: 'signUp',
        action: { status: 'done' },
      })
    )
  } catch (error: any) {
    yield put(
      authSliceActions.setAction({
        field: 'signUp',
        action: { status: 'failed', message: error.response.data.message },
      })
    )
    yield put(
      authSliceActions.setAction({
        field: 'signUp',
        action: { status: 'idle' },
      })
    )
  }
}

function* signInWorker(action: Action<SignInOptions>) {
  yield put(
    authSliceActions.setAction({
      field: 'signIn',
      action: { status: 'loading' },
    })
  )

  try {
    const clientID: string = yield select(store => store.global.client.id)
    const { data }: SignInResponse = yield call(AuthAPI.signIn, { clientID }, action.payload)

    localStorage.setItem('accessToken', data.accessToken)
    yield put(
      authSliceActions.setInfo({
        userID: data.user.id,
        role: data.user.role,
        accessToken: data.accessToken,
        updatedAt: data.user.updatedAt,
        createdAt: data.user.createdAt,
      })
    )
    yield put(authSliceActions.setAuth(true))
    yield put(
      profileSliceActions.setUser({
        username: data.user.username,
        fullname: data.user.fullname,
        birthdate: data.user.birthdate,
        avatar: data.user.avatar,
      })
    )
    yield put(
      authSliceActions.setAction({
        field: 'signIn',
        action: { status: 'succeeded' },
      })
    )
    yield put(push(Paths.MESSENGER))
    yield put(
      authSliceActions.setAction({
        field: 'signIn',
        action: { status: 'done' },
      })
    )
  } catch (error: any) {
    yield put(
      authSliceActions.setAction({
        field: 'signIn',
        action: { status: 'failed', message: error.response.data.message },
      })
    )
  }
}

function* signOutWorker() {
  yield put(
    authSliceActions.setAction({
      field: 'signOut',
      action: { status: 'loading' },
    })
  )

  try {
    const clientID: string = yield select(store => store.global.client.id)
    const accessToken: string = yield select(store => store.auth.info.accessToken)
    const response: Promise<any> = yield call(AuthAPI.signOut, {
      clientID,
      accessToken,
    })

    localStorage.removeItem('accessToken')
    yield put(authSliceActions.clear())
    yield put(profileSliceActions.clear())
    yield put(chatSliceActions.clear())
    yield put(managerSliceActions.clear())
    yield put(navbarSliceActions.clear())

    yield put(
      authSliceActions.setAction({
        field: 'signOut',
        action: { status: 'succeeded' },
      })
    )
    yield put(push(Paths.SIGN_IN))
    yield put(
      authSliceActions.setAction({
        field: 'signOut',
        action: { status: 'done' },
      })
    )
  } catch (error: any) {
    yield put(
      authSliceActions.setAction({
        field: 'signOut',
        action: { status: 'failed', message: error.response.data.message },
      })
    )
  }
}

function* refreshWorker() {
  yield put(
    authSliceActions.setAction({
      field: 'refresh',
      action: { status: 'loading' },
    })
  )

  try {
    const clientID: string = yield select(store => store.global.client.id)
    const { data }: RefreshResponse = yield call(AuthAPI.refresh, { clientID })

    localStorage.setItem('accessToken', data.accessToken)
    yield put(
      authSliceActions.setInfo({
        userID: data.user.id,
        role: data.user.role as any,
        accessToken: data.accessToken,
        updatedAt: data.user.updatedAt,
        createdAt: data.user.createdAt,
      })
    )
    yield put(authSliceActions.setAuth(true))
    yield put(
      profileSliceActions.setUser({
        username: data.user.username,
        fullname: data.user.fullname,
        birthdate: data.user.birthdate,
        avatar: data.user.avatar,
      })
    )
    yield put(
      authSliceActions.setAction({
        field: 'refresh',
        action: { status: 'succeeded' },
      })
    )
    yield put(
      authSliceActions.setAction({
        field: 'refresh',
        action: { status: 'done' },
      })
    )
  } catch (error: any) {
    yield put(
      authSliceActions.setAction({
        field: 'refresh',
        action: { status: 'failed', message: error.response.data.message },
      })
    )
  }
}

// Watch

export function* watchAuthHTTP() {
  yield takeEvery(AuthActions.SIGN_UP, signUpWorker)
  yield takeEvery(AuthActions.SIGN_IN, signInWorker)
  yield takeEvery(AuthActions.SIGN_OUT, signOutWorker)
  yield takeEvery(AuthActions.REFRESH, refreshWorker)
}
