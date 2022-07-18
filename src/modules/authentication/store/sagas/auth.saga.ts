import { call, put, takeEvery } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
    CREATE_WORKSPACE,
    FORGOT_PASSWORD,
    GET_WORKSPACE,
    LOGIN,
    RESEND_VERIFY_EMAIL,
    RESET_PASSWORD,
    SIGNUP,
    VERIFY_EMAIL,
    VERIFY_FORGOT_EMAIL,
} from '../actions/auth.actions';
import authSlice from '../slices/auth.slice';
import loaderSlice from '../slices/loader.slice';
import { SagaIterator } from 'redux-saga';
import history from '@/lib/history';
import { showErrorToast, showSuccessToast } from 'common/toast/toastFunctions';
import {CreateWorkspaceNameInput, ForgotPasswordInput, ResendVerificationMailInput,  ResetPasswordInput,  SignInInput, SignUpInput, SignUpResponse, SubscriptionPackages, TokenResponse, VerifyEmailInput, WorkspaceResponse } from 'modules/authentication/interface/authentication.interface';
import {  createWorkspaceService, forgotPasswordService, getSubscriptionPackagesService, getWorkspaceService, resendVerifyEmailService , resetPasswordService, signInService, signUpService, verifyEmailService, verifyForgotEmailService, sendSubscriptionPlan } from 'modules/authentication/services/authentication.service';
import { AxiosError } from '../types/auth.types';
import { AxiosResponse } from 'axios';
import {  SuccessResponse } from '@/lib/api';
import cookie from 'react-cookies';

const forwardTo = (location: string) => {
    history.push(location);
};

function* loginSaga(action: PayloadAction<SignInInput>) {
    try {
        yield put(loaderSlice.actions.startLoadingAction(LOGIN));

        const res: SuccessResponse<TokenResponse> = yield call(signInService, action.payload);
        if (res?.data) {
            localStorage.setItem('accessToken' , res?.data?.token)
            yield put(authSlice.actions.setIsAuthenticated(true));
            // yield put(authSlice.actions.loginData(res?.data?.token));
        }
    } catch (e) {
        const error = e as AxiosError<unknown>;
        showErrorToast(error?.response?.data?.message);
    } finally {
        yield put(loaderSlice.actions.stopLoadingAction(LOGIN));
    }
}

function* signUp(action: PayloadAction<SignUpInput>) {
    try {
        yield put(loaderSlice.actions.startLoadingAction(SIGNUP));
        const res: SuccessResponse<SignUpResponse> = yield call(signUpService, action.payload);

        if (res?.data) {
            showSuccessToast('Please, verify your email');
            yield call(forwardTo, '/resend-mail');
        }
    } catch (e) {
        const error = e as AxiosError<unknown>;
        showErrorToast(error?.response?.data?.message);
    } finally {
        yield put(loaderSlice.actions.stopLoadingAction(SIGNUP));
    }
}

function* verifyEmail(action: PayloadAction<VerifyEmailInput>) {
    try {
        yield put(loaderSlice.actions.startLoadingAction(VERIFY_EMAIL));
        const res: SuccessResponse<TokenResponse> = yield call(verifyEmailService, action.payload);
        if (res?.data) {
            localStorage.setItem('accessToken', res?.data?.token);
            yield put(authSlice.actions.formikValueReset(true));
            // yield call(forwardTo, '/welcome');
            showSuccessToast(res.message);
        }
    } catch (e) {
        const error = e as AxiosError<unknown>;
        showErrorToast(error?.response?.data?.message);
    } finally {
        yield put(loaderSlice.actions.stopLoadingAction(VERIFY_EMAIL));
    }
}

function* resendVerificationMail(action: PayloadAction<ResendVerificationMailInput>) {
    try {
        yield put(loaderSlice.actions.startLoadingAction(RESEND_VERIFY_EMAIL));
        const res: SuccessResponse<TokenResponse> = yield call(resendVerifyEmailService, action.payload);
        if (res?.message) {
            showSuccessToast(res.message);
            // yield put(authSlice.actions.setIsAuthenticated(true));
        }
    } catch (e) {
        const error = e as AxiosError<unknown>;
        showErrorToast(error?.response?.data?.message);
    } finally {
        yield put(loaderSlice.actions.stopLoadingAction(RESEND_VERIFY_EMAIL));
    }
}

function* forgotPassword(action: PayloadAction<ForgotPasswordInput>) {
    try {
        yield put(loaderSlice.actions.startLoadingAction(FORGOT_PASSWORD));
        const res: SuccessResponse<{}> = yield call(forgotPasswordService, action.payload);
        if (res?.message) {
            yield put(authSlice.actions.formikValueReset(true));
            showSuccessToast(res.message);
        }
    } catch (e) {
        const error = e as AxiosError<unknown>;
        showErrorToast(error?.response?.data?.message);
    } finally {
        yield put(loaderSlice.actions.stopLoadingAction(FORGOT_PASSWORD));
    }
}

