import { put, takeEvery, call } from 'redux-saga/effects'
import { GetResult } from '@fingerprintjs/fingerprintjs'

import { GlobalAPI } from 'API/http/global/request'
import { GlobalActions } from 'store/actions/global'
import { globalSliceActions } from 'store/reducers/global'

// Workers

function* getResultFPWorker() {
  yield put(globalSliceActions.setAction({ field: 'getResultFP', action: { status: 'loading' } }))

  try {
    const result: GetResult = yield call(GlobalAPI.getResultFP)

    yield localStorage.setItem('clientID', result.visitorId)
    yield put(globalSliceActions.setClient({ id: result.visitorId, timezone: result.components.timezone.value! }))

    yield put(globalSliceActions.setAction({ field: 'getResultFP', action: { status: 'done' } }))
  } catch (error: any) {
    yield put(globalSliceActions.setAction({
      field: 'getResultFP', action: { status: 'failed', message: error.response.data.message }
    }))
  }
}

// Watch

export function* watchGlobalHTTP() {
  yield takeEvery(GlobalActions.GET_RESULT_FP, getResultFPWorker)
}