import { GeneratorResponse } from '@/lib/api';
import { members_module } from '@/lib/config';
import { request } from '@/lib/request';
import { GetMembersListQueryParams, MembersCountResponse, MembersListResponse } from '../interface/members.interface';

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

export function* MembersListService(query: GetMembersListQueryParams): GeneratorResponse<MembersListResponse> {
  const { data } = yield request.get(`/v1/members?page=${query.page}&limit=${query.limit}`);
  return data;
}

