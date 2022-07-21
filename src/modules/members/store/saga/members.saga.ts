import { call, put, takeEvery } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import history from '@/lib/history';
import {  AxiosError, SuccessResponse } from '@/lib/api';
import { showErrorToast, showSuccessToast } from 'common/toast/toastFunctions';
import loaderSlice from 'modules/authentication/store/slices/loader.slice';
import membersSlice from '../slice/members.slice';
import { TotalCountService } from 'modules/members/services/members.services';
import { MembersCountResponse } from 'modules/members/interface/members.interface';

const forwardTo = (location: string) => {
    history.push(location);
};

function* membersTotalCount() {
    try {
        yield put(loaderSlice.actions.startLoadingAction(membersSlice.actions.membersTotalCount.type));

        const res: SuccessResponse<MembersCountResponse> = yield call(TotalCountService);
        if (res?.data) {
            
        }
    } catch (e) {
        const error = e as AxiosError<unknown>;
        showErrorToast(error?.response?.data?.message);
    } finally {
        yield put(loaderSlice.actions.stopLoadingAction(membersSlice.actions.membersTotalCount.type));
    }
};

function* membersNewCount() {
    try {
        yield put(loaderSlice.actions.startLoadingAction(membersSlice.actions.membersNewCount.type));

        const res: SuccessResponse<MembersCountResponse> = yield call(TotalCountService);
        if (res?.data) {
            
        }
    } catch (e) {
        const error = e as AxiosError<unknown>;
        showErrorToast(error?.response?.data?.message);
    } finally {
        yield put(loaderSlice.actions.stopLoadingAction(membersSlice.actions.membersNewCount.type));
    }
}

function* membersActiveCount() {
    try {
        yield put(loaderSlice.actions.startLoadingAction(membersSlice.actions.membersActiveCount.type));

        const res: SuccessResponse<MembersCountResponse> = yield call(TotalCountService);
        if (res?.data) {
            
        }
    } catch (e) {
        const error = e as AxiosError<unknown>;
        showErrorToast(error?.response?.data?.message);
    } finally {
        yield put(loaderSlice.actions.stopLoadingAction(membersSlice.actions.membersActiveCount.type));
    }
}

export default function* membersSaga(): SagaIterator {
    yield takeEvery(membersSlice.actions.membersTotalCount.type, membersTotalCount);
    yield takeEvery(membersSlice.actions.membersNewCount.type, membersNewCount);
    yield takeEvery(membersSlice.actions.membersActiveCount.type, membersActiveCount);
}
