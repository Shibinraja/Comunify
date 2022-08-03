import { ColumnNameProps } from 'common/draggableCard/draggableCardTypes';
import { MembersCountResponse, MembersListResponse } from 'modules/members/interface/members.interface';

export type VoidGenerator<T = unknown, TNext = unknown> = Generator<T, void, TNext>;

export interface InitialState {
  membersTotalCountData: MembersCountResponse;
  membersNewCountData: MembersCountResponse;
  membersActiveCountData: MembersCountResponse;
  membersInActiveCountData: MembersCountResponse;
  membersListData: MembersListResponse;
  customizedColumn: Array<ColumnNameProps>;
}
