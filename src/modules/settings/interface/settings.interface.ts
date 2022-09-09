/* eslint-disable no-unused-vars */
// Input Body

export interface workspaceId {
  workspaceId: string;
}
export interface GetTagListQueryParams extends workspaceId {
  settingsQuery: {
    page: number;
    limit: number;
    tags: {
      checkedTags: string;
      searchedTags: string;
    };
  };
}

export interface createTagProps extends workspaceId {
  tagBody: {
    name: string;
    viewName: string;
  };
}

export interface updateTagProps extends createTagProps {
  tagId: string;
}

export enum AssignTypeEnum {
  Member = 'Member',
  Activity = 'Activity',
  Comments = 'Comments',
  Reactions = 'Reactions'
}
export interface assignTagProps extends workspaceId {
  memberId: string;
  assignTagBody: {
    name: string;
    viewName: string;
    type: AssignTypeEnum;
    activityId?: string;
  };
}

export interface unAssignTagProps extends workspaceId {
  memberId: string;
  unAssignTagBody: {
    tagId: string;
    activityId?: string;
  };
}
export interface ModalState {
  slack: boolean;
  vanillaForums: boolean;
}

// Response Body

export type TagResponseData = {
  id: string;
  name: string,
  viewName: string,
  createdAt: Date,
  createdBy: string,
  type: string,
  totalCount: number
};

export enum TagType {
  Default = 'Default',
}

export type TagResponse = {
  data: Array<TagResponseData>;
  totalPages: number;
  previousPage: number;
  nextPage: number;
};

export type PlatformResponse = {
  id: string;
  name: string;
  status: string;
  errorMessage: string;
  platformLogoUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isConnected: boolean;
};

export interface ConnectedPlatforms {
  id: string;
  workspaceId: string;
  platformId: string;
  name: string;
  status: string;
  lastFetched: string;
  createdAt: Date;
  updatedAt: Date;
  platform: {
    name: string;
    platformLogoUrl: string;
  };
}

export interface PlatformIcons {
  slack: string | undefined;
  vanillaForums: string | undefined;
}

export interface PlatformsStatus {
  platform: string | undefined;
  status: string | undefined;
}

export interface SlackConnectData {
  code: string | null;
  workspaceId: string;
}

export interface VanillaForumsConnectData {
  vanillaBaseUrl: string;
  vanillaAccessToken: string;
  workspaceId: string;
}
