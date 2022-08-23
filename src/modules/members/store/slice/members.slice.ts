/* eslint-disable no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  MembersProfileActivityGraphData,
  VerifyMembers,
  VerifyPlatform,
  MembersListResponse,
  MembersColumnsParams,
  workspaceId,
  GetMembersLocationListQueryParams,
  GetMembersOrganizationListQueryParams,
  GetMembersTagListQueryParams,
  MembersTagResponse,
  ActivityDataResponse,
  ActivityInfiniteScroll,
  MemberProfileCard,
  GetMembersListQueryParams,
  PlatformResponse,
  MemberCountAnalyticsResponse
} from 'modules/members/interface/members.interface';
import { ColumnNameProps } from 'common/draggableCard/draggableCardTypes';
import { InitialState } from '../types/members.type';

const countResponse = {
  count: 0,
  title: '',
  analyticMessage: ''
};

const CountAnalytics = {
  totalMembers: countResponse,
  newMembers: countResponse
};

const ActivityAnalytics = {
  activeMembers: countResponse,
  inActiveMembers: countResponse
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

export const PlatformFilterResponse = [];

export const membersLocationFilterResponse = [];

export const membersOrganizationFilterResponse = [];

export const membersTagFilterResponse = [];

const membersActivityInitialValue = {
  result: [],
  nextCursor: null
};

const initialState: InitialState = {
  membersCountAnalyticsData: CountAnalytics,
  membersActivityAnalyticsData: ActivityAnalytics,
  membersProfileActivityGraphData: membersGraphResponse,
  membersListData: membersListResponse,
  customizedColumn: customizedColumnProps,
  PlatformFilterResponse,
  membersLocationFilterResponse,
  membersOrganizationFilterResponse,
  membersTagFilterResponse,
  membersListExportData: [],
  membersActivityData: membersActivityInitialValue,
  memberProfileCardData: []
};

//Saga Call

const membersCountAnalytics = (state: InitialState, action:PayloadAction<workspaceId>) => state;

const membersActivityAnalytics = (state: InitialState, action:PayloadAction<workspaceId>) => state;

const platformData = (state: InitialState) => state;

const membersList = (state: InitialState, action: PayloadAction<GetMembersListQueryParams>) => state;

const membersTagFilter = (state: InitialState, action: PayloadAction<Partial<GetMembersTagListQueryParams>>) => state;

const membersLocationFilter = (state: InitialState, action: PayloadAction<Partial<GetMembersLocationListQueryParams>>) => state;

const membersOrganizationFilter = (state: InitialState, action: PayloadAction<Partial<GetMembersOrganizationListQueryParams>>) => state;

const membersColumnsList = (state: InitialState, action: PayloadAction<Omit<MembersColumnsParams, 'columnData'>>) => state;

const membersColumnsUpdateList = (state: InitialState, action: PayloadAction<MembersColumnsParams>) => state;

const membersListExport = (state: InitialState, action: PayloadAction<workspaceId>) => state;

//Reducer Call

const getMembersCountAnalytics = (state: InitialState, action: PayloadAction<MemberCountAnalyticsResponse>) => ({
  ...state,
  membersCountAnalyticsData: action.payload
});

const getMembersActivityAnalytics = (state: InitialState, action: PayloadAction<any>) => ({
  ...state,
  membersActivityAnalyticsData: action.payload
});

const getMembersActivityGraphData = (state: InitialState, action: PayloadAction<VerifyMembers>) => state;

const setMembersActivityGraphData = (state: InitialState, action: PayloadAction<MembersProfileActivityGraphData>) => {
  state.membersProfileActivityGraphData = action.payload;
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

const getPlatformFilterData = (state: InitialState, action: PayloadAction<Array<PlatformResponse>>) => ({
  ...state,
  PlatformFilterResponse: action.payload
});

const getmembersTagFilterData = (state: InitialState, action: PayloadAction<Array<MembersTagResponse>>) => ({
  ...state,
  membersTagFilterResponse: action.payload
});

const getmembersLocationFilterData = (state: InitialState, action: PayloadAction<Array<{ location: string }>>) => ({
  ...state,
  membersLocationFilterResponse: action.payload
});

const getmembersOrganizationFilterData = (state: InitialState, action: PayloadAction<Array<{ organization: string }>>) => ({
  ...state,
  membersOrganizationFilterResponse: action.payload
});

const getmembersListExport = (state: InitialState, action: PayloadAction<Array<Buffer>>) => ({
  ...state,
  membersListExportData: action.payload
});

const getMembersActivityDataInfiniteScroll = (state: InitialState, action: PayloadAction<ActivityInfiniteScroll>) => state;

const setMembersActivityData = (state: InitialState, action: PayloadAction<ActivityDataResponse>) => ({
  ...state,
  membersActivityData: { nextCursor: action.payload.nextCursor, result: [...state.membersActivityData.result, ...action.payload.result] }
});

const getMemberProfileCardData = (state: InitialState, action: PayloadAction<VerifyMembers>) => state;

const setMemberProfileCardData = (state: InitialState, action: PayloadAction<MemberProfileCard[]>) => {
  state.memberProfileCardData = action.payload;
};

const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    membersCountAnalytics,
    membersActivityAnalytics,
    getMembersCountAnalytics,
    getMembersActivityAnalytics,
    membersList,
    getMembersListData,
    customizedColumnData,
    setMembersActivityData,
    getMembersActivityGraphData,
    setMembersActivityGraphData,
    getMembersActivityGraphDataPerPlatform,
    platformData,
    membersTagFilter,
    membersLocationFilter,
    membersOrganizationFilter,
    getmembersTagFilterData,
    getmembersLocationFilterData,
    getmembersOrganizationFilterData,
    membersColumnsList,
    membersColumnsUpdateList,
    membersListExport,
    getMembersActivityDataInfiniteScroll,
    getMemberProfileCardData,
    setMemberProfileCardData,
    getPlatformFilterData,
    getmembersListExport
  }
});

export default membersSlice;
