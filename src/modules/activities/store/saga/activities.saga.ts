/* eslint-disable no-unused-vars */
import { call, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import activitiesSlice from '../slice/activities.slice';
import { getActiveStreamDataService } from '../../services/activities.services';
import { PayloadAction } from '@reduxjs/toolkit';
import { ActiveStreamResponse, VerifyWorkSpace } from '../../interfaces/activities.interface';
import { AxiosError, SuccessResponse } from '../../../../lib/api';
import loaderSlice from '../../../authentication/store/slices/loader.slice';

function* getActiveStreamDataSaga(action: PayloadAction<VerifyWorkSpace>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction());
    const res: SuccessResponse<ActiveStreamResponse> = yield call(getActiveStreamDataService, action.payload);
    yield put(activitiesSlice.actions.setActiveStreamData(res?.data));
  } catch (e) {
    const error = e as AxiosError<unknown>;
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction());
  }
}

export default function* activitiesSaga(): SagaIterator {
  yield takeEvery(activitiesSlice.actions.getActiveStreamData.type, getActiveStreamDataSaga);
}
