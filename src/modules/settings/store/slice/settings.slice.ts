/* eslint-disable no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlatformResponse } from '../../interface/settings.interface';
import { InitialState } from '../types/settings.types';

const initialState: InitialState = {
  PlatformFilterResponse: []
};

const platformData = (state: InitialState) => state;

const getPlatformFilterData = (state: InitialState, action: PayloadAction<Array<PlatformResponse>>) => ({
  ...state,
  PlatformFilterResponse: action.payload
});

const settingsSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    platformData,
    getPlatformFilterData
  }
});

export default settingsSlice;
