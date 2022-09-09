/* eslint-disable no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActiveStreamResponse, GetActiveStreamListQueryParams } from '../../interfaces/activities.interface';
import { InitialState } from '../types/activities.types';

const activeStreamDataInitialValue = {
  data: [],
  totalPages: 0,
  previousPage: 0,
  nextPage: 0
};

export const activeStreamTagFilterResponse = [];

const initialState: InitialState = {
  activeStreamData: activeStreamDataInitialValue
};

// Saga Call
const getActiveStreamData = (state: InitialState, action: PayloadAction<GetActiveStreamListQueryParams>) => state;

// Reducer Call
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
