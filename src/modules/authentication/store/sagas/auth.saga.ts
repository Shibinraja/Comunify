import { call, put, takeEvery } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import type {
  signInInput,
  signInResponse,
} from '../../signIn/interface/signIn.interface';
import { LOGIN, RESEND_VERIFY_EMAIL, SIGNUP, VERIFY_EMAIL } from '../actions/auth.actions';
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
import { resendVerificationMailInput, verifyEmailInput, verifyEmailResponse } from 'modules/authentication/resendVerificationMail/interface/verify.interface';
import { _resendVerifyEmail, _verifyEmail } from 'modules/authentication/resendVerificationMail/services/verifyEmail.service';
import history from '@/lib/history';
import { showErrorToast, showSuccessToast } from 'common/toast/toastFunctions';
import { AxiosError } from 'axios';
import { setToken } from '@/lib/request';


const forwardTo = (location:string) => {
  history.push(location);
}

function* loginSaga(action: PayloadAction<signInInput>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(LOGIN));

    const res: signInResponse = yield call(_signIn, action.payload);
    if (res?.data) {
      localStorage.setItem('accessToken', res?.data?.token);
      setToken(res?.data?.token);
      yield put(authSlice.actions.setIsAuthenticated(true));
    }
  } catch (e:any) {
    // toast.error(e as string, { theme: 'colored' });
    showErrorToast(e?.response?.data?.message)
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(LOGIN));
  }
}

function* signUp(action: PayloadAction<signUpInput>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(SIGNUP));
    const res: signUpResponse = yield call(
      _signUp,
      action.payload
    );

    if (res?.data) {
      showSuccessToast('Please, verify your email')
    }
  } catch (e:any) {
    // toast.error(e as string, { theme: 'colored' });
    showErrorToast(e?.response?.data?.message)
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(SIGNUP));
  }
}

function* verifyEmail(action: PayloadAction<verifyEmailInput>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(SIGNUP));
    const res: verifyEmailResponse = yield call(
      _verifyEmail,
      action.payload
    );
    if (res?.data) {
      setToken(res?.data?.token);
      localStorage.setItem('accessToken', res?.data?.token);
      // yield put(authSlice.actions.setIsAuthenticated(true));
      yield call(forwardTo, '/welcome');
      showSuccessToast(res.message)
    }
  } catch (e:any) {
    // toast.error(e as string, { theme: 'colored' });
    showErrorToast(e?.response?.data?.message)
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(SIGNUP));
  }
}

function* resendVerificationMail(action: PayloadAction<resendVerificationMailInput>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(SIGNUP));
    const res: verifyEmailResponse = yield call(
      _resendVerifyEmail,
      action.payload
    );
    if (res?.message) {
      showSuccessToast(res.message)
      // yield put(authSlice.actions.setIsAuthenticated(true));
    }
  } catch (e:any) {
    // toast.error(e as string, { theme: 'colored' });
    showErrorToast(e?.response?.data?.message)
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(SIGNUP));
  }
}


export default function* authSaga(): SagaIterator {
  yield takeEvery(LOGIN, loginSaga);
  yield takeEvery(SIGNUP, signUp);
  yield takeEvery(VERIFY_EMAIL , verifyEmail)
  yield takeEvery(RESEND_VERIFY_EMAIL , resendVerificationMail)

}
