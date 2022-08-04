/* eslint-disable no-console */
import { GeneratorResponse } from '@/lib/api';
import { members_module, platforms_module } from '@/lib/config';
import { request } from '@/lib/request';
import { MembersCountResponse, MembersProfileActivityGraphData, PlatformsData } from '../interface/members.interface';

//Members Module
export function* ActiveCountService(): GeneratorResponse<MembersCountResponse> {
  const { data } = yield request.get(`${members_module}/activecount`);
  return data;
}

export function* NewCountService(): GeneratorResponse<MembersCountResponse> {
  const { data } = yield request.get(`${members_module}/newcount`);
  return data;
}

export function* TotalCountService(): GeneratorResponse<MembersCountResponse> {
  const { data } = yield request.get(`${members_module}/totalcount`);
  return data;
}

export function* InactiveCountService(): GeneratorResponse<MembersCountResponse> {
  const { data } = yield request.get(`${members_module}/inactivecount`);
  return data;
}

export function* MembersActivityGraphService(memberId: string): GeneratorResponse<MembersProfileActivityGraphData> {
  const { data } = yield request.get(`${members_module}/${memberId}/activitygraph`);
  return data;
}

export function* PlatformsDataService(): GeneratorResponse<PlatformsData[]> {
  const { data } = yield request.get(`${platforms_module}`);
  return data;
}

export function* GetMembersActivityGraphDataPerPlatformService(
  memberId: string,
  platformId: string
): GeneratorResponse<MembersProfileActivityGraphData> {
  const { data } = yield request.get(`${members_module}/${memberId}/activitygraph?platforms=${platformId}`);
  return data;
}
