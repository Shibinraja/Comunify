/* eslint-disable no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActiveStreamResponse, ActiveStreamTagResponse, GetActiveStreamListQueryParams, GetActiveStreamTagListQueryParams, workspaceId } from '../../interfaces/activities.interface';
import { InitialState } from '../types/activities.types';

const activeStreamDataInitialValue = {
  data: [],
  totalPages: 0,
  previousPage: 0,
  nextPage: 0
};

export const activeStreamTagFilterResponse = [];

const initialState: InitialState = {
  activeStreamData: activeStreamDataInitialValue,
  activeStreamTagFilterResponse
};

// Saga Call
const getActiveStreamData = (state: InitialState, action: PayloadAction<GetActiveStreamListQueryParams>) => state;

const activeStreamTagFilter = (state: InitialState, action: PayloadAction<GetActiveStreamTagListQueryParams>) => state;

// Reducer Call
const setActiveStreamData = (state: InitialState, action: PayloadAction<ActiveStreamResponse>) => {
  state.activeStreamData = action.payload;
};

const getActiveStreamTagFilterData = (state: InitialState, action: PayloadAction<Array<ActiveStreamTagResponse>>) => ({
  ...state,
  activeStreamTagFilterResponse: action.payload
});

const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    getActiveStreamData,
    setActiveStreamData,
    activeStreamTagFilter,
    getActiveStreamTagFilterData
  }
});

export default activitiesSlice;
