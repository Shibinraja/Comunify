/* eslint-disable space-before-function-paren */
import { transformRequestOptions } from '@/lib/helper';
import { GlobalSearchDataResponse, SearchSuggestionArgsType } from 'common/topBar/TopBarTypes';
import { showErrorToast } from '../../../common/toast/toastFunctions';
import { HealthScoreWidgetData, WidgetFilters } from '../../../common/widgetLayout/WidgetTypes';
import { API_ENDPOINT } from '../../../lib/config';
import { request } from '../../../lib/request';
import { MembersProfileActivityGraphData } from '../../members/interface/members.interface';
import {
  ActivitiesWidgetData,
  MemberWidgetData,
  QuickInfoData,
  RequestForWidget,
  RequestForWidgetResponse,
  SidePanelWidgetsList
} from '../interface/dashboard.interface';

export const getSidePanelWidgetsService = async (scope: string, workspaceId: string, search?: string): Promise<SidePanelWidgetsList[]> => {
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

export const quickInfoWidgetService = async (workspaceId: string, filters: WidgetFilters): Promise<QuickInfoData[]> => {
  try {
    const { data } = await request.get(`${API_ENDPOINT}/v1/${workspaceId}/widgets/quick-info`, { params: filters, paramsSerializer: (params) => transformRequestOptions(params) });
    return data?.data as QuickInfoData[];
  } catch {
    showErrorToast('Failed to load quick info widget data');
    return [];
  }
};

export const healthScoreWidgetDataService = async (workspaceId: string, filters: WidgetFilters): Promise<HealthScoreWidgetData[]> => {
  try {
    const { data } = await request.get(`${API_ENDPOINT}/v1/${workspaceId}/widgets/health-score`, { params: filters, paramsSerializer: (params) => transformRequestOptions(params) });
    return data?.data as HealthScoreWidgetData[];
  } catch {
    showErrorToast('Failed to load health score widget data');
    return [];
  }
};

export const activitiesWidgetDataService = async (workspaceId: string, filters: WidgetFilters): Promise<ActivitiesWidgetData[]> => {
  try {
    const { data } = await request.get(`${API_ENDPOINT}/v1/${workspaceId}/widgets/activity`, { params: { ...filters }, paramsSerializer: (params) => transformRequestOptions(params) });
    return data?.data?.data as ActivitiesWidgetData[];
  } catch {
    showErrorToast('Failed to load activity widget data');
    return [];
  }
};

export const membersWidgetDataService = async (workspaceId: string, filters: WidgetFilters): Promise<MemberWidgetData[]> => {
  try {
    const { data } = await request.get(`${API_ENDPOINT}/v1/${workspaceId}/widgets/member`, { params: { ...filters }, paramsSerializer: (params) => transformRequestOptions(params) });
    return data?.data?.data as MemberWidgetData[];
  } catch {
    showErrorToast('Failed to load members widget data');
    return [];
  }
};

export const activityGrowthWidgetDataService = async (workspaceId: string, filters: WidgetFilters): Promise<MembersProfileActivityGraphData> => {
  try {
    const { data } = await request.get(`${API_ENDPOINT}/v1/${workspaceId}/widgets/activity-growth`, { params: filters, paramsSerializer: (params) => transformRequestOptions(params) });
    return data?.data as MembersProfileActivityGraphData;
  } catch {
    showErrorToast('Failed to load activity growth widget data');
    return {} as MembersProfileActivityGraphData;
  }
};

export const memberGrowthWidgetDataService = async (workspaceId: string, filters: WidgetFilters): Promise<MembersProfileActivityGraphData> => {
  try {
    const { data } = await request.get(`${API_ENDPOINT}/v1/${workspaceId}/widgets/member-growth`, { params: filters, paramsSerializer: (params) => transformRequestOptions(params) });
    return data?.data as MembersProfileActivityGraphData;
  } catch {
    showErrorToast('Failed to load member growth widget data');
    return {} as MembersProfileActivityGraphData;
  }
};

export const requestForWidgetService = async (workspaceId: string, body: RequestForWidget): Promise<RequestForWidgetResponse> => {
  try {
    const { data } = await request.post(`${API_ENDPOINT}/v1/${workspaceId}/widgets/request`, body);
    return data?.data as RequestForWidgetResponse;
  } catch {
    showErrorToast('Request for widget failed');
    return {} as RequestForWidgetResponse;
  }
};


export const getGlobalSearchRequest = async(args:Partial<SearchSuggestionArgsType>):Promise<GlobalSearchDataResponse> => {
  try{
    const searchParams = ({
      ...(args.cursor ? { cursor: args.cursor }: {}),
      limit: 10,
      ...(args.search ? { search: args.search }: {})
    });
    const { data } = await request.get(`${API_ENDPOINT}/v1/${args.workspaceId}/dashboards/global`, { params: searchParams });
    return data?.data as GlobalSearchDataResponse;
  } catch {
    return {} as GlobalSearchDataResponse;
  }
};