function* verifyForgotEmail(action: PayloadAction<VerifyEmailInput>) {
    try {
        yield put(loaderSlice.actions.startLoadingAction(VERIFY_FORGOT_EMAIL));
        const res: SuccessResponse<TokenResponse> = yield call(verifyForgotEmailService, action.payload);
        if (res?.data) {
            // yield put(authSlice.actions.setIsAuthenticated(true));
            showSuccessToast(res.message);
        }
    } catch (e) {
        const error = e as AxiosError<unknown>;
        showErrorToast(error?.response?.data?.message);
    } finally {
        yield put(loaderSlice.actions.stopLoadingAction(VERIFY_FORGOT_EMAIL));
    }
}

function* resetPassword(action: PayloadAction<ResetPasswordInput>) {
    try {
        yield put(loaderSlice.actions.startLoadingAction(RESET_PASSWORD));
        const res: SuccessResponse<{}> = yield call(resetPasswordService, action.payload);
        if (res?.message) {
            yield put(authSlice.actions.formikValueReset(true));
            showSuccessToast(res.message);
            yield call(forwardTo, '/welcome');
        }
    } catch (e) {
        const error = e as AxiosError<unknown>;
        showErrorToast(error?.response?.data?.message);
    } finally {
        yield put(loaderSlice.actions.stopLoadingAction(RESET_PASSWORD));
    }
}

function* getWorkspace() {
    try {
        yield put(loaderSlice.actions.startLoadingAction(GET_WORKSPACE));
        const res: SuccessResponse<WorkspaceResponse> = yield call(getWorkspaceService);
        yield put(authSlice.actions.getWorkspaceData(res?.data));
    } catch (e) {
        const error = e as AxiosError<unknown>;
        showErrorToast(error?.response?.data?.message);
    } finally {
        yield put(loaderSlice.actions.stopLoadingAction(GET_WORKSPACE));
    }
}

function* createWorkspace(action: PayloadAction<CreateWorkspaceNameInput>) {
    try {
        yield put(loaderSlice.actions.startLoadingAction(CREATE_WORKSPACE));
        const res: SuccessResponse<WorkspaceResponse> = yield call(createWorkspaceService, action.payload);
        if (res?.message) {
            showSuccessToast(res.message);
            yield call(forwardTo, '/integration');
        }
    } catch (e) {
        const error = e as AxiosError<unknown>;
        showErrorToast(error?.response?.data?.message);
    } finally {
        yield put(loaderSlice.actions.stopLoadingAction(CREATE_WORKSPACE));
    }
}

function* logout(): Generator<void> {
    try {
        window.localStorage.clear();
        cookie.remove("x-auth-cookie")
        location.reload();
    } catch {}
}

function* getSubscriptions() {
    try {
        yield put(loaderSlice.actions.startLoadingAction(authSlice.actions.getSubscriptions.type));
        const res: AxiosResponse = yield call(getSubscriptionPackagesService);
        yield put(authSlice.actions.setSubscriptions({ subscriptionData: res?.data }));
    } catch (e) {
        const error = e as AxiosError<unknown>;
        showErrorToast(error?.response?.data?.message);
    } finally {
        yield put(loaderSlice.actions.stopLoadingAction(authSlice.actions.getSubscriptions.type));
    }
}

function* freeTrialSubscription(action: PayloadAction<string>) {
    try {
        yield put(loaderSlice.actions.startLoadingAction(authSlice.actions.getSubscriptions.type));
        const res: SuccessResponse<SubscriptionPackages> = yield call(sendSubscriptionPlan, action.payload);
        if (res?.message) {
            showSuccessToast(res.message);
            yield call(forwardTo, '/create-workspace');
        }
    } catch (e){
        const error = e as AxiosError<unknown>;
        showErrorToast(error?.response?.data?.message);
    } finally {
        yield put(loaderSlice.actions.stopLoadingAction(authSlice.actions.getSubscriptions.type));
    }
}

export default function* authSaga(): SagaIterator {
    yield takeEvery(LOGIN, loginSaga);
    yield takeEvery(SIGNUP, signUp);
    yield takeEvery(VERIFY_EMAIL, verifyEmail);
    yield takeEvery(RESEND_VERIFY_EMAIL, resendVerificationMail);
    yield takeEvery(FORGOT_PASSWORD, forgotPassword);
    yield takeEvery(VERIFY_FORGOT_EMAIL, verifyForgotEmail);
    yield takeEvery(RESET_PASSWORD, resetPassword);
    yield takeEvery(authSlice.actions.getSubscriptions.type, getSubscriptions);
    yield takeEvery(CREATE_WORKSPACE, createWorkspace);
    yield takeEvery(GET_WORKSPACE, getWorkspace);
    yield takeEvery(authSlice.actions.signOut.type, logout);
    yield takeEvery(authSlice.actions.freeTrialSubscription.type, freeTrialSubscription);
}
