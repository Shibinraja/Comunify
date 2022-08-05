/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  MembersCountResponse,
  MembersProfileActivityGraphData,
  PlatformsData,
  VerifyMembers,
  VerifyPlatform
} from 'modules/members/interface/members.interface';
import { InitialState } from '../types/members.type';

const countResponse = {
  count: 0,
  title: '',
  analyticMessage: ''
};

const membersGraphResponse = {
  series: [
    {
      name: '',
      data: []
    }
  ],
  xAxis: []
};

const initialState: InitialState = {
  membersTotalCountData: countResponse,
  membersNewCountData: countResponse,
  membersActiveCountData: countResponse,
  membersInActiveCountData: countResponse,
  membersProfileActivityGraphData: membersGraphResponse,
  platformsData: []
};

//Saga Call
const membersTotalCount = (state: InitialState) => state;

const membersNewCount = (state: InitialState) => state;

const membersActiveCount = (state: InitialState) => state;

const membersInActiveCount = (state: InitialState) => state;

const platformData = (state: InitialState) => state;

//Reducer Call

const getMembersTotalCountData = (state: InitialState, action: PayloadAction<MembersCountResponse>) => ({
  ...state,
  workspaceData: action.payload
});

const getMembersNewCountData = (state: InitialState, action: PayloadAction<MembersCountResponse>) => ({
  ...state,
  workspaceData: action.payload
});

const getMembersActiveCountData = (state: InitialState, action: PayloadAction<MembersCountResponse>) => ({
  ...state,
  workspaceData: action.payload
});

const getMembersInActiveCountData = (state: InitialState, action: PayloadAction<MembersCountResponse>) => ({
  ...state,
  workspaceData: action.payload
});

const getMembersActivityGraphData = (state: InitialState, action: PayloadAction<VerifyMembers>) => state;

const setMembersActivityGraphData = (state: InitialState, action: PayloadAction<MembersProfileActivityGraphData>) => {
  state.membersProfileActivityGraphData = action.payload;
};

const setPlatformsData = (state: InitialState, action: PayloadAction<{ platformsData: PlatformsData[] }>) => {
  //   state.platformsData = state.platformsData.map((data: PlatformsData) => (data = action.payload));
  state.platformsData = action.payload.platformsData;
};

const getMembersActivityGraphDataPerPlatform = (state: InitialState, action: PayloadAction<VerifyPlatform>) => state;

const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    membersTotalCount,
    membersNewCount,
    membersActiveCount,
    membersInActiveCount,
    getMembersActivityGraphData,
    getMembersTotalCountData,
    getMembersNewCountData,
    getMembersActiveCountData,
    getMembersInActiveCountData,
    setMembersActivityGraphData,
    platformData,
    setPlatformsData,
    getMembersActivityGraphDataPerPlatform
  }
});

export default membersSlice;
