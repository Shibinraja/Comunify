import { ConnectedPlatforms, PlatformResponse } from '../../interface/settings.interface';

export interface InitialState {
  PlatformFilterResponse: Array<PlatformResponse>;
  PlatformsConnected: Array<ConnectedPlatforms>;
}
