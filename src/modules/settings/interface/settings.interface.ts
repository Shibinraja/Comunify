/* eslint-disable no-unused-vars */
export interface PlatformIcons {
  slack: string | undefined;
  vanillaForums: string | undefined;
  discord: string | undefined;
  reddit: string | undefined;
}

export interface PlatformsStatus {
  platform: string | undefined;
  status: string | undefined;
}

export interface ConnectBody {
  code: string | null;
  workspaceId: string;
}

export interface VanillaForumsConnectData {
  vanillaBaseUrl: string;
  vanillaAccessToken: string;
  workspaceId: string;
}

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

type filterProps = {
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

export interface assignTagProps extends workspaceId {
  memberId: string;
  assignTagBody: {
    name: string;
    viewName: string;
    type: AssignTypeEnum;
    activityId?: string;
  };
  filter?: filterProps;
}

export interface unAssignTagProps extends workspaceId {
  memberId: string;
  unAssignTagBody: {
    tagId: string;
    type: AssignTypeEnum;
    activityId?: string;
  };
  filter?: filterProps;
}
export interface ModalState {
  slack: boolean;
  vanillaForums: boolean;
  discord: boolean;
  reddit: boolean;
}

// Response Body

export type TagResponseData = {
  id: string;
  name: string;
  viewName: string;
  createdAt: Date;
  createdBy: string;
  type: string;
  totalCount: number;
};

export enum TagType {
  Default = 'Default'
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
  name: string;
  workspaceId: string;
  platformSettingsId: string;
  communityId: string | null;
  overRideMaxRetries: string | null;
  overRideMaxRetryValues: null;
  isActive: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  platformLogoUrl: string;
  platformId: string;
}

export enum AssignTagsTypeEnum {
  Custom,
  Default
}

export type AssignTagsProps = {
  id: string;
  name: string;
  viewName: string;
  workspaceId: string;
  createdBy: string;
  updatedBy: string;
  type: AssignTagsTypeEnum;
  createdAt: string;
  updatedAt: string;
};

export interface SubscriptionDetails {
  id: string;
  startAt: Date;
  endAt: Date;
  stripeSubscriptionId: string;
  autoRenewal: boolean;
  status: string;
  subscriptionPackage: {
    id: string;
    stripeProductId: string;
    stripePriceId: string;
    name: string;
    viewName: string;
    type: string;
    description: string;
    isActive: boolean;
    amount: number;
    periodType: string;
    periodValue: number;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface UpdateSubscriptionBody {
  autoRenewal: boolean;
  subscriptionId: string;
  userSubscriptionId: string;
}

export interface UpdateSubscriptionAutoRenewal {
  amount: number;
  autoRenewSubscription: boolean;
  cancelationReason: null | string;
  createdAt: Date;
  id: string;
  status: string;
  stripeDefaultPaymentMethod: null | string;
  stripeSubscriptionId: string;
  stripeSubscriptionStage: null | string;
  subscriptionPackageId: string;
  subscriptionCancelationAt: null | string;
  subscriptionExpirationAt: Date;
  subscriptionMetaData: string;
  subscriptionStartAt: Date;
  subscriptionStatus: string;
  trialCancelationAt: null | string;
  trialExpirationAt: null | string;
  trialStartAt: null | string;
  updatedAt: Date;
  userId: string;
}

export interface ClientSecret {
  id: string;
  clientSecret: string;
}
export interface BillingDetails {
  billingName: string;
  billingEmail: string;
}

export interface AddedCardDetails {
  id: string;
  cardLastFourDigits: number;
  brand: string;
  expMonth: number;
  expYear: number;
  userId: string;
  isDefault: boolean;
  isVerified: boolean;
  stripePaymentMethodId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpgradeData {
  upgrade?: boolean;
  paymentMethod?: string;
}
