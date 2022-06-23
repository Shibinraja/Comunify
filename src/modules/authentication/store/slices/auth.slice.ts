import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { InitialState } from '../types/auth.types';
import type { signInInput } from '../../signIn/interface/signIn.interface';

const initialState: InitialState = {
  isAuthenticated: true,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const login = (state: InitialState, _action: PayloadAction<signInInput>) =>
  state;

const setIsAuthenticated = (
  state: InitialState,
  action: PayloadAction<InitialState['isAuthenticated']>,
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
  },
});

export default authSlice;
