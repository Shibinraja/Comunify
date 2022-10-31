/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-unused-vars */
import { SuccessResponse } from '@/lib/api';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { showSuccessToast, showErrorToast } from 'common/toast/toastFunctions';
import { ChangePassword, profilePicInput, userProfileDataInput, userProfileUpdateInput } from 'modules/account/interfaces/account.interface';
import {
  changePasswordService,
  updateProfileDataService,
  uploadProfilePicService,
  userProfileDataService
} from 'modules/account/services/account.services';
import loaderSlice from 'modules/authentication/store/slices/loader.slice';
import { SagaIterator } from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';
import accountSlice from '../slice/account.slice';

function* changePassword(action: PayloadAction<ChangePassword>) {
  try {
    yield put(loaderSlice.actions.startAuthLoadingAction());
    const res: SuccessResponse<{}> = yield call(changePasswordService, action.payload);
    if (res?.message) {
      showSuccessToast('Password updated successfully');
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
  } finally {
    yield put(loaderSlice.actions.stopAuthLoadingAction());
  }
}

function* uploadProfilePic(action: PayloadAction<profilePicInput>) {
  try {
    yield put(loaderSlice.actions.startAuthLoadingAction());
    const res: SuccessResponse<{}> = yield call(uploadProfilePicService, action.payload);
    if (res?.message) {
      showSuccessToast('Profile picture uploaded successfully');
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.statusText as string);
  } finally {
    yield put(loaderSlice.actions.stopAuthLoadingAction());
  }
}

function* userProfileUpdateData(action: PayloadAction<userProfileUpdateInput>) {
  try {
    yield put(loaderSlice.actions.startAuthLoadingAction());
    const res: SuccessResponse<{}> = yield call(updateProfileDataService, action.payload);
    if (res?.message) {
      showSuccessToast('Profile Data updated successfully');
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
  } finally {
    yield put(loaderSlice.actions.stopAuthLoadingAction());
  }
}

export default function* accountSaga(): SagaIterator {
  yield takeEvery(accountSlice.actions.changePassword.type, changePassword);
  yield takeEvery(accountSlice.actions.uploadProfilePic.type, uploadProfilePic);
  yield takeEvery(accountSlice.actions.userProfileUpdateData.type, userProfileUpdateData);
}
