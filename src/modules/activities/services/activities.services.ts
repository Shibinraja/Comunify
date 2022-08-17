import { GeneratorResponse } from '../../../lib/api';
import { API_ENDPOINT } from '../../../lib/config';
import { request } from '../../../lib/request';
import { ActiveStreamResponse, VerifyWorkSpace } from '../interfaces/activities.interface';

export function* getActiveStreamDataService(params: VerifyWorkSpace): GeneratorResponse<ActiveStreamResponse> {
  const { data } = yield request.get(`${API_ENDPOINT}/v1/${params.workSpaceId}/activity`);
  return data;
}
