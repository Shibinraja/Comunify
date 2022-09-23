import {
  MembersProfileActivityGraphData,
  MembersListResponse,
  ActivityDataResponse,
  MemberProfileCard,
  MemberCountAnalyticsResponse,
  MemberActivityAnalyticsResponse
} from 'modules/members/interface/members.interface';
import { ColumnNameProps } from 'common/draggableCard/draggableCardTypes';

export type VoidGenerator<T = unknown, TNext = unknown> = Generator<T, void, TNext>;

export interface InitialState {
  membersCountAnalyticsData: MemberCountAnalyticsResponse;
  membersActivityAnalyticsData: MemberActivityAnalyticsResponse;
  membersProfileActivityGraphData: MembersProfileActivityGraphData;
  membersListData: MembersListResponse;
  customizedColumn: Array<ColumnNameProps>;
  membersLocationFilterResponse: Array<{ location: string }>;
  membersOrganizationFilterResponse: Array<{ organization: string }>;
  membersListExportData: Array<Buffer>;
  membersActivityData: ActivityDataResponse;
  memberProfileCardData: MemberProfileCard[];
}
