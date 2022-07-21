import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InitialState } from '../types/members.type';


const initialState: InitialState = {
  membersCountData:[],
  activeCountData:[],
  membersActiveData:[]
};

//Saga Call
const membersTotalCount = (state: InitialState) => state;

const membersNewCount = (state:InitialState) => state;

const membersActiveCount = (state:InitialState) => state;


//Reducer Call



const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    membersTotalCount,
    membersNewCount,
    membersActiveCount
  },
});

export default membersSlice;
