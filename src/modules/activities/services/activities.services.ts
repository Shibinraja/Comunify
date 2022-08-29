import { GeneratorResponse } from '../../../lib/api';
import { request } from '../../../lib/request';
import {
  ActiveStreamResponse,
  ActiveStreamTagResponse,
  GetActiveStreamListQueryParams,
  GetActiveStreamTagListQueryParams
} from '../interfaces/activities.interface';

export function* getActiveStreamDataService(params: Required<GetActiveStreamListQueryParams>): GeneratorResponse<ActiveStreamResponse> {
  const { data } = yield request.get(
    `/v1/${params.workspaceId}/activity?page=${params.activeStreamQuery.page}&limit=${params.activeStreamQuery.limit}${
      params.activeStreamQuery.search ? `&search=${params.activeStreamQuery.search}` : ''
    }${params.activeStreamQuery.tags?.checkedTags ? `&tags=${params.activeStreamQuery.tags.checkedTags}` : ''}${
      params.activeStreamQuery.platforms ? `&platforms=${params.activeStreamQuery.platforms}` : ''
    }${params.activeStreamQuery['activity.gte'] ? `&activity.gte=${params.activeStreamQuery['activity.gte']}` : ''}${
      params.activeStreamQuery['activity.lte'] ? `&activity.lte=${params.activeStreamQuery['activity.lte']}` : ''
    }`
  );
  return data;
}

export function* ActiveStreamTagFilterService(query: Partial<GetActiveStreamTagListQueryParams>): GeneratorResponse<Array<ActiveStreamTagResponse>> {
  const { data } = yield request.get(
    `/v1/${query.workspaceId}/tags?${query.activeStreamQuery?.tags.searchedTags ? `search=${query.activeStreamQuery.tags.searchedTags}` : ''}`
  );
  return data;
}
