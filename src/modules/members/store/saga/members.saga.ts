import { call, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
// import history from '@/lib/history';
import { AxiosError, SuccessResponse } from '@/lib/api';
import { showErrorToast } from 'common/toast/toastFunctions';
import loaderSlice from 'modules/authentication/store/slices/loader.slice';
import membersSlice from '../slice/members.slice';
import {
  InactiveCountService,
  PlatformsDataService,
  MembersActivityGraphService,
  TotalCountService,
  GetMembersActivityGraphDataPerPlatformService
} from 'modules/members/services/members.services';
import {
  PlatformsData,
  MembersCountResponse,
  MembersProfileActivityGraphData,
  VerifyMembers,
  VerifyPlatform
} from 'modules/members/interface/members.interface';
import { PayloadAction } from '@reduxjs/toolkit';

// const forwardTo = (location: string) => {
//     history.push(location);
// };

function* membersTotalCount() {
  try {
    yield put(loaderSlice.actions.startLoadingAction());

    const res: SuccessResponse<MembersCountResponse> = yield call(TotalCountService);
    if (res?.data) {
      yield put(membersSlice.actions.getMembersTotalCountData(res?.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction());
  }
}

function* membersNewCount() {
  try {
    yield put(loaderSlice.actions.startLoadingAction());

    const res: SuccessResponse<MembersCountResponse> = yield call(TotalCountService);
    if (res?.data) {
      yield put(membersSlice.actions.getMembersNewCountData(res?.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction());
  }
}

function* membersActiveCount() {
  try {
    yield put(loaderSlice.actions.startLoadingAction());

    const res: SuccessResponse<MembersCountResponse> = yield call(TotalCountService);
    if (res?.data) {
      yield put(membersSlice.actions.getMembersActiveCountData(res?.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction());
  }
}

function* membersInActiveCount() {
  try {
    yield put(loaderSlice.actions.startLoadingAction());

    const res: SuccessResponse<MembersCountResponse> = yield call(InactiveCountService);
    if (res?.data) {
      yield put(membersSlice.actions.getMembersInActiveCountData(res?.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction());
  }
}

function* membersActivityGraphSaga(action: PayloadAction<VerifyMembers>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction());
    const res: SuccessResponse<MembersProfileActivityGraphData> = yield call(MembersActivityGraphService, action.payload.memberId);
    yield put(membersSlice.actions.setMembersActivityGraphData(res?.data));
  } catch (e) {
    const error = e as AxiosError<unknown>;
    if (error?.response?.data?.message) {
      showErrorToast('Failed to load graph data');
    }
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction());
  }
}

function* getPlatformsDataSaga() {
  try {
    yield put(loaderSlice.actions.startLoadingAction());
    const res: SuccessResponse<PlatformsData[]> = yield call(PlatformsDataService);
    yield put(membersSlice.actions.setPlatformsData({ platformsData: res?.data }));
  } catch (e) {
    const error = e as AxiosError<unknown>;
    throw error.response?.data?.message;
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction());
  }
}

function* getMembersActivityGraphDataPerPlatformSaga(action: PayloadAction<VerifyPlatform>) {
  try {
    const res: SuccessResponse<MembersProfileActivityGraphData> = yield call(GetMembersActivityGraphDataPerPlatformService, action.payload);
    yield put(membersSlice.actions.setMembersActivityGraphData(res?.data));
  } catch (e) {
    const error = e as AxiosError<unknown>;
    if (error?.response?.data?.message) {
      showErrorToast('Failed to load graph data');
    }
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction());
  }
}

export default function* membersSaga(): SagaIterator {
  yield takeEvery(membersSlice.actions.membersTotalCount.type, membersTotalCount);
  yield takeEvery(membersSlice.actions.membersNewCount.type, membersNewCount);
  yield takeEvery(membersSlice.actions.membersActiveCount.type, membersActiveCount);
  yield takeEvery(membersSlice.actions.membersInActiveCount.type, membersInActiveCount);
  yield takeEvery(membersSlice.actions.getMembersActivityGraphData.type, membersActivityGraphSaga);
  yield takeEvery(membersSlice.actions.platformData.type, getPlatformsDataSaga);
  yield takeEvery(membersSlice.actions.getMembersActivityGraphDataPerPlatform.type, getMembersActivityGraphDataPerPlatformSaga);
}
