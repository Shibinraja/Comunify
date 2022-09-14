/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { workspaceId } from '../../../members/interface/members.interface';
import {
  assignTagProps,
  AssignTagsProps,
  AssignTagsTypeEnum,
  ConnectedPlatforms,
  createTagProps,
  GetTagListQueryParams,
  PlatformResponse,
  TagResponse,
  TagType,
  unAssignTagProps,
  updateTagProps
} from '../../interface/settings.interface';
import { InitialState } from '../types/settings.types';

const initialState: InitialState = {
  PlatformFilterResponse: [],
  PlatformsConnected: [],
  TagFilterResponse: {
    data: [
      {
        id: '',
        name: '',
        viewName: '',
        createdAt: new Date(),
        createdBy: '',
        type: TagType.Default,
        totalCount: 0

      }
    ],
    totalPages: 0,
    previousPage: 0,
    nextPage: 0
  },
  clearValue: false,
  assignTagResponse: {
    id: '',
    name: '',
    viewName: '',
    workspaceId: '',
    createdBy: '',
    updatedBy: '',
    type: AssignTagsTypeEnum.Custom,
    createdAt: '',
    updatedAt: ''
  }
};

//Saga Call
const platformData = (state: InitialState, action: PayloadAction<workspaceId>) => state;
const tagFilterData = (state: InitialState, action: PayloadAction<Partial<GetTagListQueryParams>>) => state;
const createTags = (state: InitialState, action: PayloadAction<createTagProps>) => state;
const updateTags = (state: InitialState, action: PayloadAction<updateTagProps>) => state;
const deleteTags = (state: InitialState, action: PayloadAction<Omit<updateTagProps, 'tagBody'>>) => state;
const assignTags = (state: InitialState, action: PayloadAction<assignTagProps>) => state;
const unAssignTags = (state: InitialState, action: PayloadAction<unAssignTagProps>) => state;

//Reducer Call

//Reducer Call
const getPlatformFilterData = (state: InitialState, action: PayloadAction<Array<PlatformResponse>>) => ({
  ...state,
  PlatformFilterResponse: action.payload
});

const connectedPlatforms = (state: InitialState, action: PayloadAction<workspaceId>) => state;

const getConnectedPlatformsData = (state: InitialState, action: PayloadAction<Array<ConnectedPlatforms>>) => ({
  ...state,
  PlatformsConnected: action.payload
});

const getTagFilterData = (state: InitialState, action: PayloadAction<TagResponse>) => ({
  ...state,
  TagFilterResponse: action.payload
});

const resetValue = (state: InitialState, action: PayloadAction<boolean>) => ({
  ...state,
  clearValue: action.payload
});

const getAssignTagsData = (state: InitialState, action: PayloadAction<AssignTagsProps>) => ({
  ...state,
  assignTagResponse: action.payload
});

const settingsSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    resetValue,
    platformData,
    tagFilterData,
    getPlatformFilterData,
    getTagFilterData,
    createTags,
    updateTags,
    deleteTags,
    assignTags,
    unAssignTags,
    connectedPlatforms,
    getConnectedPlatformsData,
    getAssignTagsData
  }
});

export default settingsSlice;
