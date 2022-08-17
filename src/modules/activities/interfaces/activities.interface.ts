export interface WorkspaceTags {
  id: string;
  name: string;
  viewName: string;
  workspaceId: string;
  createdDate: string;
  updatedDate: string;
}

export interface ActiveStreamData {
  id: string;
  workspaceId: string;
  name: string;
  platform: string;
  type: string;
  value: string;
  displayValue: string;
  sourceUrl: null | string;
  description: string;
  comunifyMemberId: string;
  profilePictureUrl: string;
  platformId: string;
  createdAt: Date;
  updatedAt: Date;
  platformMemberId: string;
  activityId: string;
  activityTime: Date;
  memberId: string;
  tags: WorkspaceTags[];
  memberName: string;
  email: string;
  memberProfile: string;
  totalCount: number;
}

export interface ActiveStreamResponse {
  data: ActiveStreamData[];
  totalPages: number | null;
  previousPage: number | null;
  nextPage: number | null;
}

export interface VerifyWorkSpace {
  workSpaceId: string;
}

export interface ProfileModal {
  id: string;
  isOpen: false | boolean;
  memberName: string;
  email: string;
  organization: string;
  memberProfileUrl: string;
  profilePictureUrl: string | null;
}

export interface ActivityCard {
  isOpen: false | boolean;
  memberName: string;
  email: string;
  organization: string;
  displayValue: string;
  description: string;
  channelName: string;
  sourceUrl: string | null;
  createdAt: Date;
  profilePictureUrl: string | null;
  value: string | null;
}
