/* eslint-disable @typescript-eslint/ban-types */
import { call, put, takeEvery } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import authSlice from '../slices/auth.slice';
import loaderSlice from '../slices/loader.slice';
import { SagaIterator } from 'redux-saga';
import history from '@/lib/history';
import { showErrorToast, showSuccessToast } from 'common/toast/toastFunctions';
import {
  CreateWorkspaceNameInput,
  ForgotPasswordInput,
  GetWorkspaceIdResponse,
  ResendVerificationMailInput,
  ResetPasswordInput,
  SignInInput,
  SignUpInput,
  SignUpResponse,
  SubscriptionPackages,
  TokenResponse,
  VerifyEmailInput,
  WorkspaceResponse
} from 'modules/authentication/interface/auth.interface';
import {
  createWorkspaceService,
  forgotPasswordService,
  getSubscriptionPackagesService,
  getWorkspaceService,
  resendVerifyEmailService,
  resetPasswordService,
  signInService,
  signUpService,
  verifyEmailService,
  verifyForgotEmailService,
  sendSubscriptionPlan,
  signOutService,
  GetWorkspaceIdService
} from 'modules/authentication/services/auth.service';
import { AxiosResponse } from 'axios';
import { AxiosError, SuccessResponse } from '@/lib/api';
import { getLocalRefreshToken } from '@/lib/request';

const forwardTo = (location: string) => {
  history.push(location);
};

function* loginSaga(action: PayloadAction<SignInInput>) {
  try {
    yield put(loaderSlice.actions.startAuthLoadingAction());

    const res: SuccessResponse<TokenResponse> = yield call(signInService, action.payload);
    if (res?.data) {
      localStorage.setItem('accessToken', res?.data?.token);
      yield put(authSlice.actions.setIsAuthenticated(true));
      yield call(getWorkspaceId);
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopAuthLoadingAction());
  }
}

function* signUp(action: PayloadAction<SignUpInput>) {
  try {
    yield put(loaderSlice.actions.startAuthLoadingAction());
    const res: SuccessResponse<SignUpResponse> = yield call(signUpService, action.payload);

    if (res?.data) {
      showSuccessToast('Please verify your email');
      yield put(authSlice.actions.signUpData(res?.data?.email));
      yield call(forwardTo, '/resend-mail');
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopAuthLoadingAction());
  }
}

function* verifyEmail(action: PayloadAction<VerifyEmailInput>) {
  try {
    yield put(loaderSlice.actions.startAuthLoadingAction());
    const res: SuccessResponse<TokenResponse> = yield call(verifyEmailService, action.payload);
    if (res?.data) {
      localStorage.setItem('accessToken', res?.data?.token);
      yield put(authSlice.actions.formikValueReset(true));
      showSuccessToast(res.message);
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    if (error?.response?.data?.message.toLocaleLowerCase().trim() === 'email already verified') {
      if(getLocalRefreshToken()) {
        yield call(logout);
      }
      yield call(forwardTo, '/');
      // yield put(authSlice.actions.formikValueReset(false));
    }
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopAuthLoadingAction());
  }
}

function* resendVerificationMail(action: PayloadAction<ResendVerificationMailInput>) {
  try {
    yield put(loaderSlice.actions.startAuthLoadingAction());
    const res: SuccessResponse<TokenResponse> = yield call(resendVerifyEmailService, action.payload);
    if (res?.message) {
      showSuccessToast(res.message);
      // yield put(authSlice.actions.setIsAuthenticated(true));
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopAuthLoadingAction());
  }
}

function* forgotPassword(action: PayloadAction<ForgotPasswordInput>) {
  try {
    yield put(loaderSlice.actions.startAuthLoadingAction());
    const res: SuccessResponse<{}> = yield call(forgotPasswordService, action.payload);
    if (!res?.error) {
      yield call(forwardTo, '/resend-mail');
      // yield put(authSlice.actions.formikValueReset(true));
      showSuccessToast('Password reset mail sent');
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopAuthLoadingAction());
  }
}

function* verifyForgotEmail(action: PayloadAction<VerifyEmailInput>) {
  try {
    yield put(loaderSlice.actions.startAuthLoadingAction());
    const res: SuccessResponse<TokenResponse> = yield call(verifyForgotEmailService, action.payload);
    if (res?.data) {
      // yield put(authSlice.actions.setIsAuthenticated(true));
      // showSuccessToast(res.message);
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopAuthLoadingAction());
  }
}

