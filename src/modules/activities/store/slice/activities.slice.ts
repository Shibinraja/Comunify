/* eslint-disable no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActiveStreamResponse, VerifyWorkSpace } from '../../interfaces/activities.interface';
import { InitialState } from '../types/activities.types';

const activeStreamDataInitialValue = {
  data: [],
  totalPages: 0,
  previousPage: null,
  nextPage: null
};

const initialState: InitialState = {
  activeStreamData: activeStreamDataInitialValue
};

const getActiveStreamData = (state: InitialState, action: PayloadAction<VerifyWorkSpace>) => state;

const setActiveStreamData = (state: InitialState, action: PayloadAction<ActiveStreamResponse>) => {
  state.activeStreamData = action.payload;
};

const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    getActiveStreamData,
    setActiveStreamData
  }
});

export default activitiesSlice;
