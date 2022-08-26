import { GeneratorResponse } from '../../../lib/api';
import { platforms_module } from '../../../lib/config';
import { request } from '../../../lib/request';
import { PlatformResponse } from '../interface/settings.interface';

export function* PlatformsDataService(): GeneratorResponse<Array<PlatformResponse>> {
  const { data } = yield request.get(`${platforms_module}`);
  return data;
}
