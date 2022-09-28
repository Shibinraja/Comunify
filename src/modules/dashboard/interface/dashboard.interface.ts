import { ReactElement } from 'react';
import { Layout } from 'react-grid-layout';

export interface SidePanelWidgetsList {
  id: string;
  invocationType: number;
  widgetLocation: string;
  name: string;
  viewName: string;
  description: string;
  type: string;
  scope: number;
  config: {
    maxW: string;
    minW: string;
    height: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SidePanelWidgetsData {
  id: string;
  invocationType: number;
  widgetLocation: string;
  name: string;
  viewName: string;
  description: string;
  type: string;
  scope: number;
  config: {
    maxW: string;
    minW: string;
    height: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WidgetsList {
  QuickInfo: ReactElement;
  HealthCard: ReactElement;
  ActivitiesTab: ReactElement;
}

export interface TransformedWidgetData {
  widgetId: string;
  status: string;
  config: Layout;
}

export interface Widgets {
  id: string;
  layout: Layout;
}

export interface ActivitiesWidgetData {
  id: string;
  workspaceId: string;
  name: string;
  platform: string;
  type: string;
  value: string;
  displayValue: string;
  sourceUrl: string;
  description: null | string;
  comunifyMemberId: string;
  profilePictureUrl: string;
  platformId: string;
  createdAt: Date;
  updatedAt: Date;
  platformMemberId: string;
  activityId: string;
  activityTime: Date;
  memberId: string;
  channelId: string;
  platformLogoUrl: string;
  checkMerge: string;
  primaryMemberId: string;
  memberName: string;
  email: string;
  organization: string;
  memberProfile: string;
  totalCount: number;
}

export interface MemberWidgetData {
  comunifyMemberId: string;
  createdAt: Date;
  email: string;
  id: string;
  isMerged: boolean;
  isPrimary: boolean;
  joinedAt: Date;
  lastActivity: Date;
  location: string;
  name: string;
  organization: string;
  parentMemberId: string | null;
  platformId: string;
  platformMemberId: string;
  platformName: string;
  profileUrl: string;
  totalCount: number;
  updatedAt: Date;
  workspaceId: string;
}

export interface QuickInfoData {
  analyticMessage: string;
  count: number;
  percentage: number;
  title: string;
}

export interface RequestForWidget {
  name: string;
  description: string;
}

export interface RequestForWidgetResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  userId: string;
  description: string;
}
