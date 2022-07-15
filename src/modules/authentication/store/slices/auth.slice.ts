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
    authorizedToken: ""
};

const login = (state: InitialState, action: PayloadAction<SignInInput>) => state;

const loginData = (state:InitialState , action:PayloadAction<string>) => ({
    ...state,
    authorizedToken:action.payload
});

const signup = (state: InitialState, action: PayloadAction<SignUpInput>) => state;

const verifyEmail = (state: InitialState, action: PayloadAction<VerifyEmailInput>) => state;

const resendVerificationMail = (state: InitialState, action: PayloadAction<ResendVerificationMailInput>) => state;

const forgotPassword = (state: InitialState, action: PayloadAction<ForgotPasswordInput>) => state;

const verifyForgotEmail = (state: InitialState, action: PayloadAction<VerifyEmailInput>) => state;

const resetPassword = (state: InitialState, action: PayloadAction<ResetPasswordInput>) => state;

const createWorkspace = (state: InitialState, action: PayloadAction<CreateWorkspaceNameInput>) => state;

const getWorkspace = (state: InitialState) => state;

// Data Props returned from saga_module

const formikValueReset = (state: InitialState, action: PayloadAction<boolean>) => ({
    ...state,
    clearFormikValue: action.payload,
});
const getWorkspaceData = (state: InitialState, action: PayloadAction<any>) => ({
    ...state,
    workspaceData: action.payload,
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

const freeTrialSubscription = (state: InitialState, action:PayloadAction<string>) => state

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login,
        loginData,
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
        freeTrialSubscription,
    },
});

export default authSlice;
