/* eslint-disable @typescript-eslint/ban-types */
import { GeneratorResponse } from '@/lib/api';
import { users_module } from '@/lib/config';
import { request } from '@/lib/request';

import { ChangePassword, profilePicInput, userProfileUpdateInput } from '../interfaces/account.interface';

export function* changePasswordService(body: ChangePassword): GeneratorResponse<{}> {
  const { data } = yield request.patch(`${users_module}/change-password`, body);
  return data;
}

export function* uploadProfilePicService(body: profilePicInput): GeneratorResponse<{}> {
  const { data } = yield request.patch(`${users_module}/profile-photo`, body);
  return data;
}

export const userProfileDataService = async (userId: string) => {
  const { data } = await request.get(`${users_module}/${userId}`);
  return data?.data;
};

export function* updateProfileDataService(body: userProfileUpdateInput): GeneratorResponse<{}> {
  const { data } = yield request.patch(`${users_module}`, body);
  return data;
}
