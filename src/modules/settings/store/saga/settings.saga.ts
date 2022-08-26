/* eslint-disable no-unused-vars */
import { call, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import loaderSlice from '../../../authentication/store/slices/loader.slice';
import settingsSlice from '../slice/settings.slice';
import { AxiosError, SuccessResponse } from '../../../../lib/api';
import { PlatformResponse } from '../../interface/settings.interface';
import { showErrorToast } from '../../../../common/toast/toastFunctions';
import { PlatformsDataService } from '../../services/settings.services';

function* getPlatformsDataSaga() {
  try {
    yield put(loaderSlice.actions.startLoadingAction(settingsSlice.actions.platformData.type));
    const res: SuccessResponse<Array<PlatformResponse>> = yield call(PlatformsDataService);
    if (res?.data) {
      yield put(settingsSlice.actions.getPlatformFilterData(res?.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(settingsSlice.actions.platformData.type));
  }
}

export default function* settingsSaga(): SagaIterator {
  yield takeEvery(settingsSlice.actions.platformData.type, getPlatformsDataSaga);
}
