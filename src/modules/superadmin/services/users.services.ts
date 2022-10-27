import { AxiosError, ServerResponse } from '@/lib/api';
import { transformRequestOptions } from '@/lib/helper';
import { request } from '@/lib/request';
import { showErrorToast } from 'common/toast/toastFunctions';
import { SearchSuggestionArgsType } from 'common/topBar/TopBarTypes';
import { Dispatch, SetStateAction } from 'react';
import { GetUsersListQueryParams, UserPlatformResponse, UsersAnalyticsData, UsersMemberListResponse } from '../interface/users.interface';

//axios request
// eslint-disable-next-line space-before-function-paren
export const getUsersListService = async (query: GetUsersListQueryParams, loading?: Dispatch<SetStateAction<boolean>>) => {
  try {
    loading?.(true);
    const response: ServerResponse<UsersMemberListResponse> = await request.get(`/v1/super-admin/users`, {
      params: query,
      paramsSerializer: (params) => transformRequestOptions(params)
    });

    const responseData = response?.data?.data;
    return responseData;
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    loading?.(false);
  }
};

export const getPlatformsData = async(args:Partial<SearchSuggestionArgsType>):Promise<UserPlatformResponse> => {
  try {
    // loading?.(true);
    const searchParams = ({
      ...(args.cursor ? { cursor: args.cursor }: {}),
      ...(args.search ? { search: args.search }: {})
    });
    const response: ServerResponse<UserPlatformResponse> = await request.get(`/v1/super-admin/platform-list`, { params: searchParams });

    const responseData = response?.data?.data;
    return responseData;
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
    return {} as UserPlatformResponse;
  } finally {
    // loading?.(false);
  }
};

export const getUsersAnalytics = async(loading?: Dispatch<SetStateAction<boolean>>) => {
  try {
    loading?.(true);
    const response: ServerResponse<Array<UsersAnalyticsData>> = await request.get(`/v1/super-admin/users/analytics`);

    const responseData = response?.data?.data;
    return responseData;
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    loading?.(false);
  }
};
