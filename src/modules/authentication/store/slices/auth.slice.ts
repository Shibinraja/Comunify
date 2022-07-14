import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    CreateWorkspaceNameInput,
    ForgotPasswordInput,
    ResendVerificationMailInput,
    ResetPasswordInput,
    SignInInput,
    SignUpInput,
    SubscriptionPackages,
    VerifyEmailInput,
} from 'modules/authentication/interface/authentication.interface';
import type { InitialState } from '../types/auth.types';

const initialState: InitialState = {
    isAuthenticated: false,
    subscriptionData: [],
    workspaceData: [],
    clearFormikValue: false,
};

const login = (state: InitialState, _action: PayloadAction<SignInInput>) => state;

const signup = (state: InitialState, _action: PayloadAction<SignUpInput>) => state;

const verifyEmail = (state: InitialState, _action: PayloadAction<VerifyEmailInput>) => state;

const resendVerificationMail = (state: InitialState, _action: PayloadAction<ResendVerificationMailInput>) => state;

const forgotPassword = (state: InitialState, _action: PayloadAction<ForgotPasswordInput>) => state;

const verifyForgotEmail = (state: InitialState, _action: PayloadAction<VerifyEmailInput>) => state;

const resetPassword = (state: InitialState, _action: PayloadAction<ResetPasswordInput>) => state;

const createWorkspace = (state: InitialState, _action: PayloadAction<CreateWorkspaceNameInput>) => state;

const getWorkspace = (state: InitialState) => state;

// Data Props returned from saga_module

const formikValueReset = (state: InitialState, _action: PayloadAction<boolean>) => ({
    ...state,
    clearFormikValue: _action.payload,
});
const getWorkspaceData = (state: InitialState, _action: PayloadAction<any>) => ({
    ...state,
    workspaceData: _action.payload,
});

const setIsAuthenticated = (state: InitialState, action: PayloadAction<InitialState['isAuthenticated']>) => ({
    ...state,
    isAuthenticated: action.payload,
});

const signOut = (state: InitialState) => {
    state.isAuthenticated = false;
};

const getSubscriptions = (state: InitialState) => state;

const setSubscriptions = (state: InitialState, action: PayloadAction<{ subscriptionData: SubscriptionPackages[] }>) => {
    state.subscriptionData = action.payload.subscriptionData;
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login,
        setIsAuthenticated,
        signup,
        verifyEmail,
        resendVerificationMail,
        forgotPassword,
        verifyForgotEmail,
        resetPassword,
        createWorkspace,
        getWorkspace,
        getWorkspaceData,
        formikValueReset,
        signOut,
        getSubscriptions,
        setSubscriptions,
    },
});

export default authSlice;
