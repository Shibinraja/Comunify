import { call, put, takeEvery } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {  CREATE_WORKSPACE, GET_WORKSPACE, LOGIN, RESEND_VERIFY_EMAIL,  SIGNUP, VERIFY_EMAIL } from '../actions/auth.actions';
import authSlice from '../slices/auth.slice';
import loaderSlice from '../slices/loader.slice';
import { SagaIterator } from 'redux-saga';
import history from '@/lib/history';
import { showErrorToast, showSuccessToast } from 'common/toast/toastFunctions';
import { setToken } from '@/lib/request';
import {createWorkspaceNameInput, resendVerificationMailInput,  signInInput, signInResponse, signUpInput, signUpResponse, verifyEmailInput, verifyEmailResponse } from 'modules/authentication/interface/authentication.interface';
import {  createWorkspaceService, getWorkspaceService, resendVerifyEmailService , signInService, signUpService, verifyEmailService } from 'modules/authentication/services/authentication.service';

const forwardTo = (location: string) => {
    history.push(location);
};

function* loginSaga(action: PayloadAction<signInInput>) {
    try {
        yield put(loaderSlice.actions.startLoadingAction(LOGIN));

        const res: signInResponse = yield call(signInService, action.payload);
        if (res?.data) {
            localStorage.setItem('accessToken', res?.data?.token);
            setToken(res?.data?.token);
            yield put(authSlice.actions.setIsAuthenticated(true));
        }
    } catch (e: any) {
        // toast.error(e as string, { theme: 'colored' });
        showErrorToast(e?.response?.data?.message);
    } finally {
        yield put(loaderSlice.actions.stopLoadingAction(LOGIN));
    }
}

function* signUp(action: PayloadAction<signUpInput>) {
    try {
        yield put(loaderSlice.actions.startLoadingAction(SIGNUP));
        const res: signUpResponse = yield call(signUpService, action.payload);

        if (res?.data) {
            showSuccessToast('Please, verify your email');
        }
    } catch (e: any) {
        // toast.error(e as string, { theme: 'colored' });
        showErrorToast(e?.response?.data?.message);
    } finally {
        yield put(loaderSlice.actions.stopLoadingAction(SIGNUP));
    }
}

function* verifyEmail(action: PayloadAction<verifyEmailInput>) {
    try {
        yield put(loaderSlice.actions.startLoadingAction(VERIFY_EMAIL));
        const res: verifyEmailResponse = yield call(verifyEmailService, action.payload);
        if (res?.data) {
            setToken(res?.data?.token);
            localStorage.setItem('accessToken', res?.data?.token);
            // yield put(authSlice.actions.setIsAuthenticated(true));
            yield call(forwardTo, '/welcome');
            showSuccessToast(res.message);
        }
    } catch (e: any) {
        // toast.error(e as string, { theme: 'colored' });
        showErrorToast(e?.response?.data?.message);
    } finally {
        yield put(loaderSlice.actions.stopLoadingAction(VERIFY_EMAIL));
    }
}

function* resendVerificationMail(action: PayloadAction<resendVerificationMailInput>) {
    try {
        yield put(loaderSlice.actions.startLoadingAction(RESEND_VERIFY_EMAIL));
        const res: verifyEmailResponse = yield call(resendVerifyEmailService, action.payload);
        if (res?.message) {
            showSuccessToast(res.message);
            // yield put(authSlice.actions.setIsAuthenticated(true));
        }
    } catch (e: any) {
        // toast.error(e as string, { theme: 'colored' });
        showErrorToast(e?.response?.data?.message);
    } finally {
        yield put(loaderSlice.actions.stopLoadingAction(RESEND_VERIFY_EMAIL));
    }
}

function* getWorkspace() {
  try {
    yield put(loaderSlice.actions.startLoadingAction(GET_WORKSPACE));
    const res: verifyEmailResponse = yield call(
      getWorkspaceService
    );
      yield put(authSlice.actions.getWorkspaceData(res?.data));

  } catch (e:any) {
    // toast.error(e as string, { theme: 'colored' });
    showErrorToast(e?.response?.data?.message)
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(GET_WORKSPACE));
  }
}

function* createWorkspace(action: PayloadAction<createWorkspaceNameInput>) {
  try {
    yield put(loaderSlice.actions.startLoadingAction(CREATE_WORKSPACE));
    const res: verifyEmailResponse = yield call(
      createWorkspaceService,
      action.payload
    );
    if (res?.message) {
      showSuccessToast(res.message)
      yield call(forwardTo, '/integration');
    }
  } catch (e:any) {
    // toast.error(e as string, { theme: 'colored' });
    showErrorToast(e?.response?.data?.message)
  } finally {
    yield put(loaderSlice.actions.stopLoadingAction(CREATE_WORKSPACE));
  }
}


export default function* authSaga(): SagaIterator {
  yield takeEvery(LOGIN, loginSaga);
  yield takeEvery(SIGNUP, signUp);
  yield takeEvery(VERIFY_EMAIL , verifyEmail)
  yield takeEvery(RESEND_VERIFY_EMAIL , resendVerificationMail)
  yield takeEvery(CREATE_WORKSPACE , createWorkspace)
  yield takeEvery(GET_WORKSPACE, getWorkspace)
}
