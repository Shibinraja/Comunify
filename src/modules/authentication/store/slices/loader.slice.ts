import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InitialState } from '../types/loader.type';

const initialState: InitialState = {
  loadingState: false,
  loadingActions: []
};

const startAuthLoadingAction = (state: InitialState) => {
  state.loadingState = true;
};

const stopAuthLoadingAction = (state: InitialState) => {
  state.loadingState = false;
};

const startLoadingAction = (state: InitialState, action: PayloadAction<string>) => ({
  ...state,
  loadingActions: [...state.loadingActions, action.payload]
});

const stopLoadingAction = (state: InitialState, action: PayloadAction<string>) => ({
  ...state,
  loadingActions: state.loadingActions.filter((item) => item !== action.payload)
});

const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    startAuthLoadingAction,
    stopAuthLoadingAction,
    startLoadingAction,
    stopLoadingAction
  }
});

export default loaderSlice;