function* resetPassword(action: PayloadAction<ResetPasswordInput>) {
  try {
    yield put(loaderSlice.actions.startAuthLoadingAction());
    const res: SuccessResponse<{}> = yield call(resetPasswordService, action.payload);
    if (res?.message) {
      yield put(authSlice.actions.formikValueReset(true));
      showSuccessToast('Password updated');
      yield call(forwardTo, '/welcome');
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopAuthLoadingAction());
  }
}

function* getWorkspace() {
  try {
    yield put(loaderSlice.actions.startAuthLoadingAction());
    const res: SuccessResponse<WorkspaceResponse> = yield call(getWorkspaceService);
    yield put(authSlice.actions.getWorkspaceData(res?.data));
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopAuthLoadingAction());
  }
}

function* createWorkspace(action: PayloadAction<CreateWorkspaceNameInput>) {
  try {
    yield put(loaderSlice.actions.startAuthLoadingAction());
    const res: SuccessResponse<GetWorkspaceIdResponse> = yield call(createWorkspaceService, action.payload);
    if (res) {
      const workspaceId = res?.data?.id;
      localStorage.setItem('workspaceId', workspaceId);
      showSuccessToast('Workspace created successfully');
      yield call(forwardTo, '/integration');
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopAuthLoadingAction());
  }
}

function* logout() {
  try {
    yield put(loaderSlice.actions.startAuthLoadingAction());
    yield call(signOutService);
    window.localStorage.clear();
    yield call(forwardTo, '/');
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopAuthLoadingAction());
  }
}

function* getSubscriptions() {
  try {
    yield put(loaderSlice.actions.startAuthLoadingAction());
    const res: AxiosResponse = yield call(getSubscriptionPackagesService);
    yield put(authSlice.actions.setSubscriptions({ subscriptionData: res?.data }));
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopAuthLoadingAction());
  }
}

function* chooseSubscription(action: PayloadAction<string>) {
  try {
    yield put(loaderSlice.actions.startAuthLoadingAction());
    const res: SuccessResponse<SubscriptionPackages> = yield call(sendSubscriptionPlan, action.payload);
    if (res) {
      if (res.data.viewName.toLocaleLowerCase().trim() === 'free trial') {
        showSuccessToast('Free trial plan activated');
      } else {
        showSuccessToast('Comunify plus activated');
      }
      yield call(forwardTo, '/create-workspace');
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopAuthLoadingAction());
  }
}

function* getWorkspaceId() {
  try {
    yield put(loaderSlice.actions.startAuthLoadingAction());
    const res: SuccessResponse<Array<GetWorkspaceIdResponse>> = yield call(GetWorkspaceIdService);
    if (res) {
      const workspaceId = res?.data[0]?.id;
      localStorage.setItem('workspaceId', workspaceId);
    }
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    yield put(loaderSlice.actions.stopAuthLoadingAction());
  }
}

export default function* authSaga(): SagaIterator {
  yield takeEvery(authSlice.actions.login.type, loginSaga);
  yield takeEvery(authSlice.actions.signup.type, signUp);
  yield takeEvery(authSlice.actions.verifyEmail.type, verifyEmail);
  yield takeEvery(authSlice.actions.resendVerificationMail.type, resendVerificationMail);
  yield takeEvery(authSlice.actions.forgotPassword.type, forgotPassword);
  yield takeEvery(authSlice.actions.verifyForgotEmail.type, verifyForgotEmail);
  yield takeEvery(authSlice.actions.resetPassword.type, resetPassword);
  yield takeEvery(authSlice.actions.getSubscriptions.type, getSubscriptions);
  yield takeEvery(authSlice.actions.createWorkspace.type, createWorkspace);
  yield takeEvery(authSlice.actions.getWorkspace.type, getWorkspace);
  yield takeEvery(authSlice.actions.signOut.type, logout);
  yield takeEvery(authSlice.actions.chooseSubscription.type, chooseSubscription);
  yield takeEvery(authSlice.actions.getWorkspaceId.type, getWorkspaceId);
}
