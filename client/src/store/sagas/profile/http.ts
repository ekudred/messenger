import { put, takeEvery, call, select } from 'redux-saga/effects'

import { ProfileAPI } from 'API/http/profile/request'
import { EditRequest, EditResponse } from 'API/http/profile/types'
import { AuthAPI } from 'API/http/auth/request'
import { ConfirmRequest, ConfirmResponse } from 'API/http/auth/types'
import { profileSliceActions } from 'store/reducers/profile'
import { authSliceActions } from 'store/reducers/auth'
import { ProfileActions } from 'store/actions/profile'
import { Action } from 'store/types/common'

interface EditOptions extends EditRequest {}
interface ConfirmOptions extends ConfirmRequest {}

// Workers

function* editWorker(action: Action<EditOptions>) {
  yield put(profileSliceActions.setAction({ field: 'edit', action: { status: 'loading' } }))

  try {
    const clientID: string = yield select(store => store.global.client.id)
    const accessToken: string = yield select(store => store.auth.info.accessToken)
    const response: EditResponse = yield call(ProfileAPI.edit, { clientID, accessToken }, action.payload)
    const { user } = response.data

    yield put(
      profileSliceActions.setUser({
        avatar: user.avatar,
        username: user.username,
        fullname: user.fullname,
        birthdate: user.birthdate,
      })
    )
    yield put(profileSliceActions.setEdit(false))
    yield put(
      profileSliceActions.setAction({
        field: 'edit',
        action: { status: 'succeeded', message: 'Profile edited successfully' },
      })
    )
    yield put(profileSliceActions.setAction({ field: 'edit', action: { status: 'done' } }))
    yield put(profileSliceActions.setAction({ field: 'edit', action: { status: 'idle' } }))
  } catch (error: any) {
    yield put(
      profileSliceActions.setAction({
        field: 'edit',
        action: { status: 'failed', message: error.response.data.message },
      })
    )
  }
}

function* confirmWorker(action: Action<ConfirmOptions>) {
  yield put(authSliceActions.setAction({ field: 'confirm', action: { status: 'loading' } }))

  try {
    const clientID: string = yield select(store => store.global.client.id)
    const accessToken: string = yield select(store => store.auth.info.accessToken)
    const response: ConfirmResponse = yield call(AuthAPI.confirm, { clientID, accessToken }, action.payload)
    const { data } = response

    yield put(authSliceActions.setConfirm(data.isConfirm))

    if (data.isConfirm) {
      yield put(profileSliceActions.setUser({ email: data.user.email, phone: data.user.phone }))
      yield put(profileSliceActions.setModal({ field: 'confirmModal', action: { visible: false } }))
      yield put(
        authSliceActions.setAction({
          field: 'confirm',
          action: { status: 'succeeded', message: 'Password confirmed' },
        })
      )
    } else {
      yield put(
        authSliceActions.setAction({
          field: 'confirm',
          action: { status: 'failed', message: 'Invalid password' },
        })
      )
    }
    yield put(authSliceActions.setAction({ field: 'confirm', action: { status: 'done' } }))
  } catch (error: any) {
    yield put(
      authSliceActions.setAction({
        field: 'confirm',
        action: { status: 'failed', message: error.response.data.message },
      })
    )
  }
}

// Watch

export function* watchProfileHTTP() {
  yield takeEvery(ProfileActions.EDIT, editWorker)
  yield takeEvery(ProfileActions.CONFIRM, confirmWorker)
}
