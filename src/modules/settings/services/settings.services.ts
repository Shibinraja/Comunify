/* eslint-disable space-before-function-paren */
/* eslint-disable @typescript-eslint/ban-types */
import { DISCORD_CONNECT_ENDPOINT, API_ENDPOINT, SLACK_CONNECT_ENDPOINT, REDDIT_CONNECT_ENDPOINT, GITHUB_CONNECT_ENDPOINT } from '@/lib/config';
import { AxiosError } from 'axios';
import { showErrorToast } from '../../../common/toast/toastFunctions';
import { GeneratorResponse } from '../../../lib/api';
import { request } from '../../../lib/request';
import {
  assignTagProps,
  createTagProps,
  GetTagListQueryParams,
  ConnectedPlatforms,
  PlatformResponse,
  TagResponse,
  updateTagProps,
  unAssignTagProps,
  AssignTagsProps,
  SubscriptionDetails,
  UpdateSubscriptionBody,
  UpdateSubscriptionAutoRenewal,
  ClientSecret,
  AddedCardDetails,
  BillingHistoryQuery,
  BillingHistoryResponse,
  StripePaymentMethodId
} from '../interface/settings.interface';

export const NavigateToConnectPage = () => {
  window.location.href = SLACK_CONNECT_ENDPOINT;
};

export const NavigateToDiscordConnectPage = () => {
  window.location.href = DISCORD_CONNECT_ENDPOINT;
};

export const NavigateToRedditConnectPage = () => {
  window.location.href = REDDIT_CONNECT_ENDPOINT;
};

export const NavigateToGithubConnectPage = () => {
  window.location.href = GITHUB_CONNECT_ENDPOINT;
};

export function* PlatformsDataService(workspaceId: string): GeneratorResponse<Array<PlatformResponse>> {
  const { data } = yield request.get(`v1/${workspaceId}/platforms`);
  return data;
}

export function* ConnectedPlatformsDataService(workspaceId: string): GeneratorResponse<Array<ConnectedPlatforms>> {
  const { data } = yield request.get(`v1/${workspaceId}/platforms/connected`);
  return data;
}

export function* TagDataService(query: Partial<GetTagListQueryParams>): GeneratorResponse<TagResponse> {
  const { data } = yield request.get(
    `/v1/${query.workspaceId}/tags?page=${query.settingsQuery?.page}&limit=${query.settingsQuery?.limit}${
      query.settingsQuery?.tags.searchedTags ? `&search=${query.settingsQuery?.tags.searchedTags}` : ''
    }`
  );
  return data;
}

export function* CreateTagDataService(query: Partial<createTagProps>): GeneratorResponse<TagResponse> {
  const { data } = yield request.post(`/v1/${query.workspaceId}/tags`, query.tagBody);
  return data;
}

export function* UpdateTagDataService(params: updateTagProps): GeneratorResponse<TagResponse> {
  const { data } = yield request.put(`/v1/${params.workspaceId}/tags/${params.tagId}`, params.tagBody);
  return data;
}

export function* DeleteTagDataService(params: Omit<updateTagProps, 'tagBody'>): GeneratorResponse<TagResponse> {
  const { data } = yield request.delete(`/v1/${params.workspaceId}/tags/${params.tagId}`);
  return data;
}

export function* AssignTagDataService(params: assignTagProps): GeneratorResponse<AssignTagsProps> {
  const { data } = yield request.post(`/v1/${params.workspaceId}/tags/${params.memberId}/assign`, params.assignTagBody);
  return data;
}

export function* UnAssignTagDataService(params: unAssignTagProps): GeneratorResponse<{}> {
  const { data } = yield request.post(`/v1/${params.workspaceId}/tags/${params.memberId}/delete`, params.unAssignTagBody);
  return data;
}

export const getChoseSubscriptionPlanDetailsService = async (): Promise<SubscriptionDetails> => {
  try {
    const data = await request.get(`${API_ENDPOINT}/v1/subscription/current-plan`);
    return data?.data?.data as SubscriptionDetails;
  } catch {
    return {} as SubscriptionDetails;
  }
};

export const setPlanAutoRenewalService = async (body: UpdateSubscriptionBody): Promise<UpdateSubscriptionAutoRenewal> => {
  try {
    const data = await request.put(`${API_ENDPOINT}/v1/subscription/update-subscription`, {
      autoRenewal: body?.autoRenewal,
      subscriptionId: body?.subscriptionId,
      userSubscriptionId: body?.userSubscriptionId
    });
    return data?.data?.data as UpdateSubscriptionAutoRenewal;
  } catch {
    return {} as UpdateSubscriptionAutoRenewal;
  }
};

export const getCardDetailsService = async (): Promise<AddedCardDetails[]> => {
  try {
    const data = await request.get(`${API_ENDPOINT}/v1/subscription/get-cards`);
    return data?.data?.data as AddedCardDetails[];
  } catch {
    return [];
  }
};

export const createCardService = async (): Promise<ClientSecret> => {
  try {
    const data = await request.post(`${API_ENDPOINT}/v1/subscription/create-card`);
    return data?.data?.data as ClientSecret;
  } catch {
    return {} as ClientSecret;
  }
};

export const deleteCardService = async (id: string) => {
  try {
    const data = await request.delete(`${API_ENDPOINT}/v1/subscription/delete-card/${id}`);
    return data;
  } catch (e) {
    const error = e as AxiosError<unknown>;
    if (error?.response?.data) {
      showErrorToast('Failed to delete payment card');
    }
    return '';
  }
};

export const selectCardService = async (id: string): Promise<AddedCardDetails> => {
  try {
    const data = await request.post(`${API_ENDPOINT}/v1/subscription/default-card/${id}`);
    return data?.data?.data as AddedCardDetails;
  } catch {
    showErrorToast('Failed to alter your current plan auto renewal setting');
    return {} as AddedCardDetails;
  }
};
// Billing history services

export const getBillingHistoryData = async (params: BillingHistoryQuery) => {
  try {
    const { data } = await request.get(`${API_ENDPOINT}/v1/subscription/billinghistory?page=${params.page}&limit=${params.limit}`);
    return data?.data as BillingHistoryResponse;
  } catch {
    showErrorToast('Failed to load billing history');
    return {} as BillingHistoryResponse;
  }
};

export const getBillingInvoice = async (invoiceId: string) => {
  try {
    const { data } = await request.get(`${API_ENDPOINT}/v1/subscription/downloadinvoice/${invoiceId}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer'
    });
    return data;
  } catch (error) {
    showErrorToast('Failed to download Pdf');
    return {};
  }
};

export const getNewlyAddedCardDetailsService = async (body: StripePaymentMethodId): Promise<AddedCardDetails> => {
  try {
    const { data } = await request.post(`${API_ENDPOINT}/v1/subscription/card/`, body);
    return data?.data as AddedCardDetails;
  } catch (e) {
    const error = e as AxiosError<any>;
    showErrorToast(error?.response?.data?.message);
    return {} as AddedCardDetails;
  }
};
