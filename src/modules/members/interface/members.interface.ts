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

export type MembersListResponse = {
  data: Array<Record<string, any>>;
  totalPages: string;
  previousPage: string;
  nextPage: string;
};

export interface DraggableComponentsProps {
  MembersColumn: boolean;
  handleModalClose:()=> void;
}
