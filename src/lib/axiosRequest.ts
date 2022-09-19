/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import { showErrorToast, showSuccessToast } from 'common/toast/toastFunctions';
import { MergeMembersDataResponse } from 'modules/members/interface/members.interface';
import { AxiosError, ServerResponse } from './api';
import { request } from './request';
import { Dispatch, SetStateAction } from 'react';

export const getAxiosRequest = async(url: string, loading?: Dispatch<SetStateAction<boolean>>) => {
  try {
    // loading(true);
    const response: ServerResponse<MergeMembersDataResponse> = await request.get(url);

    const responseData = response?.data?.data;
    // showSuccessToast(response.data.message);
    return responseData;
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    // loading(false);
  }
};

export const postAxiosRequest = async(url: string, body: Record<string, unknown>) => {
  try {
    const response: ServerResponse<Record<string, never>> = await request.post(url, body);

    const responseData = response;
    // showSuccessToast(responseData.data.message);
    return responseData;
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    //
  }
};

export const unMergeMembers = async(params:any) => {
  try {
    const response: ServerResponse<Record<string, never>> = await request.delete(`/v1/${params.workspaceId}/members/${params.memberId}/un-merge/${params.unMergeId}`);
    const responseData = response;
    showSuccessToast(responseData.data.message);
    return { responseData, error: false };
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    //
  }
};
