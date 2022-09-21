export interface ProfileModal {
  id: string;
  isOpen: boolean;
  memberName: string;
  email: string;
  organization: string;
  memberProfileUrl: string;
  profilePictureUrl: string | null;
  platformLogoUrl: string | null;
}

export interface ActivityCard {
  isOpen: boolean;
  memberName: string;
  email: string;
  organization: string;
  displayValue: string;
  description: string;
  channelName: string;
  sourceUrl: string | null;
  activityTime: Date;
  profilePictureUrl: string | null;
  value: string | null;
  platformLogoUrl: string | null;
  platform: string;
  memberId: string;
  activityId: string;
  tags: Array<{ id: string; name: string }> | null;
}

export interface workspaceId {
  workspaceId: string;
}

// Input Body

export interface GetActiveStreamListQueryParams extends workspaceId {
  activeStreamQuery: {
    page: number;
    limit: number;
    search?: string;
    platforms?: string;
    tags?: {
      checkedTags: string;
      searchedTags: string;
    };
    'activity.lte'?: string;
    'activity.gte'?: string;
  };
}

export interface GetActiveStreamTagListQueryParams extends workspaceId {
  activeStreamQuery: {
    tags: {
      checkedTags: string;
      searchedTags: string;
    };
  };
}

// Response Body
export type WorkspaceTags = {
  id: string;
  name: string;
  viewName: string;
  workspaceId: string;
  createdDate: string;
  updatedDate: string;
};

export interface ActiveStreamData {
  id: string;
  workspaceId: string;
  name: string;
  platform: string;
  type: string;
  value: string;
  channelId: string;
  displayValue: string;
  sourceUrl: null | string;
  platformLogoUrl: string;
  description: string;
  comunifyMemberId: string;
  organization: string;
  profilePictureUrl: string;
  platformId: string;
  createdAt: Date;
  updatedAt: Date;
  platformMemberId: string;
  activityId: string;
  activityTime: Date;
  memberId: string;
  tags: Array<{ id: string; name: string }> | null;
  memberName: string;
  email: string;
  memberProfile: string;
  totalCount: number;
  primaryMemberId: string
}

export interface ActiveStreamResponse {
  data: ActiveStreamData[];
  totalPages: number;
  previousPage: number;
  nextPage: number;
}

export type ActiveStreamTagResponse = {
  id: string;
  name: string;
  viewName: string;
  type: string;
  createdAt: string;
  createdBy: string;
  isEditable: boolean;
};
