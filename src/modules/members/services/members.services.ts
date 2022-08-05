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
  const { data } = yield request.get(`/v1/members?page=${query.page}&limit=${query.limit}${query.search ?`&search=${query.search}` : ''}${query.tags ?`&tags=${query.tags}` : ''}${query.platforms ?`&platforms=${query.platforms}` : ''}${query.organization ?`&organization=${query.organization}` : ''}${query['lastActivity.gte'] ?`&lastActivity.gte=${query['lastActivity.gte']}` : ''}${query['lastActivity.lte'] ?`&lastActivity.lte=${query['lastActivity.lte']}` : ''}${query['createdAT.lte'] ?`&createdAT.lte=${query['createdAT.lte']}` : ''}`);
  return data;
}

