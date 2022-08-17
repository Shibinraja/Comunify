import {
  PlatformsData,
  MembersProfileActivityGraphData,
  MembersListResponse,
  ActivityDataResponse,
  MembersCountResponse
} from 'modules/members/interface/members.interface';
import { ColumnNameProps } from 'common/draggableCard/draggableCardTypes';

export type VoidGenerator<T = unknown, TNext = unknown> = Generator<T, void, TNext>;

export interface InitialState {
  membersTotalCountData: MembersCountResponse;
  membersNewCountData: MembersCountResponse;
  membersActiveCountData: MembersCountResponse;
  membersInActiveCountData: MembersCountResponse;

  membersProfileActivityGraphData: MembersProfileActivityGraphData;
  platformsData: PlatformsData[];

  membersListData: MembersListResponse;
  customizedColumn: Array<ColumnNameProps>;
  membersActivityData: ActivityDataResponse;
}
