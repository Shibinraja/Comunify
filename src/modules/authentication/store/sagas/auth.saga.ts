import type { VoidGenerator } from '../types/auth.types';
import { call, put, takeEvery } from 'redux-saga/effects';
import type { PutEffect, CallEffect } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import type {
  signInInput,
  signInResponse,
} from '../../signIn/interface/signIn.interface';
import { LOGIN, SIGNUP } from '../actions/auth.actions';
import authSlice from '../slices/auth.slice';
import loaderSlice from '../slices/loader.slice';
import { SagaIterator } from 'redux-saga';
import {
  signUpInput,
  signUpResponse,
} from 'modules/authentication/signUp/interface/signup.interface';
import { SuccessResponse } from '@/lib/api';
import { _signUp } from 'modules/authentication/signUp/services/signUp.service';
import { _signIn } from 'modules/authentication/signIn/services/signIn.service';

function* loginSaga(action: PayloadAction<signInInput>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(LOGIN));
    const res: signInResponse = yield call(_signIn, action.payload);
    if (res?.data) {
      localStorage.setItem('accessToken', res?.data?.token);
      yield put(authSlice.actions.setIsAuthenticated(true));
    }
  } catch (e) {
    toast.error(e as string, { theme: 'colored' });
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(LOGIN));
  }
}

function* signUp(action: PayloadAction<signUpInput>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(SIGNUP));
    const res: SuccessResponse<signUpResponse> = yield call(
      _signUp,
      action.payload
    );
    yield put(authSlice.actions.setIsAuthenticated(true));
  } catch (e) {
    toast.error(e as string, { theme: 'colored' });
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(SIGNUP));
  }
}

export default function* authSaga(): SagaIterator {
  yield takeEvery(LOGIN, loginSaga);
  yield takeEvery(SIGNUP, signUp);
}
