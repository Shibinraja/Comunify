import type { VoidGenerator } from '../types/auth.types';
import { call, put, takeEvery } from 'redux-saga/effects';
import type { PutEffect, CallEffect } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { login } from '../../signIn/services/signIn.service';
import type { signInInput } from '../../signIn/interface/signIn.interface';
import { LOGIN } from '../actions/auth.actions';
import authSlice from '../slices/auth.slice';
import loaderSlice from '../slices/loader.slice';

function* loginSaga(
  action: PayloadAction<signInInput>,
): VoidGenerator<PutEffect | CallEffect, Promise<boolean>> {
  try {
    yield put(loaderSlice.actions.startLoadingAction(LOGIN));
    yield call(login, action.payload);
    yield put(authSlice.actions.setIsAuthenticated(true));
  } catch (e) {
    console.log(e);
    toast.error(e as string, { theme: 'colored' });
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(LOGIN));
  }
}

export default function* authSaga() {
  yield takeEvery(LOGIN, loginSaga);
}
