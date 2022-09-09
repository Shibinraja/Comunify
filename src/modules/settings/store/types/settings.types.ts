import { PlatformResponse, TagResponse, ConnectedPlatforms } from '../../interface/settings.interface';

export interface InitialState {
  PlatformFilterResponse: Array<PlatformResponse>;
  TagFilterResponse: TagResponse;
  PlatformsConnected: Array<ConnectedPlatforms>;
  clearValue: boolean;
}
