import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { resendVerificationMailInput, signInInput, signUpInput, verifyEmailInput } from 'modules/authentication/interface/authentication.interface';
import type { InitialState } from '../types/auth.types';

const initialState: InitialState = {
  isAuthenticated: false,
};


const login = (state: InitialState, _action: PayloadAction<signInInput>) =>
  state;

const signup = (state: InitialState, _action: PayloadAction<signUpInput>) => 
  state;

const verifyEmail = (state:InitialState , _action:PayloadAction<verifyEmailInput>) => state

const resendVerificationMail = (state:InitialState , _action:PayloadAction<resendVerificationMailInput>) => state

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
    resendVerificationMail
  },
});

export default authSlice;
