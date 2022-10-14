/* eslint-disable no-unused-vars */

//axios request

import { AxiosError, ServerResponse } from '@/lib/api';
import { transformRequestOptions } from '@/lib/helper';
import { request } from '@/lib/request';
import { showErrorToast } from 'common/toast/toastFunctions';
import { Dispatch, SetStateAction } from 'react';
import {
  createReportsListServiceResponseProps,
  deleteReportServiceResponseProps,
  generateInstantReportResponseProp,
  getReportsHistoryListServiceResponseProps,
  getReportsListServiceResponseProps,
  getReportsWidgetListServiceResponseProps,
  reportHistoryDetailsResponseProp,
  ReportsListServiceProps,
  scheduleReportServiceResponseProps,
  updateReportsListServiceResponseProps
} from '../interfaces/reports.interface';

export const getReportsListService = async(
  args: { workspaceId: string; params: Record<string, unknown> },
  loading?: Dispatch<SetStateAction<boolean>>
) => {
  try {
    loading?.(true);
    const response: ServerResponse<getReportsListServiceResponseProps> = await request.get(`/v1/${args.workspaceId}/reports`, {
      params: args.params,
      paramsSerializer: (params) => transformRequestOptions(params)
    });

    const responseData = response?.data?.data;
    return responseData;
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    loading?.(false);
  }
};
export const dispatchReportsListService = async(args: Omit<ReportsListServiceProps, 'reportId'>, loading?: Dispatch<SetStateAction<boolean>>) => {
  try {
    loading?.(true);
    const response: ServerResponse<createReportsListServiceResponseProps> = await request.post(`/v1/${args.workspaceId}/reports`, args.body);

    const responseData = response?.data?.data;
    return responseData;
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    loading?.(false);
  }
};

export const removeReportService = async(args: { workspaceId: string; reportId: string }, loading?: (type: string, loader: boolean) => void) => {
  try {
    loading?.('RemoveReportLoader', true);
    const response: ServerResponse<deleteReportServiceResponseProps> = await request.delete(`/v1/${args.workspaceId}/reports/${args.reportId}`);

    const responseData = response?.data?.data;
    return responseData;
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    loading?.('RemoveReportLoader', false);
  }
};

export const scheduleReportService = async(
  args: { workspaceId: string; reportId: string; body: { schedule: boolean } },
  loading: { (type: string, loader: boolean): void }
) => {
  try {
    loading?.('ScheduleReportLoader', true);
    const response: ServerResponse<scheduleReportServiceResponseProps> = await request.patch(
      `/v1/${args.workspaceId}/reports/schedule/${args.reportId}`,
      args.body
    );

    const responseData = response?.data?.data;
    return responseData;
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    loading?.('ScheduleReportLoader', false);
  }
};

export const getReportsHistoryListService = async(
  args: { workspaceId: string; reportId: string; params: Record<string, unknown> },
  loading?: Dispatch<SetStateAction<boolean>>
) => {
  try {
    loading?.(true);
    const response: ServerResponse<getReportsHistoryListServiceResponseProps> = await request.get(
      `/v1/${args.workspaceId}/reports/history/${args.reportId}`,
      {
        params: args.params,
        paramsSerializer: (params) => transformRequestOptions(params)
      }
    );

    const responseData = response?.data?.data;
    return responseData;
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    loading?.(false);
  }
};

export const getReportWidgetsListService = async(
  args: { workspaceId: string; reportId: string; params: Record<string, unknown> },
  loading?: Dispatch<SetStateAction<boolean>>
) => {
  try {
    loading?.(true);
    const response: ServerResponse<getReportsWidgetListServiceResponseProps> = await request.get(
      `/v1/${args.workspaceId}/reports/widgets/${args.reportId}`,
      {
        params: args.params,
        paramsSerializer: (params) => transformRequestOptions(params)
      }
    );
    const responseData = response?.data?.data;
    return responseData;
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    loading?.(false);
  }
};

export const dispatchUpdateReportsListService = async(args: ReportsListServiceProps, loading?: Dispatch<SetStateAction<boolean>>) => {
  try {
    loading?.(true);
    const response: ServerResponse<updateReportsListServiceResponseProps> = await request.put(`/v1/${args.workspaceId}/reports/${args.reportId}`, args.body);

    const responseData = response?.data?.data;
    return responseData;
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    loading?.(false);
  }
};

export const generateInstantReportsService = async(args: {workspaceId:string, reportId:string}, loading?: Dispatch<SetStateAction<boolean>>) => {
  try {
    loading?.(true);
    const response: ServerResponse<generateInstantReportResponseProp> = await request.post(`/v1/${args.workspaceId}/reports/generate/${args.reportId}`);

    const responseData = response?.data?.data;
    return responseData;
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    loading?.(false);
  }
};

export const getReportHistoryDetailsListService = async(
  args: { workspaceId: string; reportHistoryId: string },
  loading?: Dispatch<SetStateAction<boolean>>
) => {
  try {
    loading?.(true);
    const response: ServerResponse<reportHistoryDetailsResponseProp> = await request.get(
      `/v1/${args.workspaceId}/reports/history-details/${args.reportHistoryId}`
    );
    const responseData = response?.data?.data;
    return responseData;
  } catch (e) {
    const error = e as AxiosError<unknown>;
    showErrorToast(error?.response?.data?.message);
  } finally {
    loading?.(false);
  }
};
