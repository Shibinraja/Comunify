import { call, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
// import history from '@/lib/history';
import { AxiosError, SuccessResponse } from '@/lib/api';
import { showErrorToast } from 'common/toast/toastFunctions';
import loaderSlice from 'modules/authentication/store/slices/loader.slice';
import membersSlice from '../slice/members.slice';
import { InactiveCountService, MembersListService, TotalCountService } from 'modules/members/services/members.services';
import { GetMembersListQueryParams, MembersCountResponse, MembersListResponse } from 'modules/members/interface/members.interface';
import { PayloadAction } from '@reduxjs/toolkit';

// const forwardTo = (location: string) => {
//     history.push(location);
// };

function* membersTotalCount() {
  try {
    yield put(loaderSlice.actions.startLoadingAction());

    const res: SuccessResponse<MembersCountResponse> = yield call(TotalCountService);
    if (res?.data) {
      yield put(membersSlice.actions.getmembersTotalCountData(res?.data));
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
      yield put(membersSlice.actions.getmembersNewCountData(res?.data));
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
      yield put(membersSlice.actions.getmembersActiveCountData(res?.data));
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
      yield put(membersSlice.actions.getmembersInActiveCountData(res?.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction());
  }
}

function* membersList(action: PayloadAction<Required<GetMembersListQueryParams>>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction());

    const res: SuccessResponse<MembersListResponse> = yield call(MembersListService, action.payload);
    if (res?.data) {
      yield put(membersSlice.actions.getmembersListData(res?.data));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction());
  }
}

export default function* membersSaga(): SagaIterator {
  yield takeEvery(membersSlice.actions.membersTotalCount.type, membersTotalCount);
  yield takeEvery(membersSlice.actions.membersNewCount.type, membersNewCount);
  yield takeEvery(membersSlice.actions.membersActiveCount.type, membersActiveCount);
  yield takeEvery(membersSlice.actions.membersInActiveCount.type, membersInActiveCount);
  yield takeEvery(membersSlice.actions.membersList.type, membersList);
}
