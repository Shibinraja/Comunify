/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChangePassword, profilePicInput, userProfileDataInput, userProfileUpdateInput } from '../../interfaces/account.interface';
import { InitialState } from '../types/account.types';

const initialState: InitialState = {
  changePasswordResponse: [],
  profilePictureUrl: {
    profilePic: '',
    fileName: ''
  },
  userProfileData: [],
  userProfileUpdateData: []
};
const changePassword = (state: InitialState, action: PayloadAction<ChangePassword>) => state;
const uploadProfilePic = (state: InitialState, action: PayloadAction<profilePicInput>) => state;
const userProfileData = (state: InitialState, action: PayloadAction<userProfileDataInput>) => state;
const userProfileUpdateData = (state: InitialState, action: PayloadAction<userProfileUpdateInput>) => state;

const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    changePassword,
    uploadProfilePic,
    userProfileData,
    userProfileUpdateData
  }
});

export default accountSlice;
