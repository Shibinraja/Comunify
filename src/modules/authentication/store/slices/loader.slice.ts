import { createSlice } from '@reduxjs/toolkit';
import { InitialState } from '../types/loader.type';

const initialState: InitialState = {
  loadingState: false
};

const startLoadingAction = (
  state: InitialState
) => { state.loadingState = true;};

const stopLoadingAction = (
  state: InitialState
) => { state.loadingState = false;};

const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    startLoadingAction,
    stopLoadingAction
  }
});

export default loaderSlice;
