/* eslint-disable no-unused-vars */
import { call, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import activitiesSlice from '../slice/activities.slice';
import { ActiveStreamTagFilterService, getActiveStreamDataService } from '../../services/activities.services';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  ActiveStreamResponse,
  ActiveStreamTagResponse,
  GetActiveStreamListQueryParams,
  GetActiveStreamTagListQueryParams
} from '../../interfaces/activities.interface';
import { AxiosError, SuccessResponse } from '../../../../lib/api';
import loaderSlice from '../../../authentication/store/slices/loader.slice';
import { showErrorToast } from 'common/toast/toastFunctions';

function* getActiveStreamDataSaga(action: PayloadAction<GetActiveStreamListQueryParams>) {
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

function* activeStreamTagFilter(action: PayloadAction<Partial<GetActiveStreamTagListQueryParams>>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction());

    const res: SuccessResponse<Array<ActiveStreamTagResponse>> = yield call(ActiveStreamTagFilterService, action.payload);
    if (res?.data) {
      yield put(activitiesSlice.actions.getActiveStreamTagFilterData(res.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction());
  }
}

export default function* activitiesSaga(): SagaIterator {
  yield takeEvery(activitiesSlice.actions.getActiveStreamData.type, getActiveStreamDataSaga);
  yield takeEvery(activitiesSlice.actions.activeStreamTagFilter.type, activeStreamTagFilter);
}
