import { GeneratorResponse } from '../../../lib/api';
import { SLACK_CONNECT_ENDPOINT } from '../../../lib/config';
import { request } from '../../../lib/request';
import { ConnectedPlatforms, PlatformResponse } from '../interface/settings.interface';

export function* PlatformsDataService(workspaceId: string): GeneratorResponse<Array<PlatformResponse>> {
  const { data } = yield request.get(`v1/${workspaceId}/platforms`);
  return data;
}

export function* ConnectedPlatformsDataService(workspaceId: string): GeneratorResponse<Array<ConnectedPlatforms>> {
  const { data } = yield request.get(`v1/${workspaceId}/platforms/connected`);
  return data;
}

export const NavigateToConnectPage = () => {
  window.location.href = SLACK_CONNECT_ENDPOINT;
};
