import {
  MembersProfileActivityGraphData,
  MembersListResponse,
  MembersTagResponse,
  ActivityDataResponse,
  MembersCountResponse,
  MemberProfileCard,
  PlatformResponse
} from 'modules/members/interface/members.interface';
import { ColumnNameProps } from 'common/draggableCard/draggableCardTypes';

export type VoidGenerator<T = unknown, TNext = unknown> = Generator<T, void, TNext>;

export interface InitialState {
  membersTotalCountData: MembersCountResponse;
  membersNewCountData: MembersCountResponse;
  membersActiveCountData: MembersCountResponse;
  membersInActiveCountData: MembersCountResponse;
  membersProfileActivityGraphData: MembersProfileActivityGraphData;
  PlatformFilterResponse: Array<PlatformResponse>;
  membersListData: MembersListResponse;
  customizedColumn: Array<ColumnNameProps>;
  membersLocationFilterResponse: Array<{ location: string }>;
  membersOrganizationFilterResponse: Array<{ organization: string }>;
  membersTagFilterResponse: Array<MembersTagResponse>;
  membersListExportData: Array<Buffer>;
  membersActivityData: ActivityDataResponse;
  memberProfileCardData: MemberProfileCard[];
}
