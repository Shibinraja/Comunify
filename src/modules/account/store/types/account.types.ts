import { ChangePassword, profilePicInput, userProfileDataInput, userProfileUpdateInput } from '../../interfaces/account.interface';

export interface InitialState {
  changePasswordResponse: ChangePassword[];
  profilePictureUrl: profilePicInput;
  userProfileData: userProfileDataInput[];
  userProfileUpdateData: userProfileUpdateInput[];
  resetProfilePic: boolean
}
