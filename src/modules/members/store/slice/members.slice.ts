import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MembersCountResponse } from 'modules/members/interface/members.interface';
import { InitialState } from '../types/members.type';

const countResponse = {
    count: 0,
    title: '',
    analyticMessage: '',
};
const initialState: InitialState = {
    membersTotalCountData: countResponse,
    membersNewCountData: countResponse,
    membersActiveCountData: countResponse,
    membersInActiveCountData: countResponse
};

//Saga Call
const membersTotalCount = (state: InitialState) => state;

const membersNewCount = (state: InitialState) => state;

const membersActiveCount = (state: InitialState) => state;

const membersInActiveCount = (state: InitialState) => state;

//Reducer Call

const getmembersTotalCountData = (state: InitialState, action: PayloadAction<MembersCountResponse>) => ({
    ...state,
    workspaceData: action.payload,
});

const getmembersNewCountData = (state: InitialState, action: PayloadAction<MembersCountResponse>) => ({
    ...state,
    workspaceData: action.payload,
});

const getmembersActiveCountData = (state: InitialState, action: PayloadAction<MembersCountResponse>) => ({
    ...state,
    workspaceData: action.payload,
});

const getmembersInActiveCountData = (state: InitialState, action: PayloadAction<MembersCountResponse>) => ({
    ...state,
    workspaceData: action.payload,
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
        getmembersInActiveCountData
    },
});

export default membersSlice;
