/* eslint-disable max-len */
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

export function* MembersListService(query: Required<GetMembersListQueryParams>): GeneratorResponse<MembersListResponse> {
  const { data } = yield request.get(`/v1/${query.workspaceId}/members?page=${query.membersQuery.page}&limit=${query.membersQuery.limit}${query.membersQuery.search ?`&search=${query.membersQuery.search}` : ''}${query.membersQuery.tags ?`&tags=${query.membersQuery.tags}` : ''}${query.membersQuery.platforms ?`&platforms=${query.membersQuery.platforms}` : ''}${query.membersQuery.organization ?`&organization=${query.membersQuery.organization}` : ''}${query.membersQuery['lastActivity.gte'] ?`&lastActivity.gte=${query.membersQuery['lastActivity.gte']}` : ''}${query.membersQuery['lastActivity.lte'] ?`&lastActivity.lte=${query.membersQuery['lastActivity.lte']}` : ''}${query.membersQuery['createdAT.lte'] ?`&createdAT.lte=${query.membersQuery['createdAT.lte']}` : ''}`);
  return data;
}
