// Input Body

export type GetMembersListQueryParams = {
  page: number;
  limit: number;
  search: string;
  tags: string;
  platforms: string;
  organization: string;
  lastActivity: string;
  createdAT: string;
};

// Response Body

export type MembersCountResponse = {
  count: number;
  title: string;
  analyticMessage: string;
};

export type MembersListData = {
  id: string,
  name: string,
  userName: string,
  comunifyUserId: string,
  lastActivity: string,
  email: string,
  organization: string,
  profileUrl: string,
  workspaceId: string,
  createdAt: string,
  updatedAt: string,
  location?:string
  tags: {
      tag: {
        name: string
      }
  }[],
  platforms: {
      platform: {
        name: string
      }
  }[];
}

export type MembersListResponse = {
  data: Array<MembersListData>;
  totalPages: number;
  previousPage: number;
  nextPage: number;
};

export interface DraggableComponentsProps {
  MembersColumn: boolean;
  handleModalClose:()=> void;
}
