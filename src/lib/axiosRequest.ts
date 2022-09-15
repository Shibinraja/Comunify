import { showErrorToast } from 'common/toast/toastFunctions';
import { MergeMembersDataResponse } from 'modules/members/interface/members.interface';
import { AxiosError, ServerResponse } from './api';
import { request } from './request';
import { Dispatch, SetStateAction } from 'react';

export const getAxiosRequest = async(url: string, loading: Dispatch<SetStateAction<boolean>>) => {
  try {
    loading(true);
    const response: ServerResponse<MergeMembersDataResponse> = await request.get(url);

    const responseData = response?.data?.data;
    return responseData;
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    loading(false);
  }
};

export const postAxiosRequest = async(url: string, body: Record<string, unknown>) => {
  try {
    const response: ServerResponse<Record<string, never>> = await request.post(url, body);

    const responseData = response;
    return responseData;
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    //
  }
};
