/* eslint-disable no-unused-vars */
import { call, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import loaderSlice from '../../../authentication/store/slices/loader.slice';
import settingsSlice from '../slice/settings.slice';
import { AxiosError, SuccessResponse } from '../../../../lib/api';
import { ConnectedPlatforms, PlatformResponse } from '../../interface/settings.interface';
import { ConnectedPlatformsDataService, PlatformsDataService } from '../../services/settings.services';
import { PayloadAction } from '@reduxjs/toolkit';
import { workspaceId } from '../../../members/interface/members.interface';

function* getPlatformsDataSaga() {
  try {
    yield put(loaderSlice.actions.startLoadingAction(settingsSlice.actions.platformData.type));
    const res: SuccessResponse<Array<PlatformResponse>> = yield call(PlatformsDataService);
    if (res?.data) {
      yield put(settingsSlice.actions.getPlatformFilterData(res?.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(settingsSlice.actions.platformData.type));
  }
}

function* getConnectedPlatformsSaga(action: PayloadAction<workspaceId>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(settingsSlice.actions.connectedPlatforms.type));
    const res: SuccessResponse<Array<ConnectedPlatforms>> = yield call(ConnectedPlatformsDataService, action.payload.workspaceId);
    if (res?.data) {
      yield put(settingsSlice.actions.getConnectedPlatformsData(res?.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(settingsSlice.actions.connectedPlatforms.type));
  }
}

export default function* settingsSaga(): SagaIterator {
  yield takeEvery(settingsSlice.actions.platformData.type, getPlatformsDataSaga);
  yield takeEvery(settingsSlice.actions.connectedPlatforms.type, getConnectedPlatformsSaga);
}
