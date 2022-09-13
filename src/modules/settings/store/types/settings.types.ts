import { PlatformResponse, TagResponse, ConnectedPlatforms, AssignTagsProps } from '../../interface/settings.interface';

export interface InitialState {
  PlatformFilterResponse: Array<PlatformResponse>;
  TagFilterResponse: TagResponse;
  PlatformsConnected: Array<ConnectedPlatforms>;
  clearValue: boolean;
  assignTagResponse: AssignTagsProps
}
