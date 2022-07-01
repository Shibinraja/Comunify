import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { InitialState } from '../types/auth.types';
import type { signInInput } from '../../signIn/interface/signIn.interface';
import { signUpInput } from 'modules/authentication/signUp/interface/signup.interface';

const initialState: InitialState = {
  isAuthenticated: true,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const login = (state: InitialState, _action: PayloadAction<signInInput>) =>
  state;

const signUp = (state: InitialState, action: PayloadAction<signUpInput>) =>
  state;

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
    signUp,
  },
});

export default authSlice;
