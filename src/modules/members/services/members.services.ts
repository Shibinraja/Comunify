/* eslint-disable max-len */
import { AxiosError, GeneratorResponse, ServerResponse } from '@/lib/api';
import { request } from '@/lib/request';
import { showErrorToast } from 'common/toast/toastFunctions';
import { workspaceId } from 'modules/activities/interfaces/activities.interface';
import { Dispatch, SetStateAction } from 'react';

import {
  MembersProfileActivityGraphData,
  VerifyPlatform,
  GetMembersListQueryParams,
  MembersListResponse,
  VerifyMembers,
  MembersColumnsParams,
  GetMembersOrganizationListQueryParams,
  GetMembersLocationListQueryParams,
  ActivityDataResponse,
  ActivityInfiniteScroll,
  MemberProfileCard,
  MemberCountAnalyticsResponse,
  MemberActivityAnalyticsResponse,
  MergeMembersDataResponse
} from '../../members/interface/members.interface';
import { memberSuggestionType, mergeMembersType } from './service.types';

//Members Module
export function* CountAnalyticsService(params: workspaceId): GeneratorResponse<MemberCountAnalyticsResponse> {
  const { data } = yield request.get(`/v1/${params.workspaceId}/members/count-analytics`);
  return data;
}

export function* ActivityAnalyticsService(params: workspaceId): GeneratorResponse<MemberActivityAnalyticsResponse> {
  const { data } = yield request.get(`v1/${params.workspaceId}/members/activity-analytics`);
  return data;
}

export function* MembersActivityGraphService(params: VerifyMembers): GeneratorResponse<MembersProfileActivityGraphData> {
  const { data } = yield request.get(`/v1/${params.workspaceId}/members/${params.memberId}/activitygraph`);
  return data;
}

export function* GetMembersActivityGraphDataPerPlatformService(params: VerifyPlatform): GeneratorResponse<MembersProfileActivityGraphData> {
  const { data } = yield request.get(`/v1/${params.workspaceId}/members/${params.memberId}/activitygraph?platforms=${params.platform}`);
  return data;
}

export function* MembersListService(query: Required<GetMembersListQueryParams>): GeneratorResponse<MembersListResponse> {
  const { data } = yield request.get(
    `/v1/${query.workspaceId}/members?page=${query.membersQuery.page}&limit=${query.membersQuery.limit}${
      query.membersQuery.search ? `&search=${query.membersQuery.search}` : ''
    }${query.membersQuery.tags?.checkedTags ? `&tags=${query.membersQuery.tags.checkedTags}` : ''}${
      query.membersQuery.platforms ? `&platforms=${query.membersQuery.platforms}` : ''
    }${query.membersQuery.location?.checkedLocation ? `&location=${query.membersQuery.location.checkedLocation}` : ''}${
      query.membersQuery.organization?.checkedOrganization ? `&organization=${query.membersQuery.organization.checkedOrganization}` : ''
    }${query.membersQuery['lastActivity.gte'] ? `&lastActivity.gte=${query.membersQuery['lastActivity.gte']}` : ''}${
      query.membersQuery['lastActivity.lte'] ? `&lastActivity.lte=${query.membersQuery['lastActivity.lte']}` : ''
    }${query.membersQuery['createdAT.gte'] ? `&createdAT.gte=${query.membersQuery['createdAT.gte']}` : ''}
    ${query.membersQuery['createdAT.lte'] ? `&createdAT.lte=${query.membersQuery['createdAT.lte']}` : ''}`
  );
  return data;
}

export function* MembersLocationFilterService(query: Partial<GetMembersLocationListQueryParams>): GeneratorResponse<Array<{ location: string }>> {
  const { data } = yield request.get(
    `/v1/${query.workspaceId}/members/locationfilters?${
      query.membersQuery?.location?.searchedLocation ? `search=${query.membersQuery.location.searchedLocation}` : ''
    }`
  );
  return data;
}

export function* MembersOrganizationFilterService(
  query: Partial<GetMembersOrganizationListQueryParams>
): GeneratorResponse<Array<{ organization: string }>> {
  const { data } = yield request.get(
    `/v1/${query.workspaceId}/members/organizationfilters?${
      query.membersQuery?.organization?.searchedOrganization ? `search=${query.membersQuery.organization.searchedOrganization}` : ''
    }`
  );
  return data;
}

export function* MembersColumnsListService(
  query: Omit<MembersColumnsParams, 'columnData'>
): GeneratorResponse<Pick<MembersColumnsParams, 'columnData'>> {
  const { data } = yield request.get(`/v1/${query.workspaceId}/members/getmemberlistcolumnconfig`);
  return data;
}

export function* MembersColumnsListUpdateService(body: MembersColumnsParams): GeneratorResponse<Pick<MembersColumnsParams, 'columnData'>> {
  const { data } = yield request.put(`/v1/${body.workspaceId}/members/updatememberlistcolumnconfig`, { columnData: JSON.stringify(body.columnData) });
  return data;
}

export function* MembersListExportService(query: { workspaceId: string }): GeneratorResponse<{ type: string; data: Array<Buffer> }> {
  const { data } = yield request.get(`/v1/${query.workspaceId}/members/memberlistexport`);
  return data;
}

export function* GetMembersActivityDataInfiniteScrollSaga(params: ActivityInfiniteScroll): GeneratorResponse<ActivityDataResponse> {
  const { data } = yield request.get(
    `/v1/${params.workspaceId}/members/${params.memberId}/activity?page=1&limit=10${params?.nextCursor ? `&cursor=${params.nextCursor}` : ''}${
      params?.platform ? `&platforms=${params?.platform}` : ''
    }${params?.fromDate ? `&activity.gte=${params.fromDate}` : ''}${params?.toDate ? `&activity.lte=${params.toDate}` : ''}`
  );
  return data;
}

export function* GetMembersProfileCardService(params: VerifyMembers): GeneratorResponse<MemberProfileCard[]> {
  const { data } = yield request.get(`/v1/${params.workspaceId}/members/${params.memberId}/getMemberById`);
  return data;
}

//axios request

export const getMemberSuggestionList = async(args:memberSuggestionType, loading?: Dispatch<SetStateAction<boolean>>) => {
  try {
    loading?.(true);
    const response: ServerResponse<MergeMembersDataResponse> = await request.get(`/v1/${args.workspaceId}/members/${args.memberId}/merge-suggestion-list?page=1&limit=10${
      args.cursor ? `&cursor=${args.cursor}` : args.suggestionListCursor ? `&cursor=${args.prop ? '' : args.suggestionListCursor}` : ''
    }${args.search ? `&search=${args.search}` : ''}`);

    const responseData = response?.data?.data;
    return responseData;
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    loading?.(false);
  }
};

export const getMergedMemberList = async(args:memberSuggestionType, loading?: Dispatch<SetStateAction<boolean>>) => {
  try {
    loading?.(true);
    const response: ServerResponse<MergeMembersDataResponse> = await request.get(`/v1/${args.workspaceId}/members/${args.memberId}/merged-list?${
      args.cursor ? `&cursor=${args.cursor}` : args.suggestionListCursor ? `&cursor=${args.prop ? '' : args.suggestionListCursor}` : ''
    }`);

    const responseData = response?.data?.data;
    return responseData;
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    loading?.(false);
  }
};

export const mergeMembers = async(args:mergeMembersType) => {
  try {
    const response: ServerResponse<Record<string, never>> = await request.post(`/v1/${args.workspaceId}/members/${args.memberId}/merge`, { mergeList: args.mergeList });

    const responseData = response;
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
    return { responseData, error: false };
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    //
  }
};

