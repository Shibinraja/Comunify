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
  memberId: string;
  platformId: string;
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
