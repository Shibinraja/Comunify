/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  MembersProfileActivityGraphData,
  PlatformsData,
  VerifyMembers,
  VerifyPlatform,
  GetMembersListQueryParams,
  MembersListResponse,
  MembersCountResponse
} from 'modules/members/interface/members.interface';
import { ColumnNameProps } from 'common/draggableCard/draggableCardTypes';
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

export const membersListResponse = {
  data: [
    {
      id: '',
      name: '',
      userName: '',
      comunifyUserId: '',
      lastActivity: '2022-06-15T00:00:00.000Z',
      email: '',
      organization: '',
      profileUrl: '',
      workspaceId: '',
      createdAt: '',
      updatedAt: '',
      platformName: '',
      tags: [
        {
          tag: {
            name: ''
          }
        }
      ],
      platforms: [
        {
          platform: {
            name: ''
          }
        }
      ]
    }
  ],
  totalPages: 0,
  previousPage: 0,
  nextPage: 0
};

export const customizedColumnProps = [
  {
    name: '',
    id: '',
    isDisplayed: true,
    isDraggable: 'card'
  }
];

const initialState: InitialState = {
  membersTotalCountData: countResponse,
  membersNewCountData: countResponse,
  membersActiveCountData: countResponse,
  membersInActiveCountData: countResponse,
  membersProfileActivityGraphData: membersGraphResponse,
  platformsData: [],
  membersListData: membersListResponse,
  customizedColumn: customizedColumnProps
};

//Saga Call

const membersTotalCount = (state: InitialState) => state;

const membersNewCount = (state: InitialState) => state;

const membersActiveCount = (state: InitialState) => state;

const membersInActiveCount = (state: InitialState) => state;

const platformData = (state: InitialState) => state;

const membersList = (state: InitialState, action: PayloadAction<GetMembersListQueryParams>) => state;

//Reducer Call

const getMembersTotalCountData = (state: InitialState, action: PayloadAction<MembersCountResponse>) => ({
  ...state,
  membersTotalCountData: action.payload
});

const getMembersNewCountData = (state: InitialState, action: PayloadAction<MembersCountResponse>) => ({
  ...state,
  membersNewCountData: action.payload
});

const getMembersActiveCountData = (state: InitialState, action: PayloadAction<MembersCountResponse>) => ({
  ...state,
  membersActiveCountData: action.payload
});

const getMembersInActiveCountData = (state: InitialState, action: PayloadAction<MembersCountResponse>) => ({
  ...state,
  membersInActiveCountData: action.payload
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

const getMembersListData = (state: InitialState, action: PayloadAction<MembersListResponse>) => ({
  ...state,
  membersListData: action.payload
});

const customizedColumnData = (state: InitialState, action: PayloadAction<Array<ColumnNameProps>>) => ({
  ...state,
  customizedColumn: action.payload
});

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
    getMembersActivityGraphDataPerPlatform,
    membersList,
    getMembersListData,
    customizedColumnData
  }
});

export default membersSlice;
