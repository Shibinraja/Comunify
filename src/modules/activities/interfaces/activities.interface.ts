import { PaginationResponse } from 'interface/interface';

export interface ProfileModal {
  id: string;
  isOpen: boolean;
  memberName: string;
  email: string;
  organization: string;
  memberProfileUrl: string;
  profilePictureUrl: string | null;
  platformLogoUrl: string | null;
  platforms: {
    name: string;
    id: string;
    platformLogoUrl: string;
  }[];
}

export interface ActivityCard {
  isOpen: boolean;
  memberName: string;
  email: string;
  organization: string;
  displayValue: string;
  description: string;
  sourceUrl: string | null;
  activityTime: Date;
  profilePictureUrl: string;
  platforms: {
    name: string;
    id: string;
    platformLogoUrl: string;
  }[];
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
    activityId?: string;
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
  platforms: {
    name: string;
    id: string;
    platformLogoUrl: string;
  }[];
  totalCount: number;
  primaryMemberId: string;
}

export type ActiveStreamResponse = PaginationResponse<ActiveStreamData>;

export type ActiveStreamTagResponse = {
  id: string;
  name: string;
  viewName: string;
  type: string;
  createdAt: string;
  createdBy: string;
  isEditable: boolean;
};
