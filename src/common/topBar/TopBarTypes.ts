/* eslint-disable no-unused-vars */

//Activity Type
export enum ActivityEnum {
  Activity = 'Activity',
  Member = 'Member'
}

// Input Body
export type SearchSuggestionArgsType = {
  workspaceId: string;
  cursor: string | null;
  prop: string;
  search: string;
  suggestionListCursor: string | null;
};

// Response Data
export type GlobalSearchDataResult = {
  id: string;
  memberName: string;
  email: string;
  location: string;
  organization: string;
  value: string;
  displayValue: string;
  createdAt: string;
  icon: string;
  resultType: string;
};

export type GlobalSearchDataResponse = {
  result: GlobalSearchDataResult[];
  nextCursor: string | null;
};

export interface NotificationListQuery {
  cursor?: string | null;
  limit: number;
  workspaceId: string;
  type?: 'all' | 'read' | 'unread';
}

export interface NotificationList {
  result: NotificationData[];
  nextCursor: string | null;
}
export interface NotificationData {
  createdAt: Date;
  createdBy: Date;
  isRead: boolean;
  markedForDeletionAt: Date;
  markedForDeletionBy: string;
  notificationId: string;
  readAt: Date;
  recipientId: string;
  recipientWorkspaceId: string;
  status: number;
  updatedAt: Date;
  updatedBy: string;
  notification: {
    createdAt: Date;
    createdBy: string;
    id: string;
    jobNotificationSchemaVersion: string;
    markedForDeletionAt: Date;
    markedForDeletionBy: string;
    message: string;
    notificationClass: number;
    notificationPayload: {
      imageUrl?: string;
      data?: object;
    };
    notificationType: number;
    organizationId: string;
    recipientType: number;
    status: number;
    statusChangedAt: Date;
    updatedAt: Date;
    updatedBy: string;
    userId: string;
    workspaceId: string;
  };
}

export interface UpdateNotification {
  notificationId: string;
  workspaceId: string;
}
