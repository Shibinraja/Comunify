/* eslint-disable no-unused-vars */
export interface workspaceId {
  workspaceId: string;
}

// Input Body

export interface GetMembersListQueryParams extends workspaceId {
  membersQuery: {
    page: number;
    limit: number;
    search?: string;
    tags?: string;
    platforms?: string;
    organization?: string;
    'lastActivity.lte'?: string;
    'lastActivity.gte'?: string;
    'createdAT.lte'?: string;
  };
}

// Response Body

export type MembersCountResponse = {
  count: number;
  title: string;
  analyticMessage: string;
};

export interface SeriesDataForMemberGraph {
  name: string;
  data: number[];
}

export interface MembersProfileActivityGraphData {
  series: SeriesDataForMemberGraph[];
  xAxis: string[];
}

export interface VerifyMembers {
  workspaceId: string;
  memberId: string;
}

export interface MemberGraphProps {
  activityGraphData: MembersProfileActivityGraphData;
}
export interface PlatformsData {
  id: string;
  name: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VerifyPlatform {
  workspaceId: string;
  memberId: string;
  platform: string;
}

export type MembersListData = {
  id: string;
  name: string;
  userName: string;
  comunifyUserId: string;
  lastActivity: string;
  email: string;
  organization: string;
  profileUrl: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  location?: string;
  platformName: string;
  tags: {
    tag: {
      name: string;
    };
  }[];
  platforms: {
    platform: {
      name: string;
    };
  }[];
};

export type MembersListResponse = {
  data: Array<MembersListData>;
  totalPages: number;
  previousPage: number;
  nextPage: number;
};

export interface DraggableComponentsProps {
  MembersColumn: boolean;
  handleModalClose: () => void;
}

export enum ActivitiesType {
  Message = 'Message',
  Event = 'Event',
  Thread = 'Thread',
  Reaction = 'Reaction',
  Member = 'Member'
}

export interface ActivityResult {
  id: string;
  workspaceId: string;
  activityId: string;
  name: string;
  platform: string;
  type: ActivitiesType.Message;
  value: string;
  displayValue: string;
  sourceUrl: string | null;
  description: string;
  comunifyMemberId: string;
  profilePictureUrl: string;
  platformId: string;
  platformMemberId: string;
  activityTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityDataResponse {
  result: ActivityResult[];
  nextCursor: string | null;
}

export interface ActivityInfiniteScroll {
  workspaceId: string;
  memberId: string;
  nextCursor?: string | null;
}
