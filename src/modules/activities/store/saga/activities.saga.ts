/* eslint-disable no-unused-vars */
import { PayloadAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';
import { AxiosError, SuccessResponse } from '../../../../lib/api';
import loaderSlice from '../../../authentication/store/slices/loader.slice';
import { ActiveStreamResponse, GetActiveStreamListQueryParams } from '../../interfaces/activities.interface';
import { getActiveStreamDataService } from '../../services/activities.services';
import activitiesSlice from '../slice/activities.slice';

function* getActiveStreamDataSaga(action: PayloadAction<GetActiveStreamListQueryParams>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(activitiesSlice.actions.getActiveStreamData.type));
    const res: SuccessResponse<ActiveStreamResponse> = yield call(getActiveStreamDataService, action.payload);
    yield put(activitiesSlice.actions.setActiveStreamData(res?.data));
  } catch (e) {
    const error = e as AxiosError<unknown>;
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(activitiesSlice.actions.getActiveStreamData.type));
  }
}

export default function* activitiesSaga(): SagaIterator {
  yield takeEvery(activitiesSlice.actions.getActiveStreamData.type, getActiveStreamDataSaga);
}
