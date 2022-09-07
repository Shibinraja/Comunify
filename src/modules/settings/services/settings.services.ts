/* eslint-disable @typescript-eslint/ban-types */
import { SLACK_CONNECT_ENDPOINT } from '@/lib/config';
import { GeneratorResponse } from '../../../lib/api';
import { request } from '../../../lib/request';
import {
  assignTagProps,
  createTagProps,
  GetTagListQueryParams,
  ConnectedPlatforms,
  PlatformResponse,
  TagResponse,
  updateTagProps,
  unAssignTagProps
} from '../interface/settings.interface';

export const NavigateToConnectPage = () => {
  window.location.href = SLACK_CONNECT_ENDPOINT;
};

export function* PlatformsDataService(workspaceId: string): GeneratorResponse<Array<PlatformResponse>> {
  const { data } = yield request.get(`v1/${workspaceId}/platforms`);
  return data;
}

export function* ConnectedPlatformsDataService(workspaceId: string): GeneratorResponse<Array<ConnectedPlatforms>> {
  const { data } = yield request.get(`v1/${workspaceId}/platforms/connected`);
  return data;
}

export function* TagDataService(query: Partial<GetTagListQueryParams>): GeneratorResponse<TagResponse> {
  const { data } = yield request.get(
    `/v1/${query.workspaceId}/tags?page=${query.settingsQuery?.page}&limit=${query.settingsQuery?.limit}${
      query.settingsQuery?.tags.searchedTags ? `&search=${query.settingsQuery?.tags.searchedTags}` : ''
    }`
  );
  return data;
}

export function* CreateTagDataService(query: Partial<createTagProps>): GeneratorResponse<TagResponse> {
  const { data } = yield request.post(`/v1/${query.workspaceId}/tags`, query.tagBody);
  return data;
}

export function* UpdateTagDataService(params: updateTagProps): GeneratorResponse<TagResponse> {
  const { data } = yield request.put(`/v1/${params.workspaceId}/tags/${params.tagId}`, params.tagBody);
  return data;
}

export function* DeleteTagDataService(params: Omit<updateTagProps, 'tagBody'>): GeneratorResponse<TagResponse> {
  const { data } = yield request.delete(`/v1/${params.workspaceId}/tags/${params.tagId}`);
  return data;
}

export function* AssignTagDataService(params: assignTagProps): GeneratorResponse<{}> {
  const { data } = yield request.post(`/v1/${params.workspaceId}/tags/${params.memberId}/assign`, params.assignTagBody);
  return data;
}

export function* UnAssignTagDataService(params: unAssignTagProps): GeneratorResponse<{}> {
  const { data } = yield request.post(`/v1/${params.workspaceId}/tags/${params.memberId}/delete`, params.unAssignTagBody);
  return data;
}
