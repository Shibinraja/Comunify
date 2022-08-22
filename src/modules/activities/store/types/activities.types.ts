import { ActiveStreamResponse, ActiveStreamTagResponse } from '../../interfaces/activities.interface';

export interface InitialState {
  activeStreamData: ActiveStreamResponse;
  activeStreamTagFilterResponse: Array<ActiveStreamTagResponse>;
}
