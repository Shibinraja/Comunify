/* eslint-disable no-unused-vars */
import { filterDateProps } from 'modules/members/interface/members.interface';
import { Dispatch, SetStateAction } from 'react';

export interface Platform {
  id: string;
  name: string;
  platformLogoUrl: string;
}

interface PlatformObj {
  platforms: Platform;
}

interface WorkspacePlatforms {
  WorkspacePlatforms: PlatformSettings[];
}

interface PlatformSettings {
  platformSettings: PlatformObj;
}

export interface UserWorkspaces {
  workspace: WorkspacePlatforms;
}

export type UserMemberFilterExportProps = {
  platform: Array<string>;
  domain: Array<string>;
  subscription: Array<string>;
  joinedAtLte: string;
  joinedAtGte: string;
  expiryAtLte: string;
  expiryAtGte: string;
};

export type UserMemberTypesProps = {
  page: number;
  limit: number;
  searchText: string;
  filteredDate: filterDateProps;
  memberFilterExport: (arg0: UserMemberFilterExportProps) => void;
  setMembersList: Dispatch<SetStateAction<UsersMemberListResponse>>;
  setPage: Dispatch<SetStateAction<number>>;
};

//Response Data

export interface GetUsersListQueryParams {
  page: number;
  limit: number;
  search?: string;
  platformId?: Array<string>;
  subscription?: Array<string>;
  domain?: Array<string>;

  tags?: {
    checkedTags: string;
    searchedTags: string;
  };

  organization?: {
    checkedOrganization: string;
    searchedOrganization: string;
  };
  location?: {
    checkedLocation: string;
    searchedLocation: string;
  };
  'joinedAt.lte'?: string;
  'joinedAt.gte'?: string;
  'expiryAt.lte'?: string;
  'expiryAt.gte'?: string;
  'createdAT.lte'?: string;
  'createdAT.gte'?: string;
}

export type UserMembersListData = {
  id: string;
  fullName: string;
  email: string;
  displayUserName: string;
  createdAt: string;
  userName: string;
  lastActive: string;
  profilePhotoUrl: string;
  location: string;
  website: string;
  domainSector: string;
  slug: string;
  userSubscriptions: {
    subscriptionStartAt: string;
    subscriptionExpirationAt: string;
    subscriptionPackage: {
      id: string;
      name: string;
      viewName: string;
    };
  }[];
  userWorkspaces: {
    workspace: {
      WorkspacePlatforms: {
        platformSettings: {
          platforms: {
            name: string;
            displayName: string;
            id: string;
          };
        };
      }[];
    };
  }[];
};

export type UsersMemberListResponse = {
  data: Array<UserMembersListData>;
  totalPages: number;
  previousPage: number;
  nextPage: number;
};

export type platformData = {
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

export type UserPlatformResponse = {
  nextCursor: string | null;
  result: Array<platformData>;
};

export type UsersAnalyticsData = {
  title: string,
  count: number
}
