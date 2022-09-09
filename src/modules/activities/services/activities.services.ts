import { GeneratorResponse } from '../../../lib/api';
import { request } from '../../../lib/request';
import { ActiveStreamResponse, GetActiveStreamListQueryParams } from '../interfaces/activities.interface';

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
