import { GeneratorResponse } from '../../../lib/api';
import { platforms_module, SLACK_CONNECT_ENDPOINT } from '../../../lib/config';
import { request } from '../../../lib/request';
import { ConnectedPlatforms, PlatformResponse } from '../interface/settings.interface';

export function* PlatformsDataService(): GeneratorResponse<Array<PlatformResponse>> {
  const { data } = yield request.get(`${platforms_module}`);
  return data;
}

export function* ConnectedPlatformsDataService(workspaceId: string): GeneratorResponse<Array<ConnectedPlatforms>> {
  const { data } = yield request.get(`${platforms_module}/${workspaceId}/connected`);
  return data;
}

export const NavigateToConnectPage = () => {
  window.location.href = SLACK_CONNECT_ENDPOINT;
};
