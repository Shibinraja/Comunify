/* eslint-disable no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ColumnNameProps } from 'common/draggableCard/draggableCardTypes';
import { GetMembersListQueryParams, MembersCountResponse, MembersListResponse } from 'modules/members/interface/members.interface';
import { InitialState } from '../types/members.type';

const countResponse = {
  count: 0,
  title: '',
  analyticMessage: ''
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
  membersListData: membersListResponse,
  customizedColumn: customizedColumnProps
};

//Saga Call

const membersTotalCount = (state: InitialState) => state;

const membersNewCount = (state: InitialState) => state;

const membersActiveCount = (state: InitialState) => state;

const membersInActiveCount = (state: InitialState) => state;

const membersList = (state: InitialState, action: PayloadAction<GetMembersListQueryParams>) => state;

//Reducer Call

const getmembersTotalCountData = (state: InitialState, action: PayloadAction<MembersCountResponse>) => ({
  ...state,
  membersTotalCountData: action.payload
});

const getmembersNewCountData = (state: InitialState, action: PayloadAction<MembersCountResponse>) => ({
  ...state,
  membersNewCountData: action.payload
});

const getmembersActiveCountData = (state: InitialState, action: PayloadAction<MembersCountResponse>) => ({
  ...state,
  membersActiveCountData: action.payload
});

const getmembersInActiveCountData = (state: InitialState, action: PayloadAction<MembersCountResponse>) => ({
  ...state,
  membersInActiveCountData: action.payload
});

const getmembersListData = (state: InitialState, action: PayloadAction<MembersListResponse>) => ({
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
    getmembersTotalCountData,
    getmembersNewCountData,
    getmembersActiveCountData,
    getmembersInActiveCountData,
    membersList,
    getmembersListData,
    customizedColumnData
  }
});

export default membersSlice;
