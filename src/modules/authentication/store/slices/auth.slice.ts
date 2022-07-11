import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createWorkspaceNameInput, forgotPasswordInput, resendVerificationMailInput, resetPasswordInput, signInInput, signUpInput, verifyEmailInput } from 'modules/authentication/interface/authentication.interface';
import type { InitialState } from '../types/auth.types';

const initialState: InitialState = {
  isAuthenticated: false,
  workspaceData:[],
  clearFormikValue:false
};


const login = (state: InitialState, _action: PayloadAction<signInInput>) =>
  state;

const signup = (state: InitialState, _action: PayloadAction<signUpInput>) => 
  state;

const verifyEmail = (state:InitialState , _action:PayloadAction<verifyEmailInput>) => state;

const resendVerificationMail = (state:InitialState , _action:PayloadAction<resendVerificationMailInput>) => state;

const forgotPassword = (state:InitialState , _action:PayloadAction<forgotPasswordInput>) => state;

const verifyForgotEmail = (state:InitialState , _action:PayloadAction<verifyEmailInput>) => state;

const resetPassword = (state:InitialState , _action:PayloadAction<resetPasswordInput>) => state;

const createWorkspace = (state:InitialState , _action:PayloadAction<createWorkspaceNameInput>) => state;

const getWorkspace = (state: InitialState ) => state;


// Data Props returned from saga_module

const formikValueReset = (state:InitialState , _action:PayloadAction<boolean>) => ({
  ...state,
  clearFormikValue:_action.payload
})
const getWorkspaceData = (state: InitialState , _action:PayloadAction<any>) => ({
  ...state,
  workspaceData: _action.payload
});


const setIsAuthenticated = (
  state: InitialState,
  action: PayloadAction<InitialState['isAuthenticated']>
) => ({
  ...state,
  isAuthenticated: action.payload,
});

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
    formikValueReset 
   },
});

export default authSlice;
