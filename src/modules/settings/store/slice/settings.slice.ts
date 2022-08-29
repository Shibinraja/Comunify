/* eslint-disable no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Action } from 'history';
import { VerifyMembers, workspaceId } from '../../../members/interface/members.interface';
import { ConnectedPlatforms, PlatformResponse } from '../../interface/settings.interface';
import { InitialState } from '../types/settings.types';

const initialState: InitialState = {
  PlatformFilterResponse: [],
  PlatformsConnected: []
};

const platformData = (state: InitialState, action: PayloadAction<workspaceId>) => state;

const getPlatformFilterData = (state: InitialState, action: PayloadAction<Array<PlatformResponse>>) => ({
  ...state,
  PlatformFilterResponse: action.payload
});

const connectedPlatforms = (state: InitialState, action: PayloadAction<workspaceId>) => state;

const getConnectedPlatformsData = (state: InitialState, action: PayloadAction<Array<ConnectedPlatforms>>) => ({
  ...state,
  PlatformsConnected: action.payload
});

const settingsSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    platformData,
    getPlatformFilterData,
    connectedPlatforms,
    getConnectedPlatformsData
  }
});

export default settingsSlice;
