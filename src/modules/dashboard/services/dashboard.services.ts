/* eslint-disable space-before-function-paren */
import { showErrorToast } from '../../../common/toast/toastFunctions';
import { HealthScoreWidgetData } from '../../../common/widgetLayout/WidgetTypes';
import { API_ENDPOINT } from '../../../lib/config';
import { request } from '../../../lib/request';
import { MembersProfileActivityGraphData } from '../../members/interface/members.interface';
import { ActivitiesWidgetData, MemberWidgetData, QuickInfoData, RequestForWidget, SidePanelWidgetsList } from '../interface/dashboard.interface';

export const getSidePanelWidgetsService = async (scope: number, workspaceId: string, search?: string): Promise<SidePanelWidgetsList[]> => {
  try {
    const { data } = await request.get(`${API_ENDPOINT}/v1/${workspaceId}/widgets`, { params: { scope, search } });
    return data?.data?.result as SidePanelWidgetsList[];
  } catch (error) {
    //TODO error loading toast
    showErrorToast('Error loading widgets');
    return [];
  }
};

export const saveWidgetsLayoutService = async (workspaceId: string, body: any[]) => {
  try {
    const { data } = await request.put(`${API_ENDPOINT}/v1/${workspaceId}/widgets/workspace-widgets`, { workspaceWidgetsData: body });
    return data;
  } catch {
    showErrorToast('Failed to save widget layout');
  }
};

export const getWidgetsLayoutService = async (workspaceId: string) => {
  try {
    const { data } = await request.get(`${API_ENDPOINT}/v1/${workspaceId}/widgets/workspace-widgets`);
    return data?.data?.result;
  } catch {
    showErrorToast('Failed to save widget layout');
  }
};

export const quickInfoWidgetService = async (workspaceId: string, startDate?: string, endDate?: string): Promise<QuickInfoData[]> => {
  try {
    const { data } = await request.get(`${API_ENDPOINT}/v1/${workspaceId}/widgets/quick-info`, { params: { startDate, endDate } });
    return data?.data as QuickInfoData[];
  } catch {
    showErrorToast('Failed to load quick info widget data');
    return [];
  }
};

export const healthScoreWidgetDataService = async (workspaceId: string, startDate?: string, endDate?: string): Promise<HealthScoreWidgetData[]> => {
  try {
    const { data } = await request.get(`${API_ENDPOINT}/v1/${workspaceId}/widgets/health-score`, { params: { startDate, endDate } });
    return data?.data as HealthScoreWidgetData[];
  } catch {
    showErrorToast('Failed to load health score widget data');
    return [];
  }
};

export const activitiesWidgetDataService = async (
  workspaceId: string,
  type: string,
  startDate?: string,
  endDate?: string
): Promise<ActivitiesWidgetData[]> => {
  try {
    const { data } = await request.get(`${API_ENDPOINT}/v1/${workspaceId}/widgets/activity`, { params: { type, limit: 20, startDate, endDate } });
    return data?.data?.data as ActivitiesWidgetData[];
  } catch {
    showErrorToast('Failed to load activity widget data');
    return [];
  }
};

export const membersWidgetDataService = async (
  workspaceId: string,
  type: string,
  startDate?: string,
  endDate?: string
): Promise<MemberWidgetData[]> => {
  try {
    const { data } = await request.get(`${API_ENDPOINT}/v1/${workspaceId}/widgets/member`, { params: { type, limit: 20, startDate, endDate } });
    return data?.data?.data as MemberWidgetData[];
  } catch {
    showErrorToast('Failed to load members widget data');
    return [];
  }
};

export const activityGrowthWidgetDataService = async (
  workspaceId: string,
  startDate?: string,
  endDate?: string
): Promise<MembersProfileActivityGraphData> => {
  try {
    const { data } = await request.get(`${API_ENDPOINT}/v1/${workspaceId}/widgets/activity-growth`, { params: { startDate, endDate } });
    return data?.data as MembersProfileActivityGraphData;
  } catch {
    showErrorToast('Failed to load activity growth widget data');
    return {} as MembersProfileActivityGraphData;
  }
};

export const memberGrowthWidgetDataService = async (
  workspaceId: string,
  startDate?: string,
  endDate?: string
): Promise<MembersProfileActivityGraphData> => {
  try {
    const { data } = await request.get(`${API_ENDPOINT}/v1/${workspaceId}/widgets/member-growth`, { params: { startDate, endDate } });
    return data?.data as MembersProfileActivityGraphData;
  } catch {
    showErrorToast('Failed to load member growth widget data');
    return {} as MembersProfileActivityGraphData;
  }
};

export const requestForWidgetService = async (workspaceId: string, body: RequestForWidget) => {
  try {
    const { data } = await request.post(`${API_ENDPOINT}/v1/${workspaceId}/widgets/request`, body);
    return data?.data;
  } catch {
    showErrorToast('Request for widget failed');
    return {};
  }
};
